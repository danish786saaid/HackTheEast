const STORAGE_KEY = "badgeforge-user-preferences";

export type UserPreferences = {
  role: string;
  interests: string[];
  level: string;
};

export const ROLES = [
  {
    id: "learner",
    label: "Learner",
    description:
      "I want to stay ahead and upskill in emerging fields with AI-curated content.",
  },
  {
    id: "educator",
    label: "Educator",
    description:
      "I create courses or teach — I need fresh, relevant material surfaced automatically.",
  },
  {
    id: "institution",
    label: "Institution / Team",
    description:
      "We need a shared knowledge base with adaptive paths for our team members.",
  },
] as const;

export const TOPICS = [
  "DeFi & DEXs",
  "AI & Machine Learning",
  "Blockchain Regulation",
  "Crypto Markets",
  "Web3 Development",
  "AI Ethics & Safety",
  "Layer 2 Solutions",
  "Tokenomics",
  "NFTs & Digital Assets",
  "Privacy & Security",
  "Smart Contracts",
  "DAO Governance",
  "Quantum Computing",
  "Fintech",
  "Data Science",
  "Cybersecurity",
] as const;

export const LEVELS = [
  {
    id: "beginner",
    label: "Beginner",
    description:
      "New to this space — I want guided, foundational content to build understanding.",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    description:
      "I have working knowledge and want deeper dives and curated updates.",
  },
  {
    id: "advanced",
    label: "Advanced",
    description:
      "I'm experienced — surface cutting-edge research, analysis, and niche topics.",
  },
] as const;

const defaults: UserPreferences = {
  role: "learner",
  interests: [],
  level: "intermediate",
};

export function loadUserPreferences(): UserPreferences {
  if (typeof window === "undefined") return defaults;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<UserPreferences>;
    return {
      role: parsed.role ?? defaults.role,
      interests: Array.isArray(parsed.interests) ? parsed.interests : defaults.interests,
      level: parsed.level ?? defaults.level,
    };
  } catch {
    return defaults;
  }
}

export function saveUserPreferences(prefs: Partial<UserPreferences>): void {
  if (typeof window === "undefined") return;
  const current = loadUserPreferences();
  const next: UserPreferences = {
    role: prefs.role ?? current.role,
    interests: prefs.interests ?? current.interests,
    level: prefs.level ?? current.level,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
