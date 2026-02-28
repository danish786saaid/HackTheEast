"use client";

import { useAuth } from "@/lib/auth-context";
import { useSupabaseQuery } from "./use-supabase-query";
import {
  fetchKpiData,
  fetchContent,
  fetchTrackingRules,
  fetchContentAlerts,
  fetchLearningTrend,
  fetchActivities,
  fetchTopicDistribution,
} from "@/lib/supabase-queries";
import {
  MOCK_KPI,
  MOCK_CONTENT_FEED,
  MOCK_TRACKING_RULES,
  MOCK_ALERTS,
  MOCK_LEARNING_TREND,
  MOCK_ACTIVITIES,
  MOCK_TOPIC_DISTRIBUTION,
} from "@/lib/constants";

// ── KPI Data ───────────────────────────────────────────────

const MOCK_KPI_FLAT = {
  topicCount: 12,
  articlesRead: 47,
  timeSavedHours: 6.2,
  knowledgeScore: 78,
  scoreDiff: 5,
};

export function useKpiData() {
  const { user } = useAuth();
  return useSupabaseQuery(
    () => fetchKpiData(user!.id),
    MOCK_KPI_FLAT,
    [user?.id]
  );
}

export function formatKpiCards(raw: typeof MOCK_KPI_FLAT) {
  return [
    {
      label: "Topics Tracked",
      value: String(raw.topicCount),
      change: `${raw.topicCount}`,
      changeLabel: "domains",
      positive: true,
    },
    {
      label: "Articles Read",
      value: String(raw.articlesRead),
      change: `${raw.articlesRead}`,
      changeLabel: "total",
      positive: true,
    },
    {
      label: "Time Saved",
      value: `${raw.timeSavedHours}h`,
      change: `${raw.timeSavedHours}h`,
      changeLabel: "from AI summaries",
      positive: true,
    },
    {
      label: "Knowledge Score",
      value: `${raw.knowledgeScore}%`,
      change: `${raw.scoreDiff >= 0 ? "+" : ""}${raw.scoreDiff}%`,
      changeLabel: "overall mastery",
      positive: raw.scoreDiff >= 0,
    },
  ];
}

export { MOCK_KPI };

// ── Content Feed ───────────────────────────────────────────

const DOMAIN_COLORS: Record<string, string> = {
  "AI & Machine Learning": "#f97316",
  "Web Development": "#3b82f6",
  "Blockchain & Web3": "#22c55e",
  EdTech: "#a855f7",
  "Career Development": "#f59e0b",
};

function relevanceBucket(score: number): "high" | "medium" | "low" {
  if (score >= 0.8) return "high";
  if (score >= 0.5) return "medium";
  return "low";
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function useContentFeed() {
  return useSupabaseQuery(
    async () => {
      const rows = await fetchContent(20);
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        source: r.source_type,
        time: timeAgo(r.created_at),
        relevance: relevanceBucket(r.relevance_score),
        url: r.source_url ?? "#",
        domain: r.tags[0] ?? "General",
      }));
    },
    MOCK_CONTENT_FEED,
    []
  );
}

// ── Tracking Rules ─────────────────────────────────────────

export function useTrackingRules() {
  const { user } = useAuth();
  return useSupabaseQuery(
    async () => {
      const rows = await fetchTrackingRules(user!.id);
      return rows.map((r) => ({
        id: r.id,
        rule: `${r.alert_trigger === "any_new" ? "Alert on any new" : r.alert_trigger === "high_relevance" ? "High-relevance alerts for" : r.alert_trigger === "breaking" ? "Breaking alerts for" : "Daily digest of"} ${r.topic}`,
        status: r.is_active ? ("active" as const) : ("paused" as const),
      }));
    },
    MOCK_TRACKING_RULES,
    [user?.id]
  );
}

// ── Content Alerts ─────────────────────────────────────────

const SEVERITY_MAP: Record<string, "safe" | "warning" | "danger"> = {
  info: "safe",
  warning: "warning",
  danger: "danger",
};

export function useContentAlerts() {
  const { user } = useAuth();
  return useSupabaseQuery(
    async () => {
      const rows = await fetchContentAlerts(user!.id);
      return rows.map((r) => ({
        id: r.id,
        title: r.alert_message,
        severity: SEVERITY_MAP[r.severity] ?? ("safe" as const),
        time: timeAgo(r.created_at),
        matchedRule: r.content?.title ?? "",
      }));
    },
    MOCK_ALERTS,
    [user?.id]
  );
}

// ── Learning Trend ─────────────────────────────────────────

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function useLearningTrend() {
  const { user } = useAuth();
  return useSupabaseQuery(
    async () => {
      const rows = await fetchLearningTrend(user!.id, 7);
      return rows.map((r) => ({
        day: DAY_NAMES[new Date(r.recorded_at).getDay()],
        progress: r.progress,
        articles: 0,
      }));
    },
    MOCK_LEARNING_TREND,
    [user?.id]
  );
}

// ── Activities ─────────────────────────────────────────────

const ACTION_LABELS: Record<string, string> = {
  read: "Read",
  bookmark: "Bookmarked",
  share: "Shared",
  complete: "Completed",
  quiz_pass: "Passed quiz on",
  note: "Added note to",
  highlight: "Highlighted in",
  search: "Searched for",
};

export function useActivities() {
  const { user } = useAuth();
  return useSupabaseQuery(
    async () => {
      const rows = await fetchActivities(user!.id, 10);
      return rows.map((r) => ({
        id: r.id,
        action: `${ACTION_LABELS[r.action] ?? r.action}: ${r.content?.title ?? "content"}`,
        time: timeAgo(r.created_at),
      }));
    },
    MOCK_ACTIVITIES,
    [user?.id]
  );
}

// ── Topic Distribution ─────────────────────────────────────

const TOPIC_COLORS = ["#f97316", "#22c55e", "#3b82f6", "#a855f7", "#f59e0b", "#ec4899"];

export function useTopicDistribution() {
  const { user } = useAuth();
  return useSupabaseQuery(
    async () => {
      const rows = await fetchTopicDistribution(user!.id);
      return rows.map((r, i) => ({
        name: r.domain,
        value: r.count,
        color: DOMAIN_COLORS[r.domain] ?? TOPIC_COLORS[i % TOPIC_COLORS.length],
      }));
    },
    MOCK_TOPIC_DISTRIBUTION,
    [user?.id]
  );
}
