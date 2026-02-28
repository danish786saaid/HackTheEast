"use client";

import TopBar from "@/components/layout/TopBar";
import {
  MOCK_ACHIEVEMENTS,
  MOCK_BADGES,
  MOCK_TUTORIALS,
  RULE_CATEGORIES,
} from "@/lib/constants";
import type { BadgeStepStatus } from "@/lib/constants";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Brain,
  Check,
  ChevronDown,
  X,
  Coins,
  Compass,
  Flame,
  Globe,
  GraduationCap,
  Layers,
  Lock,
  Moon,
  RotateCcw,
  Share2,
  Shield,
  Star,
  Sunrise,
  Target,
  Timer,
  Trophy,
  Wallet,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTutorialProgress } from "@/contexts/TutorialProgressContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useAuth } from "@/lib/auth-context";
import {
  fetchUserAchievements,
  fetchUserCategoryMastery,
  upsertUserAchievements,
} from "@/lib/user-learning";

function getTutorialStreakFromProgress(
  progress: Record<string, { watchedPercent: number; lastWatchedAt: string }>
): { currentStreak: number; weekActivity: number[] } {
  const activityDates = new Set<string>();
  Object.values(progress).forEach((entry) => {
    if (!entry?.lastWatchedAt) return;
    const d = new Date(entry.lastWatchedAt);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    activityDates.add(dateStr);
  });
  const today = new Date();
  const toDateStr = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  let currentStreak = 0;
  let d = new Date(today);
  while (activityDates.has(toDateStr(d))) {
    currentStreak++;
    d.setDate(d.getDate() - 1);
  }
  const weekActivity: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(day.getDate() - i);
    weekActivity.push(activityDates.has(toDateStr(day)) ? 100 : 0);
  }
  return { currentStreak, weekActivity };
}

function formatTutorialsWatched(seconds: number): string {
  if (seconds < 60) return `${seconds} sec`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(1)} min`;
  return `${(seconds / 3600).toFixed(1)} hrs`;
}

const BADGE_ICON_MAP = {
  Brain,
  Coins,
  Globe,
  GraduationCap,
  Wallet,
  Shield,
  Layers,
} as const;

const ACHIEVEMENT_ICON_MAP = {
  Target,
  Trophy,
  Flame,
  Zap,
  Award,
  GraduationCap,
  Moon,
  Sunrise,
  BookOpen,
  Brain,
  Compass,
  Star,
  Share2,
  Timer,
  RotateCcw,
  Globe,
} as const;

type BadgeIconName = keyof typeof BADGE_ICON_MAP;
type AchievementIconName = keyof typeof ACHIEVEMENT_ICON_MAP;
type AchievementView = {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  total: number;
  achieved: boolean;
};

const FIRST_ROW_COUNT = 6;

function progressColor(achieved: boolean, inProgress: boolean) {
  if (achieved) return "#22c55e";
  if (inProgress) return "#3b82f6";
  return "#78716c";
}

// --- Badges Earned Popover ---
function BadgesEarnedPopover({
  completedTutorials,
  onClose,
}: {
  completedTutorials: { id: string; title: string }[];
  onClose: () => void;
}) {
  return createPortal(
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
        onMouseDown={onClose}
        aria-hidden
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="popover-enter relative w-full max-w-sm rounded-none border border-white/[0.1] bg-[#0c0a09] p-4 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-white">
              Badges earned from
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="-m-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-none text-[#78716c] transition-colors hover:bg-white/[0.08] hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {completedTutorials.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {completedTutorials.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/tutorials/${t.id}`}
                    onClick={onClose}
                    className="flex items-center gap-2 rounded-none border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-white transition-colors hover:border-[#3b82f6]/40 hover:bg-[#3b82f6]/5"
                  >
                    <Check className="h-4 w-4 shrink-0 text-[#22c55e]" />
                    {t.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-xs text-[#78716c]">
              No tutorials completed yet.
            </p>
          )}
          <p className="mt-3 text-[11px] text-[#78716c]">
            Earn more badges by completing tutorials
          </p>
        </div>
      </div>
    </>,
    document.body
  );
}

// --- Stats Hero ---
function StatsHero() {
  const { getProgress, progress } = useTutorialProgress();
  const { stats } = useDashboardData();
  const [badgesPopoverOpen, setBadgesPopoverOpen] = useState(false);

  const earnedCount = useMemo(() => {
    return MOCK_BADGES.filter(
      (b) => b.type === "tutorial" && b.tutorialId && getProgress(b.tutorialId) >= 100
    ).length;
  }, [getProgress, progress]);

  const completedTutorials = useMemo(() => {
    return MOCK_TUTORIALS.filter((t) => getProgress(t.id) >= 100).map((t) => ({
      id: t.id,
      title: t.title,
    }));
  }, [getProgress, progress]);

  const { currentStreak, weekActivity } = useMemo(
    () => getTutorialStreakFromProgress(progress),
    [progress]
  );

  const totalCount = 7;
  const masteryPercent = stats.mastery;
  const timeInvestedFormatted = formatTutorialsWatched(stats.tutorialsWatchedSeconds);

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button
          type="button"
          onClick={() => setBadgesPopoverOpen(true)}
          className="glass-card badge-card-enter flex w-full flex-col items-start p-4 text-left cursor-pointer transition-colors hover:border-white/[0.12] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]/40"
          style={{ animationDelay: "0s", animationFillMode: "backwards" }}
        >
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#78716c]">
            Badges Earned
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-white">
            {earnedCount} of {totalCount}
          </p>
        </button>
        {badgesPopoverOpen && (
          <BadgesEarnedPopover
            completedTutorials={completedTutorials}
            onClose={() => setBadgesPopoverOpen(false)}
          />
        )}

        <div
          className="glass-card badge-card-enter p-4"
          style={{ animationDelay: "0.05s", animationFillMode: "backwards" }}
        >
          <div className="flex items-center gap-2">
            <Flame
              className="h-5 w-5 text-[#3b82f6] streak-flame-pulse"
              aria-hidden
            />
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#78716c]">
              Current Streak
            </p>
          </div>
          <p className="mt-1 text-2xl font-bold tabular-nums text-white">
            {currentStreak} days
          </p>
          <div className="mt-2 flex gap-1">
            {weekActivity.map((val, i) => (
              <div
                key={i}
                className="h-2 flex-1 rounded-none transition-colors"
                style={{
                  backgroundColor:
                    val > 0
                      ? `rgba(59, 130, 246, ${0.3 + (val / 100) * 0.7})`
                      : "rgba(255,255,255,0.06)",
                }}
                title={`Day ${i + 1}: ${val}%`}
              />
            ))}
          </div>
        </div>

        <div
          className="glass-card badge-card-enter p-4"
          style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
        >
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#78716c]">
            Overall Mastery
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-white">
            {masteryPercent}%
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-none bg-white/[0.08]">
            <div
              className="h-full rounded-none bg-[#22c55e] transition-all duration-700"
              style={{ width: `${masteryPercent}%` }}
            />
          </div>
        </div>

        <div
          className="glass-card badge-card-enter p-4"
          style={{ animationDelay: "0.15s", animationFillMode: "backwards" }}
        >
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#78716c]">
            Time Invested
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-white">
            {timeInvestedFormatted}
          </p>
          <p className="mt-0.5 text-[10px] text-[#78716c]">
            from tutorials watched
          </p>
        </div>
      </div>
    </section>
  );
}

// --- Category Mastery Cards ---
function CategoryCard({
  category,
  index,
  masteryPercent,
}: {
  category: (typeof RULE_CATEGORIES)[number];
  index: number;
  masteryPercent: number;
}) {
  const hasActivity = masteryPercent > 0;
  const IconComponent =
    BADGE_ICON_MAP[category.icon as BadgeIconName] ?? Brain;

  return (
    <div
      className="glass-card badge-card-enter flex flex-col p-4"
      style={{
        animationDelay: `${0.2 + index * 0.05}s`,
        animationFillMode: "backwards",
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none"
          style={{
            background: `${progressColor(masteryPercent >= 100, hasActivity)}20`,
            color: progressColor(masteryPercent >= 100, hasActivity),
          }}
        >
          <IconComponent className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-semibold text-white">{category.label}</h3>
      </div>
      <p className="mt-2 text-2xl font-bold tabular-nums text-white">
        +{masteryPercent}%
      </p>
      <div className="mt-3 flex gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="h-6 flex-1 rounded-none transition-colors"
            style={{
              backgroundColor: i < Math.round((masteryPercent / 100) * 7)
                ? "rgba(59, 130, 246, 0.6)"
                : "rgba(255,255,255,0.06)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// --- Achievement Cards ---
function AchievementCard({
  achievement,
  index,
}: {
  achievement: AchievementView;
  index: number;
}) {
  const IconComponent =
    ACHIEVEMENT_ICON_MAP[achievement.icon as AchievementIconName] ?? Trophy;
  const progressPct =
    achievement.total > 0
      ? Math.round((achievement.progress / achievement.total) * 100)
      : 0;

  return (
    <div
      className={`badge-card-enter glass-card flex flex-col p-3 ${
        achievement.achieved ? "achievement-unlock" : "opacity-70"
      }`}
      style={{
        animationDelay: `${0.4 + index * 0.04}s`,
        animationFillMode: "backwards",
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none"
          style={{
            background: achievement.achieved
              ? "rgba(34, 197, 94, 0.2)"
              : "rgba(255,255,255,0.06)",
            color: achievement.achieved ? "#22c55e" : "#78716c",
          }}
        >
          {achievement.achieved ? (
            <Check className="h-5 w-5" />
          ) : (
            <Lock className="h-4 w-4" />
          )}
        </div>
        <IconComponent
          className={`h-4 w-4 ${achievement.achieved ? "text-[#22c55e]" : "text-[#78716c]"}`}
        />
      </div>
      <h4 className="mt-2 text-sm font-semibold text-white">
        {achievement.title}
      </h4>
      <p className="mt-0.5 text-[10px] text-[#78716c]">
        {achievement.description}
      </p>
      {!achievement.achieved && (
        <div className="mt-2">
          <div className="h-1 overflow-hidden rounded-none bg-white/[0.08]">
            <div
              className="h-full rounded-none bg-[#3b82f6] transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="mt-0.5 text-[10px] text-[#78716c]">
            {achievement.progress}/{achievement.total}
          </p>
        </div>
      )}
    </div>
  );
}

// --- Step Popover (overlay, no layout push) ---
function StepPopover({
  label,
  status,
  description,
  onClose,
  anchorRef,
}: {
  label: string;
  status: BadgeStepStatus;
  description: string;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const update = () => {
      if (anchorRef.current) {
        const rect = anchorRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + 8,
          left: rect.left,
        });
      }
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [anchorRef]);

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        onMouseDown={onClose}
        aria-hidden
      />
      <div
        className="popover-enter fixed z-50 w-64 rounded-none border border-white/[0.1] bg-[#0c0a09] p-3 shadow-xl"
        style={{
          top: position.top,
          left: position.left,
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-none ${
              status === "completed"
                ? "bg-[#22c55e]"
                : status === "active"
                  ? "bg-[#3b82f6]/30"
                  : "bg-white/[0.08]"
            }`}
          >
            {status === "completed" && <Check className="h-3.5 w-3.5 text-white" />}
            {status === "active" && (
              <span className="h-1.5 w-1.5 animate-pulse rounded-none bg-[#60a5fa]" />
            )}
            {status === "locked" && <Lock className="h-3 w-3 text-[#78716c]" />}
          </div>
          <h4 className="font-semibold text-white">{label}</h4>
        </div>
        <p className="mt-2 text-xs text-[#a8a29e]">{description}</p>
      </div>
    </>,
    document.body
  );
}

function getStepsFromWatchedPercent(
  labels: string[],
  watchedPercent: number
): { label: string; status: BadgeStepStatus }[] {
  const thresholds = [33, 66, 100];
  return labels.map((label, i) => {
    const thresh = thresholds[i] ?? 100;
    const prevThresh = i > 0 ? (thresholds[i - 1] ?? 0) : 0;
    if (watchedPercent >= thresh) return { label, status: "completed" as const };
    if (i === 0) return { label, status: "active" as const }; // First step always active until completed
    if (watchedPercent >= prevThresh) return { label, status: "active" as const };
    return { label, status: "locked" as const };
  });
}

// --- Tutorial Badge Row ---
function TutorialBadgeRow({
  tutorial,
  badge,
  index,
  selectedStep,
  onStepClick,
  onStepClose,
}: {
  tutorial: (typeof MOCK_TUTORIALS)[number];
  badge: (typeof MOCK_BADGES)[number];
  index: number;
  selectedStep: { label: string; status: BadgeStepStatus } | null;
  onStepClick: (step: { label: string; status: BadgeStepStatus }) => void;
  onStepClose: () => void;
}) {
  const { getProgress } = useTutorialProgress();
  const watchedPercent = badge.tutorialId ? getProgress(badge.tutorialId) : 0;

  const { steps, currentModule, totalModules } = useMemo(() => {
    const totalModules = tutorial.modules;
    const currentModule = Math.min(
      totalModules,
      Math.ceil((watchedPercent / 100) * totalModules) || 0
    );
    const labels = badge.steps.map((s) => s.label);
    const steps = getStepsFromWatchedPercent(labels, watchedPercent);
    return { steps, currentModule, totalModules };
  }, [badge, tutorial.modules, watchedPercent]);

  const anchorRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div
      className="badge-card-enter mb-6"
      style={{
        animationDelay: `${0.6 + index * 0.08}s`,
        animationFillMode: "backwards",
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">{tutorial.title}</h3>
        <span className="text-[10px] text-[#78716c]">
          {currentModule} of {totalModules} modules
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((step) => {
          const color = progressColor(
            step.status === "completed",
            step.status === "active"
          );
          const isSelected = selectedStep?.label === step.label;
          return (
            <div key={step.label} className="relative">
              <button
                ref={isSelected ? anchorRef : undefined}
                type="button"
                onClick={() => onStepClick(step)}
                className="flex items-center gap-2 rounded-none border border-white/[0.08] bg-white/[0.04] px-3 py-2 transition-all hover:border-[#3b82f6]/40 hover:bg-[#3b82f6]/5"
              >
                <div
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-none"
                  style={{
                    background: `${color}20`,
                    color,
                  }}
                >
                  {step.status === "completed" && (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  {step.status === "active" && (
                    <span className="h-1.5 w-1.5 animate-pulse rounded-none bg-[#60a5fa]" />
                  )}
                  {step.status === "locked" && (
                    <Lock className="h-3 w-3 text-[#78716c]" />
                  )}
                </div>
                <span className="text-xs font-medium text-white">
                  {step.label}
                </span>
              </button>
              {isSelected && (
                <StepPopover
                  label={step.label}
                  status={step.status}
                  description={badge.description}
                  onClose={onStepClose}
                  anchorRef={anchorRef}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-2">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] text-[#78716c]">Module progress</span>
          <span className="text-[10px] tabular-nums text-[#a8a29e]">
            {currentModule} of {totalModules}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-none bg-white/[0.08]">
          <div
            className="h-full rounded-none bg-[#3b82f6] transition-all duration-500"
            style={{
              width: `${totalModules > 0 ? (currentModule / totalModules) * 100 : 0}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function BadgesPage() {
  const { user } = useAuth();
  const { getProgress, progress } = useTutorialProgress();
  const [categoryMastery, setCategoryMastery] = useState<Record<string, number>>({});
  const [achievementRows, setAchievementRows] = useState<Record<string, { progress: number; total: number; achieved: boolean }>>({});
  const [selectedStep, setSelectedStep] = useState<{
    tutorialId: string;
    step: { label: string; status: BadgeStepStatus };
  } | null>(null);
  const [achievementsExpanded, setAchievementsExpanded] = useState(false);

  const tutorialBadges = useMemo(
    () =>
      MOCK_TUTORIALS.map((tutorial) => {
        const badge = MOCK_BADGES.find(
          (b) => b.type === "tutorial" && b.tutorialId === tutorial.id
        );
        return { tutorial, badge };
      }).filter(({ badge }) => badge != null) as {
      tutorial: (typeof MOCK_TUTORIALS)[number];
      badge: (typeof MOCK_BADGES)[number];
    }[],
    []
  );

  const badgesEarnedCount = useMemo(
    () =>
      MOCK_BADGES.filter(
        (b) => b.type === "tutorial" && b.tutorialId && getProgress(b.tutorialId) >= 100
      ).length,
    [getProgress, progress]
  );

  useEffect(() => {
    async function loadCategoryMastery() {
      if (!user?.id) return;
      try {
        const data = await fetchUserCategoryMastery(user.id);
        setCategoryMastery(data);
      } catch {
        setCategoryMastery({});
      }
    }
    void loadCategoryMastery();
  }, [user?.id, progress]);

  const effectiveCategoryMastery = useMemo(() => {
    const fallback: Record<string, number> = {
      ai: getProgress("tut2"),
      crypto: Math.round((getProgress("tut1") + getProgress("tut3")) / 2),
      geopolitics: 0,
      career: 0,
    };
    return {
      ...fallback,
      ...categoryMastery,
    };
  }, [categoryMastery, getProgress]);

  const derivedAchievements = useMemo(() => {
    const completedTutorials = MOCK_TUTORIALS.filter((t) => getProgress(t.id) >= 100).length;
    const watchedAny = Object.values(progress).some((p) => p.watchedPercent > 0);
    const { currentStreak } = getTutorialStreakFromProgress(progress);
    const category100 = Object.values(effectiveCategoryMastery).some((v) => v >= 100);
    const base = MOCK_ACHIEVEMENTS.map((a) => ({
      achievementId: a.id,
      progress: 0,
      total: a.total,
      achieved: false,
    }));
    const byId = Object.fromEntries(base.map((r) => [r.achievementId, r]));

    byId["first-steps"] = { achievementId: "first-steps", progress: watchedAny ? 1 : 0, total: 1, achieved: watchedAny };
    byId["hat-trick"] = { achievementId: "hat-trick", progress: completedTutorials, total: 3, achieved: completedTutorials >= 3 };
    byId["week-warrior"] = { achievementId: "week-warrior", progress: currentStreak, total: 7, achieved: currentStreak >= 7 };
    byId["speed-learner"] = { achievementId: "speed-learner", progress: completedTutorials > 0 ? 1 : 0, total: 1, achieved: completedTutorials > 0 };
    byId["full-house"] = { achievementId: "full-house", progress: category100 ? 1 : 0, total: 1, achieved: category100 };
    byId["scholar"] = { achievementId: "scholar", progress: badgesEarnedCount, total: 7, achieved: badgesEarnedCount >= 7 };

    return Object.values(byId);
  }, [badgesEarnedCount, effectiveCategoryMastery, getProgress, progress]);

  useEffect(() => {
    async function syncAchievements() {
      if (!user?.id) return;
      try {
        await upsertUserAchievements(user.id, derivedAchievements);
        const fromDb = await fetchUserAchievements(user.id);
        const mapped: Record<string, { progress: number; total: number; achieved: boolean }> = {};
        Object.values(fromDb).forEach((row) => {
          mapped[row.achievementId] = {
            progress: row.progress,
            total: row.total,
            achieved: row.achieved,
          };
        });
        setAchievementRows(mapped);
      } catch {
        // ignore temporary sync failures
      }
    }
    void syncAchievements();
  }, [derivedAchievements, user?.id]);

  const achievements: AchievementView[] = useMemo(() => {
    return MOCK_ACHIEVEMENTS.map((a) => {
      const fromDb = achievementRows[a.id];
      return {
        ...a,
        progress: fromDb?.progress ?? 0,
        total: fromDb?.total ?? a.total,
        achieved: fromDb?.achieved ?? false,
      };
    });
  }, [achievementRows]);

  const firstRowAchievements = achievements.slice(0, FIRST_ROW_COUNT);
  const extraAchievements = achievements.slice(FIRST_ROW_COUNT);
  const achievedCount = achievements.filter((a) => a.achieved).length;

  const handleStepClick = useCallback(
    (tutorialId: string, step: { label: string; status: BadgeStepStatus }) => {
      setSelectedStep({ tutorialId, step });
    },
    []
  );

  const handleStepClose = useCallback(() => setSelectedStep(null), []);

  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6">
        <header className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Badges
          </h1>
          <p className="mt-0.5 text-xs text-[#78716c]">
            Complete Learn → Practice → Master for each path.{" "}
            <span className="font-medium text-[#a8a29e]">
              {badgesEarnedCount} of 7 earned
            </span>
          </p>
        </header>

        <StatsHero />

        <section className="mb-8">
          <h2 className="mb-3 text-[10px] font-medium uppercase tracking-wider text-[#78716c]">
            Category Mastery
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {RULE_CATEGORIES.map((cat, i) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                index={i}
                masteryPercent={effectiveCategoryMastery[cat.id] ?? 0}
              />
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-[10px] font-medium uppercase tracking-wider text-[#78716c]">
            Achievements
            <span className="ml-2 text-[#a8a29e]">
              {achievedCount}/{MOCK_ACHIEVEMENTS.length}
            </span>
          </h2>

          {/* First row — always visible */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {firstRowAchievements.map((a, i) => (
              <AchievementCard key={a.id} achievement={a} index={i} />
            ))}
          </div>

          {/* Extra rows — collapsed */}
          {extraAchievements.length > 0 && (
            <>
              <div
                className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
                style={{ maxHeight: achievementsExpanded ? 800 : 0 }}
              >
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                  {extraAchievements.map((a, i) => (
                    <AchievementCard
                      key={a.id}
                      achievement={a}
                      index={FIRST_ROW_COUNT + i}
                    />
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAchievementsExpanded((v) => !v)}
                className="mt-3 flex w-full items-center justify-center gap-1 py-1 text-[10px] font-medium uppercase tracking-wider text-[#78716c] transition-colors hover:text-[#3b82f6]"
              >
                {achievementsExpanded
                  ? "Show less"
                  : `+${extraAchievements.length} more achievements`}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    achievementsExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            </>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-[10px] font-medium uppercase tracking-wider text-[#78716c]">
            Tutorial Completion
          </h2>
          {tutorialBadges.map(({ tutorial, badge }, i) => (
            <TutorialBadgeRow
              key={tutorial.id}
              tutorial={tutorial}
              badge={badge}
              index={i}
              selectedStep={
                selectedStep?.tutorialId === tutorial.id
                  ? selectedStep.step
                  : null
              }
              onStepClick={(step) => handleStepClick(tutorial.id, step)}
              onStepClose={handleStepClose}
            />
          ))}
        </section>
      </main>
    </>
  );
}
