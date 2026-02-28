import type { NextApiRequest, NextApiResponse } from "next";
import { issueBadge } from "@/lib/badge-signing";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { user_id, goal, path } = req.body;

  if (!user_id || typeof user_id !== "string") {
    return res.status(400).json({ error: "user_id is required" });
  }

  if (!goal || typeof goal !== "string") {
    return res.status(400).json({ error: "goal is required" });
  }

  if (!path || !Array.isArray(path) || path.length === 0) {
    return res.status(400).json({ error: "path array is required" });
  }

  try {
    const signed = issueBadge(user_id, goal, path);

    return res.status(200).json(signed);
  } catch (err) {
    console.error("[/api/claim_badge]", err);
    return res.status(500).json({
      error: "Badge issuance failed",
      badge: {
        id: `badge_fallback_${Date.now()}`,
        user: user_id,
        goal,
        path_summary: path.map((s: { step: string; item_title: string }) => `${s.step}: ${s.item_title}`).join("; "),
        issued_at: new Date().toISOString(),
      },
      signature: "SIMULATED",
      l2_anchor_tx: "0x0000000000000000000000000000000000000000",
    });
  }
}
