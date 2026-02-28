/**
 * POST /api/verify_badge
 * PRD: Request { badge, signature } → Response { valid, message? }
 * Stub: returns valid: true for demo. Backend branch implements HMAC verification.
 */
const { verifyBadgeStub } = require("../../lib/api-stubs");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { badge, signature } = req.body || {};
    const result = await verifyBadgeStub(badge || {}, signature || "");
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
