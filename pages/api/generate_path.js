/**
 * POST /api/generate_path
 * PRD: Request { user_goal, items } → Response { goal, path[], rationale, use_canned? }
 *
 * Tries MiniMax LLM first, then canned outputs, then auto-generated fallback.
 * If no items are provided, retrieves them automatically.
 */
const { generatePath } = require("../../ai/minimax");
const { retrieveByGoal } = require("../../ai/retriever");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { user_goal, items } = req.body || {};
    const goal = user_goal || "Understand LLM safety basics";

    const resolvedItems =
      items && items.length > 0 ? items : retrieveByGoal(goal, 10);

    const result = await generatePath(goal, resolvedItems);
    return res.status(200).json(result);
  } catch (e) {
    console.error("[/api/generate_path] Error:", e);
    return res.status(500).json({ error: e.message });
  }
}
