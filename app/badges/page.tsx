"use client";

import TopBar from "@/components/layout/TopBar";
import {
  MOCK_ACHIEVEMENTS,
  MOCK_BADGES,
  MOCK_CATEGORY_WEEKLY,
  MOCK_STREAK,
  MOCK_TUTORIALS,
  RULE_CATEGORIES,
  LEARNING_HEALTH,
} from "@/lib/constants";
import type { BadgeStepStatus } from "@/lib/constants";
import type { RuleCategoryId } from "@/lib/constants";
import {
  Award,
  BookOpen,
  Brain,
  Check,
  ChevronDown,
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

const FIRST_ROW_COUNT = 6;

function progressColor(achieved: boolean, inProgress: boolean) {
  if (achieved) return "#22c55e";
  if (inProgress) return "#3b82f6";
  return "#78716c";
}

// --- Stats Hero ---
function StatsHero() {
  const earnedCount = MOCK_BADGES.filter((b) => b.achieved).length;
  const totalCount = MOCK_BADGES.length;
  const masteryItem = LEARNING_HEALTH.find((h) => h.label === "MASTERY");
  const timeItem = LEARNING_HEALTH.find((h) => h.label === "TIME SAVED");

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          className="glass-card badge-card-enter p-4"
          style={{ animationDelay: "0s", animationFillMode: "backwards" }}
        >
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#78716c]">
            Badges Earned
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-white">
            {earnedCount} of {totalCount}
          </p>
        </div>

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
            {MOCK_STREAK.currentStreak} days
          </p>
          <div className="mt-2 flex gap-1">
            {MOCK_STREAK.weekActivity.map((val, i) => (
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
            {masteryItem?.value ?? "78%"}
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-none bg-white/[0.08]">
            <div
              className="h-full rounded-none bg-[#22c55e] transition-all duration-700"
              style={{ width: masteryItem?.value ?? "78%" }}
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
            {timeItem?.value ?? "6.2"}
            <span className="ml-0.5 text-sm font-medium text-[#78716c]">
              {timeItem?.unit ?? "h"}
            </span>
          </p>
          <p className="mt-0.5 text-[10px] text-[#78716c]">
            {timeItem?.sublabel ?? "from AI summaries"}
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
}: {
  category: (typeof RULE_CATEGORIES)[number];
  index: number;
}) {
  const masteryBadge = MOCK_BADGES.find(
    (b) => b.type === "mastery" && b.title === category.label
  );
  const weekData = MOCK_CATEGORY_WEEKLY[category.id as RuleCategoryId] ?? [];
  const activeDays = weekData.filter((v) => v > 0);
  const avgActivity =
    activeDays.length > 0
      ? Math.round(activeDays.reduce((a, b) => a + b, 0) / weekData.length)
      : 0;
  const hasActivity = avgActivity > 0;
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
            background: `${progressColor(masteryBadge?.achieved ?? false, hasActivity)}20`,
            color: progressColor(masteryBadge?.achieved ?? false, hasActivity),
          }}
        >
          <IconComponent className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-semibold text-white">{category.label}</h3>
      </div>
      <p className="mt-2 text-2xl font-bold tabular-nums text-white">
        +{avgActivity}%
      </p>
      <div className="mt-3 flex gap-1">
        {weekData.map((val, i) => (
          <div
            key={i}
            className="h-6 flex-1 rounded-none transition-colors"
            style={{
              backgroundColor:
                val > 0
                  ? `rgba(59, 130, 246, ${0.2 + (val / 100) * 0.6})`
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
  achievement: (typeof MOCK_ACHIEVEMENTS)[number];
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
  const activeTutorial = useMemo(() => {
    const byTitle: Record<string, { currentModule: number; totalModules: number }> = {
      "Introduction to DeFi": { currentModule: 3, totalModules: 5 },
      "AI Ethics & Governance": { currentModule: 4, totalModules: 5 },
      "Blockchain Fundamentals": { currentModule: 1, totalModules: 4 },
    };
    return byTitle[tutorial.title] ?? {
      currentModule: 0,
      totalModules: tutorial.modules,
    };
  }, [tutorial]);

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
          {activeTutorial.currentModule} of {activeTutorial.totalModules} modules
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {badge.steps.map((step) => {
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
            {activeTutorial.currentModule} of {activeTutorial.totalModules}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-none bg-white/[0.08]">
          <div
            className="h-full rounded-none bg-[#3b82f6] transition-all duration-500"
            style={{
              width: `${activeTutorial.totalModules > 0 ? (activeTutorial.currentModule / activeTutorial.totalModules) * 100 : 0}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function BadgesPage() {
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

  const firstRowAchievements = MOCK_ACHIEVEMENTS.slice(0, FIRST_ROW_COUNT);
  const extraAchievements = MOCK_ACHIEVEMENTS.slice(FIRST_ROW_COUNT);
  const achievedCount = MOCK_ACHIEVEMENTS.filter((a) => a.achieved).length;

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
              {MOCK_BADGES.filter((b) => b.achieved).length} of{" "}
              {MOCK_BADGES.length} earned
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
              <CategoryCard key={cat.id} category={cat} index={i} />
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
