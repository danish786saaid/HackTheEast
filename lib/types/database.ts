export type DbUser = {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
};

export type DbContent = {
  id: string;
  owner: string;
  title: string;
  summary: string | null;
  source_url: string | null;
  source_type: "article" | "video" | "paper" | "course" | "podcast" | "rss" | "other";
  tags: string[];
  relevance_score: number;
  created_at: string;
};

export type DbTrackingRule = {
  id: string;
  user_id: string;
  topic: string;
  alert_trigger: "any_new" | "high_relevance" | "breaking" | "daily_digest";
  is_active: boolean;
  created_at: string;
};

export type DbContentAlert = {
  id: string;
  user_id: string;
  content_id: string;
  alert_message: string;
  is_read: boolean;
  severity: "info" | "warning" | "danger";
  created_at: string;
  content?: DbContent;
};

export type DbKnowledgePortfolio = {
  id: string;
  user_id: string;
  domain: string;
  proficiency: number;
  time_invested: number;
  created_at: string;
  tracked_topics?: DbTrackedTopic[];
};

export type DbTrackedTopic = {
  id: string;
  portfolio_id: string;
  topic: string;
  progress: number;
  created_at: string;
};

export type DbConfidenceGauge = {
  id: string;
  user_id: string;
  domain: string;
  confidence: number;
  created_at: string;
};

export type DbLearningTrend = {
  id: string;
  user_id: string;
  domain: string;
  progress: number;
  recorded_at: string;
};

export type DbActivity = {
  id: string;
  user_id: string;
  content_id: string | null;
  action: "read" | "bookmark" | "share" | "complete" | "quiz_pass" | "note" | "highlight" | "search";
  created_at: string;
  content?: DbContent;
};

export type DbTopicDistribution = {
  id: string;
  user_id: string;
  domain: string;
  count: number;
  created_at: string;
};

export type DbLearningPerformance = {
  id: string;
  user_id: string;
  period: string;
  score: number;
  created_at: string;
};

export type LearningPathStep = {
  order: number;
  title: string;
  done: boolean;
};

export type DbLearningPath = {
  id: string;
  user_id: string;
  path_name: string;
  steps: LearningPathStep[];
  is_active: boolean;
  created_at: string;
};
