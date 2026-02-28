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
