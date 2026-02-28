/**
 * MiniMax LLM client — generates 3-step adaptive learning paths.
 *
 * Tries MiniMax API first, falls back to canned outputs, then auto-generates
 * a simple path from top-scored items as last resort.
 */

const fs = require("fs");
const path = require("path");

const SYSTEM_PROMPT = fs
  .readFileSync(path.join(__dirname, "prompt.txt"), "utf-8")
  .trim();

const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY || "";
const MINIMAX_GROUP_ID = process.env.MINIMAX_GROUP_ID || "";

let _cannedCache = null;

function loadCanned() {
  if (_cannedCache) return _cannedCache;
  _cannedCache = require(path.join(__dirname, "canned_outputs.json"));
  return _cannedCache;
}

/**
 * Call MiniMax LLM to generate a learning path.
 */
async function generateWithMiniMax(goal, items) {
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
    throw new Error(`MiniMax API ${response.status}: ${text}`);
  }

  const data = await response.json();
  const content =
    data?.choices?.[0]?.message?.content ?? data?.reply ?? "";

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("MiniMax response did not contain valid JSON");
  }

  const parsed = JSON.parse(jsonMatch[0]);
  parsed.use_canned = false;
  return parsed;
}

/**
 * Match a goal to canned outputs using keyword overlap.
 */
function getCannedOutput(goal) {
  const canned = loadCanned();
  const goals = canned.goals || {};

  if (goals[goal]) {
    return { ...goals[goal], use_canned: true };
  }

  const lowerGoal = goal.toLowerCase();
  for (const [key, value] of Object.entries(goals)) {
    if (
      lowerGoal.includes(key.toLowerCase()) ||
      key.toLowerCase().includes(lowerGoal)
    ) {
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
}

/**
 * Build a simple fallback path from top-scored retrieved items.
 */
function autoGeneratePath(goal, items) {
  const readItem = items.find((i) => i.type === "article");
  const watchItem = items.find((i) => i.type === "video");
  const practiceItem = items.find((i) => i.type === "practice");

  const pathSteps = [];
  if (readItem) {
    pathSteps.push({
      step: "Read",
      item_title: readItem.title,
      item_url: readItem.url,
      tldr: readItem.description,
      minutes: 25,
    });
  }
  if (watchItem) {
    pathSteps.push({
      step: "Watch",
      item_title: watchItem.title,
      item_url: watchItem.url,
      tldr: watchItem.description,
      minutes: 25,
    });
  }
  if (practiceItem) {
    pathSteps.push({
      step: "Practice",
      item_title: practiceItem.title,
      item_url: practiceItem.url,
      tldr: practiceItem.description,
      minutes: 30,
    });
  }

  if (pathSteps.length === 0 && items.length > 0) {
    pathSteps.push({
      step: "Read",
      item_title: items[0].title,
      item_url: items[0].url,
      tldr: items[0].description,
      minutes: 30,
    });
  }

  return {
    goal,
    path: pathSteps,
    rationale: "Auto-generated fallback path from top-scored items.",
    use_canned: true,
  };
}

/**
 * Generate a learning path: MiniMax → canned → auto-generated fallback.
 */
async function generatePath(goal, items) {
  try {
    return await generateWithMiniMax(goal, items);
  } catch (err) {
    console.warn("[minimax] LLM failed, trying canned:", err.message);
  }

  const canned = getCannedOutput(goal);
  if (canned) return canned;

  return autoGeneratePath(goal, items);
}

module.exports = {
  generatePath,
  generateWithMiniMax,
  getCannedOutput,
  autoGeneratePath,
};
