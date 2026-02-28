import type { NextApiRequest, NextApiResponse } from "next";
import { verifyBadge, type Badge } from "@/lib/badge-signing";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { badge, signature } = req.body;

  if (!badge || typeof badge !== "object") {
    return res.status(400).json({ error: "badge object is required" });
  }

  if (!signature || typeof signature !== "string") {
    return res.status(400).json({ error: "signature string is required" });
  }

  const requiredFields: (keyof Badge)[] = ["id", "user", "goal", "path_summary", "issued_at"];
  for (const field of requiredFields) {
    if (!badge[field]) {
      return res.status(400).json({ error: `badge.${field} is required` });
    }
  }

  try {
    if (signature === "SIMULATED") {
      return res.status(200).json({
        valid: false,
        reason: "Signature is SIMULATED (badge issuance fell back to fallback mode)",
      });
    }

    const valid = verifyBadge(badge as Badge, signature);

    return res.status(200).json({
      valid,
      badge_id: badge.id,
      issued_at: badge.issued_at,
      reason: valid
        ? "HMAC-SHA256 signature verified successfully"
        : "Signature does not match badge payload — badge may have been tampered with",
    });
  } catch (err) {
    console.error("[/api/verify_badge]", err);
    return res.status(500).json({
      valid: false,
      reason: `Verification error: ${(err as Error).message}`,
    });
  }
}
