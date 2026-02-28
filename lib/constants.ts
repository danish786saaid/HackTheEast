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

export type MockNotificationType = "badge" | "content" | "tutorial" | "alert" | "system";

export type MockNotification = {
  id: string;
  type: MockNotificationType;
  title: string;
  time: string;
  avatar: "Brain" | "FileText" | "BookOpen" | "AlertTriangle" | "Award" | "Mail";
};

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: "n1",
    type: "badge",
    title: "AI & ML mastery badge earned",
    time: "3 min ago",
    avatar: "Brain",
  },
  {
    id: "n2",
    type: "content",
    title: "New article: GPT-5 Technical Report",
    time: "15 min ago",
    avatar: "FileText",
  },
  {
    id: "n3",
    type: "tutorial",
    title: "DeFi tutorial — Module 4 unlocked",
    time: "1 hour ago",
    avatar: "BookOpen",
  },
  {
    id: "n4",
    type: "alert",
    title: "EU AI Act enforcement update",
    time: "2 hours ago",
    avatar: "AlertTriangle",
  },
  {
    id: "n5",
    type: "badge",
    title: "Blockchain Fundamentals step completed",
    time: "3 hours ago",
    avatar: "Award",
  },
  {
    id: "n6",
    type: "system",
    title: "Weekly learning digest ready",
    time: "5 hours ago",
    avatar: "Mail",
  },
];

export type BadgeStepStatus = "completed" | "active" | "locked";

export type BadgeStep = { label: string; status: BadgeStepStatus };

export type BadgeType = "mastery" | "tutorial";

export const MOCK_BADGES: {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: BadgeType;
  steps: BadgeStep[];
  achieved: boolean;
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
    steps: [
      { label: "Learn", status: "completed" },
      { label: "Practice", status: "locked" },
      { label: "Master", status: "locked" },
    ],
    achieved: false,
  },
];
