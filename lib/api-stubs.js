/**
 * API stubs — return mock data matching PRD response shapes.
 * Backend branch replaces these with real implementations.
 */

const MOCK_ITEMS = [
  { id: "1", title: "LLM Safety Primer", url: "https://example.com/1", type: "article", description: "Introduction to LLM safety", date: "2026-02-20", similarity: 0.92, recency_score: 0.8, score: 0.94 },
  { id: "2", title: "RLHF Explained", url: "https://example.com/2", type: "video", description: "Reinforcement learning from human feedback", date: "2026-02-18", similarity: 0.88, recency_score: 0.7, score: 0.86 },
  { id: "3", title: "Alignment Hands-On Exercise", url: "https://example.com/3", type: "practice", description: "Practice red-teaming an LLM", date: "2026-02-15", similarity: 0.85, recency_score: 0.6, score: 0.82 },
  { id: "4", title: "GMAsia AI Ethics Panel", url: "https://example.com/4", type: "video", description: "Panel on AI ethics in Asia", date: "2026-02-10", similarity: 0.78, recency_score: 0.5, score: 0.74 },
  { id: "5", title: "Constitutional AI Overview", url: "https://example.com/5", type: "article", description: "Constitutional AI principles", date: "2026-02-05", similarity: 0.75, recency_score: 0.4, score: 0.70 },
];

const MOCK_PATH = {
  goal: "Understand LLM safety basics",
  path: [
    { step: "Read", item_title: "LLM Safety Primer", item_url: "https://example.com/1", tldr: "Core concepts of LLM safety and alignment.", minutes: 15 },
    { step: "Watch", item_title: "RLHF Explained", item_url: "https://example.com/2", tldr: "How human feedback shapes model behavior.", minutes: 20 },
    { step: "Practice", item_title: "Alignment Hands-On Exercise", item_url: "https://example.com/3", tldr: "Try red-teaming a model yourself.", minutes: 30 },
  ],
  rationale: "Read-Watch-Practice sequence builds foundational knowledge before hands-on application.",
  use_canned: true,
};

export async function retrieveStub(user_goal, top_k) {
  return MOCK_ITEMS.slice(0, Math.min(top_k, MOCK_ITEMS.length));
}

export async function generatePathStub(user_goal, items) {
  return {
    ...MOCK_PATH,
    goal: user_goal || MOCK_PATH.goal,
    use_canned: true,
  };
}

export async function claimBadgeStub(user_id, goal, path) {
  const pathSummary = (path && path.length)
    ? path.map((p) => `${p.step}: ${p.item_title}`).join("; ")
    : "Read: LLM Safety Primer; Watch: RLHF Explained; Practice: Alignment Hands-On Exercise";
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

export async function verifyBadgeStub(badge, signature) {
  return { valid: true, message: "Stub verification (backend implements HMAC)" };
}
