/**
 * POST /api/generate_path
 * PRD: Request { user_goal, items } → Response { goal, path[], rationale }
 * Stub: returns canned output. Backend branch integrates MiniMax LLM.
 */
const { generatePathStub } = require("../../lib/api-stubs");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { user_goal, items } = req.body || {};
    const result = await generatePathStub(user_goal || "Understand LLM safety basics", items || []);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
