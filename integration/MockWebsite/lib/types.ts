/**
 * BadgeForge shared types — PRD-aligned.
 * Import from @/lib/types in frontend and backend.
 */

// --- Retrieve API ---
export type RetrieveRequest = {
  user_goal: string;
  top_k?: number;
};

export type RetrievedItem = {
  id: string;
  title: string;
  url: string;
  type: "article" | "video" | "practice" | "other";
  description: string;
  date?: string;
  similarity: number;
  recency_score: number;
  score: number;
};

export type RetrieveResponse = {
  items: RetrievedItem[];
};

// --- Generate Path API ---
export type PathStepType = "Read" | "Watch" | "Practice";

export type PathStep = {
  step: PathStepType;
  item_title: string;
  item_url: string;
  tldr: string;
  minutes: number;
};

export type GeneratePathRequest = {
  user_goal: string;
  items: RetrievedItem[];
};

export type GeneratePathResponse = {
  goal: string;
  path: PathStep[];
  rationale: string;
  use_canned?: boolean;
};

// --- Claim Badge API ---
export type ClaimBadgeRequest = {
  user_id: string;
  goal: string;
  path: PathStep[];
};

export type Badge = {
  id: string;
  user: string;
  goal: string;
  path_summary: string;
  issued_at: string; // ISO 8601
};

export type ClaimBadgeResponse = {
  badge: Badge;
  signature: string; // BASE64 HMAC-SHA256
  l2_anchor_tx?: string; // Simulated for hackathon
};

// --- Verify Badge API ---
export type VerifyBadgeRequest = {
  badge: Badge;
  signature: string;
};

export type VerifyBadgeResponse = {
  valid: boolean;
  message?: string;
};

// --- Seed item (for items.json / items_with_embeddings.json) ---
export type SeedItem = {
  id: string;
  title: string;
  url: string;
  type: "article" | "video" | "practice" | "other";
  description: string;
  date?: string;
  embedding?: number[]; // Optional; ai/ adds these
};

// --- Dashboard data ---
export type DashboardTutorial = {
  id: string;
  title: string;
  slug: string;
  currentModule: number;
  totalModules: number;
  progress: number; // 0-100
  estimatedHours: number;
  lastReadAt: string; // ISO 8601
};

export type DashboardAlert = {
  id: string;
  title: string;
  severity: "info" | "success" | "warning" | "danger";
  time: string;
  read: boolean;
};

export type DailyActivity = {
  day: string; // Mon, Tue, ...
  minutesRead: number;
  articlesRead: number;
  quizzesCompleted: number;
};

export type CategoryEngagement = {
  id: string; // e.g. "ai", "defi"
  categoryId: string; // e.g. "No.101" — displayed on block
  label: string; // e.g. "AI & ML"
  totalMinutes: number; // drives block size (not shown, only affects size)
  quizzesDone: number;
  articlesRead: number;
};
