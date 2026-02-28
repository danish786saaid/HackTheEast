import { createClient } from "./supabase/client";
import type {
  DbContent,
  DbTrackingRule,
  DbContentAlert,
  DbKnowledgePortfolio,
  DbLearningTrend,
  DbActivity,
  DbTopicDistribution,
  DbLearningPerformance,
  DbLearningPath,
  DbConfidenceGauge,
} from "./types/database";

function getClient() {
  const supabase = createClient();
  if (!supabase) throw new Error("Supabase not configured — set env vars");
  return supabase;
}

// ── Content ────────────────────────────────────────────────
export async function fetchContent(limit = 20): Promise<DbContent[]> {
  const { data, error } = await getClient()
    .from("content")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

// ── Tracking Rules ─────────────────────────────────────────
export async function fetchTrackingRules(userId: string): Promise<DbTrackingRule[]> {
  const { data, error } = await getClient()
    .from("tracking_rules")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// ── Content Alerts ─────────────────────────────────────────
export async function fetchContentAlerts(userId: string): Promise<DbContentAlert[]> {
  const { data, error } = await getClient()
    .from("content_alerts")
    .select("*, content(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);
  if (error) throw error;
  return data ?? [];
}

// ── Knowledge Portfolio (with nested tracked_topics) ───────
export async function fetchKnowledgePortfolio(userId: string): Promise<DbKnowledgePortfolio[]> {
  const { data, error } = await getClient()
    .from("knowledge_portfolio")
    .select("*, tracked_topics(*)")
    .eq("user_id", userId)
    .order("domain");
  if (error) throw error;
  return data ?? [];
}

// ── Learning Trend ─────────────────────────────────────────
export async function fetchLearningTrend(userId: string, days = 7): Promise<DbLearningTrend[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await getClient()
    .from("learning_trend")
    .select("*")
    .eq("user_id", userId)
    .gte("recorded_at", since.toISOString())
    .order("recorded_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// ── Activities ─────────────────────────────────────────────
export async function fetchActivities(userId: string, limit = 10): Promise<DbActivity[]> {
  const { data, error } = await getClient()
    .from("activities")
    .select("*, content(title)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

// ── Topic Distribution ─────────────────────────────────────
export async function fetchTopicDistribution(userId: string): Promise<DbTopicDistribution[]> {
  const { data, error } = await getClient()
    .from("topic_distribution")
    .select("*")
    .eq("user_id", userId)
    .order("count", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// ── Learning Performance ───────────────────────────────────
export async function fetchLearningPerformance(userId: string): Promise<DbLearningPerformance[]> {
  const { data, error } = await getClient()
    .from("learning_performance")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// ── Learning Paths ─────────────────────────────────────────
export async function fetchLearningPaths(userId: string): Promise<DbLearningPath[]> {
  const { data, error } = await getClient()
    .from("learning_paths")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// ── Confidence Gauge ───────────────────────────────────────
export async function fetchConfidenceGauge(userId: string): Promise<DbConfidenceGauge[]> {
  const { data, error } = await getClient()
    .from("confidence_gauge")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// ── KPI Aggregations ───────────────────────────────────────
export async function fetchKpiData(userId: string) {
  const db = getClient();

  const [topics, content, portfolio, performance] = await Promise.all([
    db.from("topic_distribution").select("count").eq("user_id", userId),
    db.from("content").select("id", { count: "exact" }).eq("owner", userId),
    db.from("knowledge_portfolio").select("time_invested, proficiency").eq("user_id", userId),
    db
      .from("learning_performance")
      .select("score")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(2),
  ]);

  const topicCount = (topics.data ?? []).reduce((sum: number, r: Record<string, number>) => sum + (r.count ?? 0), 0);
  const articlesRead = content.count ?? 0;

  const totalMinutes = (portfolio.data ?? []).reduce((sum: number, r: Record<string, number>) => sum + (r.time_invested ?? 0), 0);
  const timeSavedHours = Math.round((totalMinutes / 60) * 10) / 10;

  const avgProficiency = (portfolio.data ?? []).length
    ? Math.round(
        (portfolio.data ?? []).reduce((sum: number, r: Record<string, number>) => sum + (r.proficiency ?? 0), 0) /
          (portfolio.data ?? []).length
      )
    : 0;

  const scores = (performance.data ?? []).map((r: Record<string, number>) => r.score);
  const scoreDiff = scores.length >= 2 ? scores[0] - scores[1] : 0;

  return {
    topicCount,
    articlesRead,
    timeSavedHours,
    knowledgeScore: avgProficiency,
    scoreDiff,
  };
}
