import type { NextApiRequest, NextApiResponse } from "next";
import seedItems from "@/data/items_with_embeddings.json";
import {
  retrieve,
  keywordFallback,
  mockEmbedding,
  type SeedItem,
} from "@/lib/retriever";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { user_goal, top_k = 10 } = req.body;

  if (!user_goal || typeof user_goal !== "string") {
    return res.status(400).json({ error: "user_goal is required" });
  }

  const k = Math.min(Math.max(1, Number(top_k)), 20);
  const items = seedItems as SeedItem[];

  try {
    const goalEmbedding = mockEmbedding(user_goal, 32);
    const results = retrieve(goalEmbedding, items, k, 0.15);

    return res.status(200).json({
      goal: user_goal,
      top_k: k,
      method: "embedding",
      items: results.map(({ embedding, ...rest }) => rest),
    });
  } catch (err) {
    console.warn("[/api/retrieve] Embedding failed, using keyword fallback:", err);

    const results = keywordFallback(user_goal, items, k);
    return res.status(200).json({
      goal: user_goal,
      top_k: k,
      method: "keyword_fallback",
      items: results.map(({ embedding, ...rest }) => rest),
    });
  }
}
