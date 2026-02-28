/**
 * POST /api/claim_badge
 * PRD: Request { user_id, goal, path } → Response { badge, signature, l2_anchor_tx }
 * Stub: returns mock signed badge. Backend branch implements HMAC signing.
 */
const { claimBadgeStub } = require("../../lib/api-stubs");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { user_id, goal, path } = req.body || {};
    const result = await claimBadgeStub(user_id || "user@example.com", goal || "Demo goal", path || []);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
