import { useMemo } from "react";
import type {
  DashboardTutorial,
  DashboardAlert,
  DailyActivity,
  CategoryEngagement,
} from "@/lib/types";

export type DashboardStats = {
  efficiency: number;
  readingHours: number;
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

// Mock data temporarily stands in for a backend aggregate.
// The structure is chosen so it can be replaced by a Supabase-powered query later.

const MOCK_TUTORIALS: DashboardTutorial[] = [
  {
    id: "t1",
    title: "Introduction to DeFi",
    slug: "introduction-to-defi",
    currentModule: 3,
    totalModules: 5,
    progress: 62,
    estimatedHours: 2,
    lastReadAt: "2026-02-28T10:30:00Z",
  },
  {
    id: "t2",
    title: "AI Ethics & Governance",
    slug: "ai-ethics-and-governance",
    currentModule: 4,
    totalModules: 5,
    progress: 85,
    estimatedHours: 2.5,
    lastReadAt: "2026-02-28T08:45:00Z",
  },
  {
    id: "t3",
    title: "Blockchain Fundamentals",
    slug: "blockchain-fundamentals",
    currentModule: 1,
    totalModules: 4,
    progress: 15,
    estimatedHours: 1.5,
    lastReadAt: "2026-02-27T19:10:00Z",
  },
  {
    id: "t4",
    title: "Tech Policy & Geopolitics",
    slug: "tech-policy-and-geopolitics",
    currentModule: 1,
    totalModules: 3,
    progress: 0,
    estimatedHours: 1.2,
    lastReadAt: "2026-02-20T09:00:00Z",
  },
];

const MOCK_ALERTS: DashboardAlert[] = [
  {
    id: "a1",
    title: "New EU AI Act enforcement guidelines published",
    severity: "warning",
    time: "5 min ago",
    read: false,
  },
  {
    id: "a2",
    title: "OpenAI releases GPT-5 technical report",
    severity: "success",
    time: "25 min ago",
    read: false,
  },
  {
    id: "a3",
    title: "SEC proposes new crypto staking rules",
    severity: "warning",
    time: "1 hour ago",
    read: true,
  },
];

const THIS_WEEK: DailyActivity[] = [
  { day: "Mon", minutesRead: 32, articlesRead: 3, quizzesCompleted: 1 },
  { day: "Tue", minutesRead: 45, articlesRead: 4, quizzesCompleted: 2 },
  { day: "Wed", minutesRead: 18, articlesRead: 2, quizzesCompleted: 0 },
  { day: "Thu", minutesRead: 52, articlesRead: 5, quizzesCompleted: 2 },
  { day: "Fri", minutesRead: 40, articlesRead: 3, quizzesCompleted: 1 },
  { day: "Sat", minutesRead: 60, articlesRead: 4, quizzesCompleted: 2 },
  { day: "Sun", minutesRead: 0, articlesRead: 0, quizzesCompleted: 0 },
];

const LAST_WEEK: DailyActivity[] = [
  { day: "Mon", minutesRead: 20, articlesRead: 2, quizzesCompleted: 0 },
  { day: "Tue", minutesRead: 30, articlesRead: 3, quizzesCompleted: 1 },
  { day: "Wed", minutesRead: 10, articlesRead: 1, quizzesCompleted: 0 },
  { day: "Thu", minutesRead: 25, articlesRead: 2, quizzesCompleted: 1 },
  { day: "Fri", minutesRead: 15, articlesRead: 1, quizzesCompleted: 0 },
  { day: "Sat", minutesRead: 35, articlesRead: 3, quizzesCompleted: 1 },
  { day: "Sun", minutesRead: 0, articlesRead: 0, quizzesCompleted: 0 },
];

const CATEGORY_ENGAGEMENT: CategoryEngagement[] = [
  { id: "ai", categoryId: "No.101", label: "AI & ML", totalMinutes: 110, quizzesDone: 3, articlesRead: 8 },
  { id: "defi", categoryId: "No.205", label: "DeFi", totalMinutes: 170, quizzesDone: 2, articlesRead: 6 },
  { id: "chain", categoryId: "No.302", label: "Blockchain", totalMinutes: 220, quizzesDone: 4, articlesRead: 7 },
  { id: "policy", categoryId: "No.410", label: "Policy", totalMinutes: 60, quizzesDone: 1, articlesRead: 3 },
  { id: "ethics", categoryId: "No.503", label: "AI Ethics", totalMinutes: 140, quizzesDone: 2, articlesRead: 5 },
  { id: "smart", categoryId: "No.608", label: "Smart Contracts", totalMinutes: 190, quizzesDone: 3, articlesRead: 4 },
];

const CATEGORY_CONNECTIONS: CategoryConnection[] = [
  { from: "ai", to: "ethics" },
  { from: "ai", to: "chain" },
  { from: "chain", to: "defi" },
  { from: "chain", to: "smart" },
  { from: "policy", to: "chain" },
];

const TARGET_MINUTES_PER_DAY = 45;

export function useDashboardData(): DashboardData {
  return useMemo(() => {
    // Sort tutorials by last-read time (most recent first)
    const tutorials = [...MOCK_TUTORIALS].sort((a, b) =>
      a.lastReadAt < b.lastReadAt ? 1 : -1
    );

    const alerts = MOCK_ALERTS;
    const weeklyActivity = THIS_WEEK;
    const lastWeekActivity = LAST_WEEK;
    const categoryEngagement = CATEGORY_ENGAGEMENT;
    const categoryConnections = CATEGORY_CONNECTIONS;

    const unreadAlertCount = alerts.filter((a) => !a.read).length;

    const activeTutorialCount = tutorials.filter(
      (t) => t.progress > 0 && t.progress < 100
    ).length;

    const minutesThisWeek = weeklyActivity.reduce(
      (acc, d) => acc + d.minutesRead,
      0
    );
    const minutesLastWeek = lastWeekActivity.reduce(
      (acc, d) => acc + d.minutesRead,
      0
    );

    const articlesThisWeek = weeklyActivity.reduce(
      (acc, d) => acc + d.articlesRead,
      0
    );
    const quizzesThisWeek = weeklyActivity.reduce(
      (acc, d) => acc + d.quizzesCompleted,
      0
    );

    const daysActiveThisWeek = weeklyActivity.filter(
      (d) => d.minutesRead > 0
    ).length;
    const daysActiveLastWeek = lastWeekActivity.filter(
      (d) => d.minutesRead > 0
    ).length;

    // Efficiency: how many days active * how much of the target minutes they consumed
    const fractionDaysActive = daysActiveThisWeek / 7;
    const fractionOfTarget = Math.min(
      1,
      minutesThisWeek / (TARGET_MINUTES_PER_DAY * 7)
    );
    const efficiency = Math.round(fractionDaysActive * fractionOfTarget * 100);

    // Reading hours based on tutorial estimated durations and progress
    const readingHours = tutorials.reduce((acc, t) => {
      return acc + (t.progress / 100) * t.estimatedHours;
    }, 0);

    // Mastery: average tutorial completion
    const mastery =
      tutorials.length > 0
        ? Math.round(
            tutorials.reduce((acc, t) => acc + t.progress, 0) /
              tutorials.length
          )
        : 0;

    const thisWeekTasks = articlesThisWeek + quizzesThisWeek;
    const lastWeekTasks = lastWeekActivity.reduce(
      (acc, d) => acc + d.articlesRead + d.quizzesCompleted,
      0
    );
    const scoreVsLastWeek =
      lastWeekTasks === 0
        ? 100
        : Math.round(((thisWeekTasks - lastWeekTasks) / lastWeekTasks) * 100);

    const stats: DashboardStats = {
      efficiency,
      readingHours: parseFloat(readingHours.toFixed(1)),
      mastery,
      articleCount: articlesThisWeek,
      quizCount: quizzesThisWeek,
      scoreVsLastWeek,
      daysActiveThisWeek,
      daysActiveLastWeek,
    };

    // On track if active today or yesterday
    const lastTwo = weeklyActivity.slice(-2);
    const onTrack = lastTwo.some((d) => d.minutesRead > 0);

    return {
      tutorials,
      alerts,
      weeklyActivity,
      lastWeekActivity,
      categoryEngagement,
      categoryConnections,
      stats,
      onTrack,
      activeTutorialCount,
      unreadAlertCount,
    };
  }, []);
}

