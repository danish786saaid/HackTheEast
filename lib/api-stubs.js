/**
 * API stubs — load real data from ai/ folder.
 * Backend branch replaces these with full implementations.
 */

const { retrieveByGoal } = require("../ai/retriever");
const { generatePath, getCannedOutput, autoGeneratePath } = require("../ai/minimax");

async function retrieveStub(user_goal, top_k) {
  return retrieveByGoal(user_goal || "Understand LLM safety basics", top_k || 10);
}

async function generatePathStub(user_goal, items) {
  const goal = user_goal || "Understand LLM safety basics";

  const canned = getCannedOutput(goal);
  if (canned) return canned;

  const resolvedItems =
    items && items.length > 0 ? items : retrieveByGoal(goal, 10);
  return autoGeneratePath(goal, resolvedItems);
}

async function claimBadgeStub(user_id, goal, path) {
  const pathSummary =
    path && path.length
      ? path.map((p) => `${p.step}: ${p.item_title}`).join("; ")
      : "Read: LLM Safety Primer; Watch: RLHF Explained; Practice: Red-Teaming LLMs";
  const badge = {
    id: `badge_${Date.now()}`,
    user: user_id,
    goal,
    path_summary: pathSummary,
    issued_at: new Date().toISOString(),
  };
  return {
    badge,
    signature: "STUB_SIGNATURE_BASE64",
    l2_anchor_tx: "0xSTUB_L2_ANCHOR_TX",
  };
}

async function verifyBadgeStub(badge, signature) {
  return {
    valid: true,
    message: "Stub verification (backend implements HMAC)",
  };
}

module.exports = {
  retrieveStub,
  generatePathStub,
  claimBadgeStub,
  verifyBadgeStub,
};
