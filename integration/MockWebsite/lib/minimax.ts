import type { ScoredItem } from "./retriever";

export interface PathStep {
  step: "Read" | "Watch" | "Practice";
  item_title: string;
  item_url: string;
  tldr: string;
  minutes: number;
}

export interface GeneratedPath {
  goal: string;
  path: PathStep[];
  rationale: string;
  use_canned?: boolean;
}

const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY || "";
const MINIMAX_GROUP_ID = process.env.MINIMAX_GROUP_ID || "";

const SYSTEM_PROMPT = `You are an expert learning designer. Given a user goal and a list of up to 10 curated items (title, url, type, one-line description), produce a concise 3-step adaptive learning path. Each step must include: step type Read or Watch or Practice; one item from the list; a one-sentence TLDR; estimated time in minutes. Keep total time under 90 minutes. Output JSON with keys: goal, path[ {step, item_title, item_url, tldr, minutes} ], rationale.`;

/**
 * Call MiniMax LLM to generate a learning path.
 * Falls back to canned outputs if the API is unavailable.
 */
export async function generatePathWithMiniMax(
  goal: string,
  items: ScoredItem[]
): Promise<GeneratedPath> {
  if (!MINIMAX_API_KEY) {
    throw new Error("MINIMAX_API_KEY not set");
  }

  const itemList = items
    .slice(0, 10)
    .map(
      (item, i) =>
        `${i + 1}. Title: ${item.title} | URL: ${item.url} | Type: ${item.type} | Description: ${item.description}`
    )
    .join("\n");

  const userMessage = `User goal: "${goal}"\n\nCurated items:\n${itemList}`;

  const url = MINIMAX_GROUP_ID
    ? `https://api.minimax.chat/v1/text/chatcompletion_v2?GroupId=${MINIMAX_GROUP_ID}`
    : "https://api.minimax.chat/v1/text/chatcompletion_v2";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MINIMAX_API_KEY}`,
    },
    body: JSON.stringify({
      model: "abab6.5s-chat",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`MiniMax API error ${response.status}: ${text}`);
  }

  const data = await response.json();
  const content =
    data?.choices?.[0]?.message?.content ??
    data?.reply ??
    "";

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("MiniMax response did not contain valid JSON");
  }

  const parsed: GeneratedPath = JSON.parse(jsonMatch[0]);
  parsed.use_canned = false;
  return parsed;
}

/**
 * Load canned outputs and match by goal string.
 */
export async function getCannedOutput(goal: string): Promise<GeneratedPath | null> {
  try {
    const canned = await import("@/data/canned_outputs.json");
    const goals = canned.goals as Record<string, GeneratedPath>;

    if (goals[goal]) {
      return { ...goals[goal], use_canned: true };
    }

    const lowerGoal = goal.toLowerCase();
    for (const [key, value] of Object.entries(goals)) {
      if (lowerGoal.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerGoal)) {
        return { ...value, goal, use_canned: true };
      }
    }

    const goalWords = lowerGoal.split(/\W+/).filter((w) => w.length > 3);
    for (const [key, value] of Object.entries(goals)) {
      const keyLower = key.toLowerCase();
      const overlap = goalWords.filter((w) => keyLower.includes(w)).length;
      if (overlap >= 2) {
        return { ...value, goal, use_canned: true };
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Generate path: try MiniMax first, then canned fallback.
 */
export async function generatePath(
  goal: string,
  items: ScoredItem[]
): Promise<GeneratedPath> {
  try {
    return await generatePathWithMiniMax(goal, items);
  } catch (err) {
    console.warn("[generatePath] MiniMax failed, trying canned:", (err as Error).message);
  }

  const canned = await getCannedOutput(goal);
  if (canned) return canned;

  // Last resort: build a simple path from top items
  const readItem = items.find((i) => i.type === "article");
  const watchItem = items.find((i) => i.type === "video");
  const practiceItem = items.find((i) => i.type === "practice");

  const path: PathStep[] = [];
  if (readItem) {
    path.push({
      step: "Read",
      item_title: readItem.title,
      item_url: readItem.url,
      tldr: readItem.description,
      minutes: 25,
    });
  }
  if (watchItem) {
    path.push({
      step: "Watch",
      item_title: watchItem.title,
      item_url: watchItem.url,
      tldr: watchItem.description,
      minutes: 30,
    });
  }
  if (practiceItem) {
    path.push({
      step: "Practice",
      item_title: practiceItem.title,
      item_url: practiceItem.url,
      tldr: practiceItem.description,
      minutes: 30,
    });
  }

  if (path.length === 0 && items.length > 0) {
    path.push({
      step: "Read",
      item_title: items[0].title,
      item_url: items[0].url,
      tldr: items[0].description,
      minutes: 30,
    });
  }

  return {
    goal,
    path,
    rationale: "Auto-generated fallback path from top-scored items.",
    use_canned: true,
  };
}
