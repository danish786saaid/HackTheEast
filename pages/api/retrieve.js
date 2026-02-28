/**
 * POST /api/retrieve
 * PRD: Request { user_goal, top_k } → Response { items[] with similarity, recency_score, score }
 * Stub: returns mock data. Backend branch implements real embedding + ranking.
 */
const { retrieveStub } = require("../../lib/api-stubs");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { user_goal, top_k = 10 } = req.body || {};
    const items = await retrieveStub(user_goal || "Understand LLM safety basics", top_k);
    return res.status(200).json({ items });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
