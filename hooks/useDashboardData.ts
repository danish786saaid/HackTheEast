"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  DashboardTutorial,
  DashboardAlert,
  DailyActivity,
  CategoryEngagement,
} from "@/lib/types";
import { useTutorialProgress } from "@/contexts/TutorialProgressContext";
import { getArticlesReadThisWeek } from "@/lib/articles-read";
import { useAuth } from "@/lib/auth-context";
import { MOCK_TUTORIALS } from "@/lib/constants";

export type DashboardStats = {
  efficiency: number;
  readingHours: number;
  tutorialsWatchedSeconds: number;
  mastery: number;
  articleCount: number;
  quizCount: number;
  scoreVsLastWeek: number;
  daysActiveThisWeek: number;
  daysActiveLastWeek: number;
};

export type CategoryConnection = {
  from: string;
  to: string;
};

export type DashboardData = {
  tutorials: DashboardTutorial[];
  alerts: DashboardAlert[];
  weeklyActivity: DailyActivity[];
  lastWeekActivity: DailyActivity[];
  categoryEngagement: CategoryEngagement[];
  categoryConnections: CategoryConnection[];
  stats: DashboardStats;
  onTrack: boolean;
  activeTutorialCount: number;
  unreadAlertCount: number;
};

const MOCK_ALERTS: DashboardAlert[] = [
  { id: "a1", title: "New EU AI Act enforcement guidelines published", severity: "warning", time: "5 min ago", read: false },
  { id: "a2", title: "OpenAI releases GPT-5 technical report", severity: "success", time: "25 min ago", read: false },
  { id: "a3", title: "SEC proposes new crypto staking rules", severity: "warning", time: "1 hour ago", read: true },
];

const CATEGORY_ENGAGEMENT: CategoryEngagement[] = [
  { id: "ai", categoryId: "No.101", label: "AI & ML", totalMinutes: 0, quizzesDone: 0, articlesRead: 0 },
  { id: "defi", categoryId: "No.205", label: "DeFi", totalMinutes: 0, quizzesDone: 0, articlesRead: 0 },
  { id: "chain", categoryId: "No.302", label: "Blockchain", totalMinutes: 0, quizzesDone: 0, articlesRead: 0 },
  { id: "policy", categoryId: "No.410", label: "Policy", totalMinutes: 0, quizzesDone: 0, articlesRead: 0 },
  { id: "ethics", categoryId: "No.503", label: "AI Ethics", totalMinutes: 0, quizzesDone: 0, articlesRead: 0 },
  { id: "smart", categoryId: "No.608", label: "Smart Contracts", totalMinutes: 0, quizzesDone: 0, articlesRead: 0 },
];

const CATEGORY_CONNECTIONS: CategoryConnection[] = [
  { from: "ai", to: "ethics" },
  { from: "ai", to: "chain" },
  { from: "chain", to: "defi" },
  { from: "chain", to: "smart" },
  { from: "policy", to: "chain" },
];

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function useDashboardData(): DashboardData {
  const { user } = useAuth();
  const { getProgress, progress } = useTutorialProgress();
  const [articleCount, setArticleCount] = useState(0);

  useEffect(() => {
    async function loadArticleCount() {
      if (!user?.id) return setArticleCount(0);
      try {
        setArticleCount(await getArticlesReadThisWeek(user.id));
      } catch {
        setArticleCount(0);
      }
    }
    void loadArticleCount();
  }, [user?.id]);

  return useMemo(() => {
    const tutorials: DashboardTutorial[] = MOCK_TUTORIALS.map((t) => {
      const watchedPercent = getProgress(t.id);
      return {
        id: t.id,
        title: t.title,
        slug: t.id,
        currentModule: Math.min(t.modules, Math.ceil((watchedPercent / 100) * t.modules) || 0),
        totalModules: t.modules,
        progress: watchedPercent,
        estimatedHours: parseInt(t.duration, 10) / 60,
        lastReadAt: progress[t.id]?.lastWatchedAt ?? new Date(0).toISOString(),
      };
    });

    const sortedTutorials = [...tutorials].sort((a, b) =>
      a.lastReadAt < b.lastReadAt ? 1 : -1
    );

    const totalWatchedSec = MOCK_TUTORIALS.reduce((sum, t) => {
      const pct = getProgress(t.id);
      const duration = progress[t.id]?.durationSeconds ?? 0;
      return sum + (pct / 100) * duration;
    }, 0);
    const totalDurationSec = MOCK_TUTORIALS.reduce(
      (sum, t) => sum + (progress[t.id]?.durationSeconds ?? 0),
      0
    );
    const mastery =
      totalDurationSec > 0
        ? Math.round((totalWatchedSec / totalDurationSec) * 100)
        : 0;

    const today = new Date();
    const activeDaySet = new Set<string>();
    Object.values(progress).forEach((entry) => {
      if (entry.lastWatchedAt) activeDaySet.add(dayKey(new Date(entry.lastWatchedAt)));
    });
    const daysActiveThisWeek = Array.from({ length: 7 }).reduce((acc, _, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      return acc + (activeDaySet.has(dayKey(d)) ? 1 : 0);
    }, 0);

    const stats: DashboardStats = {
      efficiency: Math.round((daysActiveThisWeek / 7) * 100),
      readingHours: parseFloat((totalWatchedSec / 3600).toFixed(1)),
      tutorialsWatchedSeconds: Math.round(totalWatchedSec),
      mastery,
      articleCount,
      quizCount: 0,
      scoreVsLastWeek: 0,
      daysActiveThisWeek,
      daysActiveLastWeek: 0,
    };

    return {
      tutorials: sortedTutorials,
      alerts: MOCK_ALERTS,
      weeklyActivity: [],
      lastWeekActivity: [],
      categoryEngagement: CATEGORY_ENGAGEMENT,
      categoryConnections: CATEGORY_CONNECTIONS,
      stats,
      onTrack: sortedTutorials.some((t) => t.progress > 0),
      activeTutorialCount: sortedTutorials.filter((t) => t.progress < 100).length,
      unreadAlertCount: MOCK_ALERTS.filter((a) => !a.read).length,
    };
  }, [articleCount, getProgress, progress]);
}

