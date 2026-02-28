export const MOCK_KPI = [
  {
    label: "Topics Tracked",
    value: "12",
    change: "+3",
    changeLabel: "this week",
    positive: true,
  },
  {
    label: "Articles Read",
    value: "47",
    change: "+12",
    changeLabel: "vs last week",
    positive: true,
  },
  {
    label: "Time Saved",
    value: "6.2h",
    change: "+1.8h",
    changeLabel: "from AI summaries",
    positive: true,
  },
  {
    label: "Knowledge Score",
    value: "78%",
    change: "+5%",
    changeLabel: "overall mastery",
    positive: true,
  },
];

export const MOCK_ALERTS = [
  {
    id: "1",
    title: "New EU AI Act enforcement guidelines published",
    severity: "warning" as const,
    time: "5 min ago",
    matchedRule: "AI Regulation updates",
  },
  {
    id: "2",
    title: "OpenAI releases GPT-5 technical report",
    severity: "safe" as const,
    time: "25 min ago",
    matchedRule: "AI model releases",
  },
  {
    id: "3",
    title: "SEC proposes new crypto staking rules",
    severity: "warning" as const,
    time: "1 hour ago",
    matchedRule: "Crypto regulation",
  },
  {
    id: "4",
    title: "Major vulnerability found in popular ML framework",
    severity: "danger" as const,
    time: "3 hours ago",
    matchedRule: "AI security",
  },
];

export const MOCK_ACTIVITIES = [
  { id: "1", action: "AI summarised 8 articles on blockchain regulation", time: "10 min ago" },
  { id: "2", action: "Learning path updated: added 'AI Ethics' module", time: "30 min ago" },
  { id: "3", action: "Completed quiz: Transformer Architecture (92%)", time: "1 hour ago" },
  { id: "4", action: "Bookmarked: 'Zero-Knowledge Proofs Explained'", time: "2 hours ago" },
];

export const MOCK_TRACKING_RULES = [
  {
    id: "1",
    rule: "Alert me when new AI safety papers are published on arXiv",
    status: "active" as const,
  },
  {
    id: "2",
    rule: "Daily digest of crypto regulation news from US & EU",
    status: "active" as const,
  },
  {
    id: "3",
    rule: "Notify on major LLM benchmark updates",
    status: "active" as const,
  },
  {
    id: "4",
    rule: "Weekly summary of geopolitics & tech policy changes",
    status: "paused" as const,
  },
];

export type RuleCategoryId = "ai" | "crypto" | "geopolitics" | "career";

export const RULE_CATEGORIES: { id: RuleCategoryId; label: string; icon: string }[] = [
  { id: "ai", label: "AI & ML", icon: "Brain" },
  { id: "crypto", label: "Crypto & Blockchain", icon: "Coins" },
  { id: "geopolitics", label: "Geopolitics & Policy", icon: "Globe" },
  { id: "career", label: "Career & Skills", icon: "GraduationCap" },
];

export const MOCK_CONTENT_FEED: {
  id: string;
  title: string;
  source: string;
  time: string;
  relevance: "high" | "medium" | "low";
  url: string;
  domain: string;
}[] = [
  {
    id: "c1",
    title: "Attention Is All You Need: 7 Years Later — What Changed",
    source: "arXiv",
    time: "12 min ago",
    relevance: "high",
    url: "#",
    domain: "AI & ML",
  },
  {
    id: "c2",
    title: "EU Parliament votes on AI Act amendments for foundation models",
    source: "Reuters",
    time: "45 min ago",
    relevance: "high",
    url: "#",
    domain: "Geopolitics",
  },
  {
    id: "c3",
    title: "Zero-Knowledge Proofs: A Practical Guide for Developers",
    source: "Medium",
    time: "2 hours ago",
    relevance: "medium",
    url: "#",
    domain: "Crypto",
  },
  {
    id: "c4",
    title: "How to transition from SWE to ML Engineering in 2026",
    source: "Hacker News",
    time: "3 hours ago",
    relevance: "medium",
    url: "#",
    domain: "Career",
  },
  {
    id: "c5",
    title: "China releases new semiconductor export control framework",
    source: "Nikkei Asia",
    time: "5 hours ago",
    relevance: "low",
    url: "#",
    domain: "Geopolitics",
  },
];

export const MOCK_TUTORIALS = [
  {
    id: "tut1",
    title: "Introduction to DeFi",
    description: "Understand decentralised finance protocols, yield strategies, and the future of open banking.",
    modules: 5,
    duration: "45 min",
    level: "Beginner",
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80",
  },
  {
    id: "tut2",
    title: "AI Ethics & Governance",
    description: "Explore responsible AI frameworks, bias mitigation techniques, and global policy landscapes.",
    modules: 5,
    duration: "38 min",
    level: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80",
  },
  {
    id: "tut3",
    title: "Blockchain Fundamentals",
    description: "Learn core consensus mechanisms, smart-contract basics, and real-world enterprise use cases.",
    modules: 4,
    duration: "32 min",
    level: "Beginner",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80",
  },
];

export const MOCK_ACTIVE_TUTORIALS = [
  {
    id: "t1",
    title: "Introduction to DeFi",
    currentModule: 3,
    totalModules: 5,
    progress: 62,
  },
  {
    id: "t2",
    title: "AI Ethics & Governance",
    currentModule: 4,
    totalModules: 5,
    progress: 85,
  },
  {
    id: "t3",
    title: "Blockchain Fundamentals",
    currentModule: 1,
    totalModules: 4,
    progress: 15,
  },
];

export const LEARNING_HEALTH = [
  { label: "EFFICIENCY", value: "88%", sublabel: "completion rate" },
  { label: "TIME SAVED", value: "6.2", unit: "HRS", sublabel: "from AI summaries" },
  { label: "MASTERY", value: "78%", sublabel: "knowledge score" },
];

export const WEEKLY_STATS = [
  { label: "Articles", value: "47" },
  { label: "Quizzes", value: "12" },
  { label: "Hours", value: "6.2h" },
  { label: "Score", value: "+5%" },
];

export const LEARNING_NODES = [
  { id: "ai", label: "No.101", subtitle: "AI & ML", x: 28, y: 18, w: 160, h: 130, rotation: 12, filled: true },
  { id: "defi", label: "No.205", subtitle: "DeFi", x: 62, y: 12, w: 110, h: 95, rotation: -6, filled: false },
  { id: "chain", label: "No.302", subtitle: "Blockchain", x: 42, y: 50, w: 145, h: 120, rotation: 7, filled: true },
  { id: "policy", label: "No.410", subtitle: "Policy", x: 18, y: 68, w: 95, h: 85, rotation: -14, filled: false },
  { id: "ethics", label: "No.503", subtitle: "AI Ethics", x: 70, y: 55, w: 120, h: 105, rotation: 18, filled: false },
  { id: "smart", label: "No.608", subtitle: "Smart Contracts", x: 55, y: 80, w: 100, h: 90, rotation: -3, filled: true },
];

export const NODE_CONNECTIONS = [
  { from: "ai", to: "chain", x1: 38, y1: 32, x2: 50, y2: 52 },
  { from: "chain", to: "defi", x1: 55, y1: 50, x2: 65, y2: 22 },
  { from: "chain", to: "smart", x1: 52, y1: 62, x2: 58, y2: 82 },
  { from: "ai", to: "ethics", x1: 40, y1: 28, x2: 72, y2: 58 },
  { from: "policy", to: "chain", x1: 28, y1: 70, x2: 44, y2: 55 },
];

export const MOCK_TOPIC_DISTRIBUTION = [
  { name: "AI & ML", value: 45, color: "#f97316" },
  { name: "Crypto", value: 25, color: "#22c55e" },
  { name: "Geopolitics", value: 20, color: "#3b82f6" },
  { name: "Career", value: 10, color: "#a855f7" },
];

export const MOCK_LEARNING_TREND = [
  { day: "Mon", progress: 62, articles: 5 },
  { day: "Tue", progress: 65, articles: 8 },
  { day: "Wed", progress: 68, articles: 4 },
  { day: "Thu", progress: 72, articles: 10 },
  { day: "Fri", progress: 74, articles: 7 },
  { day: "Sat", progress: 76, articles: 6 },
  { day: "Sun", progress: 78, articles: 7 },
];

export type BadgeStepStatus = "completed" | "active" | "locked";

export type BadgeStep = { label: string; status: BadgeStepStatus };

export type BadgeType = "mastery" | "tutorial";

/** Streak data for any-activity tracking (articles, quizzes, tutorials) */
export const MOCK_STREAK = {
  currentStreak: 5,
  longestStreak: 12,
  /** 7-day activity heatmap: 0-100 intensity per day (most recent = last) */
  weekActivity: [85, 100, 70, 90, 100, 0, 95],
};

/** Category weekly activity for bar chart (7 values, 0-100) */
export const MOCK_CATEGORY_WEEKLY: Record<RuleCategoryId, number[]> = {
  ai: [90, 100, 80, 95, 100, 0, 85],
  crypto: [60, 70, 50, 80, 90, 0, 65],
  geopolitics: [40, 50, 30, 45, 55, 0, 35],
  career: [0, 20, 0, 10, 25, 0, 15],
};

/** Psychological achievement milestones */
export const MOCK_ACHIEVEMENTS = [
  // --- Row 1: always visible ---
  {
    id: "first-steps",
    title: "First Steps",
    description: "Complete your first tutorial step",
    icon: "Target",
    achieved: true,
    progress: 1,
    total: 1,
  },
  {
    id: "hat-trick",
    title: "Hat Trick",
    description: "Earn 3 badges",
    icon: "Trophy",
    achieved: false,
    progress: 2,
    total: 3,
  },
  {
    id: "week-warrior",
    title: "Week Warrior",
    description: "7-day streak",
    icon: "Flame",
    achieved: false,
    progress: 5,
    total: 7,
  },
  {
    id: "speed-learner",
    title: "Speed Learner",
    description: "Complete a tutorial in one session",
    icon: "Zap",
    achieved: true,
    progress: 1,
    total: 1,
  },
  {
    id: "full-house",
    title: "Full House",
    description: "Earn all badges in a category",
    icon: "Award",
    achieved: true,
    progress: 1,
    total: 1,
  },
  {
    id: "scholar",
    title: "Scholar",
    description: "Earn all badges",
    icon: "GraduationCap",
    achieved: false,
    progress: 2,
    total: 7,
  },
  // --- Row 2+: collapsed by default ---
  {
    id: "night-owl",
    title: "Night Owl",
    description: "Study past midnight 3 times",
    icon: "Moon",
    achieved: false,
    progress: 1,
    total: 3,
  },
  {
    id: "early-bird",
    title: "Early Bird",
    description: "Start a session before 7am",
    icon: "Sunrise",
    achieved: true,
    progress: 1,
    total: 1,
  },
  {
    id: "bookworm",
    title: "Bookworm",
    description: "Read 50 articles",
    icon: "BookOpen",
    achieved: false,
    progress: 47,
    total: 50,
  },
  {
    id: "quiz-master",
    title: "Quiz Master",
    description: "Score 90%+ on 5 quizzes",
    icon: "Brain",
    achieved: false,
    progress: 3,
    total: 5,
  },
  {
    id: "explorer",
    title: "Explorer",
    description: "Study all 4 categories",
    icon: "Compass",
    achieved: false,
    progress: 2,
    total: 4,
  },
  {
    id: "perfectionist",
    title: "Perfectionist",
    description: "100% on any quiz",
    icon: "Star",
    achieved: true,
    progress: 1,
    total: 1,
  },
  {
    id: "marathon",
    title: "Marathon",
    description: "30-day streak",
    icon: "Flame",
    achieved: false,
    progress: 5,
    total: 30,
  },
  {
    id: "social-learner",
    title: "Social Learner",
    description: "Share 3 badges publicly",
    icon: "Share2",
    achieved: false,
    progress: 0,
    total: 3,
  },
  {
    id: "deep-dive",
    title: "Deep Dive",
    description: "Spend 2+ hours in one session",
    icon: "Timer",
    achieved: false,
    progress: 0,
    total: 1,
  },
  {
    id: "comeback",
    title: "Comeback Kid",
    description: "Return after 7+ days away",
    icon: "RotateCcw",
    achieved: false,
    progress: 0,
    total: 1,
  },
  {
    id: "century",
    title: "Century",
    description: "Complete 100 learning steps",
    icon: "Trophy",
    achieved: false,
    progress: 34,
    total: 100,
  },
  {
    id: "polyglot",
    title: "Polyglot",
    description: "Master 3 different categories",
    icon: "Globe",
    achieved: false,
    progress: 1,
    total: 3,
  },
];

export const MOCK_BADGES: {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: BadgeType;
  steps: BadgeStep[];
  achieved: boolean;
  tutorialId?: string;
}[] = [
  // Category Mastery (4)
  {
    id: "mastery-ai",
    title: "AI & ML",
    description: "Master core concepts in artificial intelligence and machine learning.",
    icon: "Brain",
    type: "mastery",
    steps: [
      { label: "Learn", status: "completed" },
      { label: "Practice", status: "completed" },
      { label: "Master", status: "completed" },
    ],
    achieved: true,
  },
  {
    id: "mastery-crypto",
    title: "Crypto & Blockchain",
    description: "Demonstrate understanding of blockchain technology and cryptocurrencies.",
    icon: "Coins",
    type: "mastery",
    steps: [
      { label: "Learn", status: "completed" },
      { label: "Practice", status: "active" },
      { label: "Master", status: "locked" },
    ],
    achieved: false,
  },
  {
    id: "mastery-geopolitics",
    title: "Geopolitics & Policy",
    description: "Show competency in tech policy and geopolitical dynamics.",
    icon: "Globe",
    type: "mastery",
    steps: [
      { label: "Learn", status: "active" },
      { label: "Practice", status: "locked" },
      { label: "Master", status: "locked" },
    ],
    achieved: false,
  },
  {
    id: "mastery-career",
    title: "Career & Skills",
    description: "Prove proficiency in career development and skill-building paths.",
    icon: "GraduationCap",
    type: "mastery",
    steps: [
      { label: "Learn", status: "locked" },
      { label: "Practice", status: "locked" },
      { label: "Master", status: "locked" },
    ],
    achieved: false,
  },
  // Tutorial Completion (3)
  {
    id: "tutorial-defi",
    title: "Introduction to DeFi",
    description: "Complete the full 3-step path for decentralized finance fundamentals.",
    icon: "Wallet",
    type: "tutorial",
    tutorialId: "tut1",
    steps: [
      { label: "Learn", status: "completed" },
      { label: "Practice", status: "completed" },
      { label: "Master", status: "completed" },
    ],
    achieved: true,
  },
  {
    id: "tutorial-ethics",
    title: "AI Ethics & Governance",
    description: "Earn this badge by finishing Learn, Practice, and Master for AI Ethics.",
    icon: "Shield",
    type: "tutorial",
    tutorialId: "tut2",
    steps: [
      { label: "Learn", status: "completed" },
      { label: "Practice", status: "completed" },
      { label: "Master", status: "active" },
    ],
    achieved: false,
  },
  {
    id: "tutorial-blockchain",
    title: "Blockchain Fundamentals",
    description: "Unlock by completing all three steps of the blockchain tutorial.",
    icon: "Layers",
    type: "tutorial",
    tutorialId: "tut3",
    steps: [
      { label: "Learn", status: "completed" },
      { label: "Practice", status: "locked" },
      { label: "Master", status: "locked" },
    ],
    achieved: false,
  },
];
