import type { NextApiRequest, NextApiResponse } from "next";
import { generatePath } from "@/lib/minimax";
import type { ScoredItem } from "@/lib/retriever";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { user_goal, items } = req.body;

  if (!user_goal || typeof user_goal !== "string") {
    return res.status(400).json({ error: "user_goal is required" });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "items array is required (call /api/retrieve first)" });
  }

  try {
    const startTime = Date.now();
    const result = await generatePath(user_goal, items as ScoredItem[]);
    const latencyMs = Date.now() - startTime;

    return res.status(200).json({
      ...result,
      latency_ms: latencyMs,
    });
  } catch (err) {
    console.error("[/api/generate_path]", err);
    return res.status(500).json({
      error: "Path generation failed",
      detail: (err as Error).message,
    });
  }
}
