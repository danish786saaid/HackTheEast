import crypto from "crypto";

export interface Badge {
  id: string;
  user: string;
  goal: string;
  path_summary: string;
  issued_at: string;
}

export interface SignedBadge {
  badge: Badge;
  signature: string;
  l2_anchor_tx: string;
}

const BADGE_SECRET = process.env.BADGE_SECRET || "badge-forge-dev-secret";

export function createBadge(
  userId: string,
  goal: string,
  pathSteps: { step: string; item_title: string }[]
): Badge {
  const summary = pathSteps
    .map((s) => `${s.step}: ${s.item_title}`)
    .join("; ");

  return {
    id: `badge_${crypto.randomUUID().split("-")[0]}`,
    user: userId,
    goal,
    path_summary: summary,
    issued_at: new Date().toISOString(),
  };
}

export function signBadge(badge: Badge): string {
  const payload = JSON.stringify(badge);
  return crypto
    .createHmac("sha256", BADGE_SECRET)
    .update(payload)
    .digest("base64");
}

export function verifyBadge(badge: Badge, signature: string): boolean {
  const expected = signBadge(badge);
  return crypto.timingSafeEqual(
    Buffer.from(expected, "base64"),
    Buffer.from(signature, "base64")
  );
}

export function simulateL2Anchor(badgeId: string): string {
  const txHash = crypto
    .createHash("sha256")
    .update(`l2-anchor-${badgeId}-${Date.now()}`)
    .digest("hex");
  return `0x${txHash.slice(0, 40)}`;
}

export function issueBadge(
  userId: string,
  goal: string,
  pathSteps: { step: string; item_title: string }[]
): SignedBadge {
  const badge = createBadge(userId, goal, pathSteps);
  const signature = signBadge(badge);
  const l2_anchor_tx = simulateL2Anchor(badge.id);

  return { badge, signature, l2_anchor_tx };
}
