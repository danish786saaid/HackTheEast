"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useDashboardData } from "@/hooks/useDashboardData";
import type { CategoryEngagement, CategoryEngagement as Category } from "@/lib/types";
import { ChevronRight, Check, AlertTriangle } from "lucide-react";

type CategoryLayout = {
  x: number;
  y: number;
  rotation: number;
};

const CATEGORY_LAYOUT: Record<string, CategoryLayout> = {
  ai: { x: 28, y: 18, rotation: 12 },
  defi: { x: 62, y: 12, rotation: -6 },
  chain: { x: 42, y: 50, rotation: 7 },
  policy: { x: 18, y: 68, rotation: -14 },
  ethics: { x: 70, y: 55, rotation: 18 },
  smart: { x: 55, y: 80, rotation: -3 },
};

function getCategorySize(category: CategoryEngagement, maxMinutes: number) {
  const minW = 90;
  const maxW = 210;
  const minH = 70;
  const maxH = 170;

  if (maxMinutes === 0) {
    return { width: minW, height: minH };
  }

  const ratio = Math.max(0.15, category.totalMinutes / maxMinutes);
  const width = minW + (maxW - minW) * ratio;
  const height = minH + (maxH - minH) * ratio;

  return { width, height };
}

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(/\s+/)[0] ?? "there";
  const {
    tutorials,
    alerts,
    weeklyActivity,
    categoryEngagement,
    categoryConnections,
    stats,
    onTrack,
    activeTutorialCount,
    unreadAlertCount,
  } = useDashboardData();

  const maxMinutes = categoryEngagement.reduce(
    (acc, c) => (c.totalMinutes > acc ? c.totalMinutes : acc),
    0
  );

  return (
    <div className="flex" style={{ height: "calc(100vh - 56px)" }}>
      {/* ─── Left Panel (white) ─── */}
      <div className="w-[420px] shrink-0 overflow-y-auto panel-white px-8 py-7">
        {/* Title */}
        <h1 className="text-[32px] leading-[1.15] tracking-tight">
          <span className="font-light">Overview</span>
        </h1>
        <p className="mt-2 text-xs text-gray-400">
          Last updated &middot; 28 Feb 2026
          <span className="ml-1 text-gray-300">(demo data)</span>
        </p>

        {/* Status pills */}
        <div className="mt-5 flex gap-2">
          <span
            className={`inline-flex items-center gap-1.5 border px-3 py-1 text-xs font-medium ${
              onTrack
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            {onTrack ? (
              <Check className="h-3 w-3" />
            ) : (
              <AlertTriangle className="h-3 w-3" />
            )}
            {onTrack ? "On Track" : "Behind"}
          </span>
          <span className="inline-flex items-center gap-1.5 border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
            {activeTutorialCount} Active Tutorials
          </span>
          <span
            className={`inline-flex items-center gap-1.5 border px-3 py-1 text-xs font-medium ${
              unreadAlertCount > 0
                ? "border-amber-200 bg-amber-50 text-amber-700"
                : "border-gray-200 bg-gray-50 text-gray-400"
            }`}
          >
            {unreadAlertCount > 0 && <AlertTriangle className="h-3 w-3" />}
            {unreadAlertCount} Alerts
          </span>
        </div>

        {/* Active Tutorials */}
        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">
              Active Tutorials
            </h2>
            <Link
              href="/tutorials"
              className="flex items-center gap-0.5 text-xs font-medium text-[#3b82f6] transition-colors hover:text-[#2563eb]"
            >
              View all
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-0 divide-y divide-gray-200 border border-gray-200">
            {tutorials.slice(0, 3).map((t) => (
              <Link
                key={t.id}
                href={`/tutorials/${t.slug}`}
                className="block px-4 py-3 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {t.title}
                  </p>
                  <span className="text-xs font-semibold tabular-nums text-gray-500">
                    {t.progress}%
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-gray-400">
                  Module {t.currentModule} of {t.totalModules}
                </p>
                <div className="mt-2 h-1 w-full bg-gray-100">
                  <div
                    className="h-full bg-[#3b82f6] transition-all"
                    style={{ width: `${t.progress}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* This Week stats */}
        <div className="mt-7">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">
            This Week
          </h2>

          <div className="grid grid-cols-3 gap-2 border border-gray-200 bg-white">
            <div className="px-3 py-3.5 text-center border-b border-gray-200">
              <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">
                Efficiency
              </p>
              <p className="mt-1 text-xl font-bold tabular-nums text-gray-900">
                {stats.efficiency}%
              </p>
            </div>
            <div className="px-3 py-3.5 text-center border-b border-l border-gray-200">
              <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">
                Reading Time
              </p>
              <p className="mt-1 text-xl font-bold tabular-nums text-gray-900">
                {stats.readingHours}
                <span className="ml-0.5 text-xs font-medium text-gray-400">
                  hrs
                </span>
              </p>
            </div>
            <div className="px-3 py-3.5 text-center border-b border-l border-gray-200">
              <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">
                Mastery
              </p>
              <p className="mt-1 text-xl font-bold tabular-nums text-gray-900">
                {stats.mastery}%
              </p>
            </div>
            <div className="px-3 py-3.5 text-center">
              <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">
                Articles
              </p>
              <p className="mt-1 text-xl font-bold tabular-nums text-gray-900">
                {stats.articleCount}
              </p>
            </div>
            <div className="px-3 py-3.5 text-center border-l border-gray-200">
              <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">
                Quizzes
              </p>
              <p className="mt-1 text-xl font-bold tabular-nums text-gray-900">
                {stats.quizCount}
              </p>
            </div>
            <div className="px-3 py-3.5 text-center border-l border-gray-200">
              <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">
                Score vs Last Week
              </p>
              <p
                className={`mt-1 text-xl font-bold tabular-nums ${
                  stats.scoreVsLastWeek >= 0
                    ? "text-emerald-600"
                    : "text-rose-600"
                }`}
              >
                {stats.scoreVsLastWeek >= 0 ? "+" : ""}
                {stats.scoreVsLastWeek}%
              </p>
            </div>
          </div>

          {/* Weekly reading bar chart */}
          <div className="mt-4">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-gray-400">
              Reading minutes per day
            </p>
            <div className="flex items-end gap-2" style={{ height: 72 }}>
              {weeklyActivity.map((d) => {
                const max = Math.max(
                  ...weeklyActivity.map((v) => v.minutesRead),
                  1
                );
                const barHeight = Math.round((d.minutesRead / max) * 56);
                return (
                  <div
                    key={d.day}
                    className="flex flex-1 flex-col items-center justify-end gap-1"
                  >
                    <div
                      className="w-full min-w-[12px] bg-gray-900"
                      style={{
                        height: barHeight,
                        minHeight: d.minutesRead > 0 ? 4 : 0,
                      }}
                    />
                    <span className="text-[9px] tabular-nums text-gray-400">
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Right Panel (dark + dithered visual) ─── */}
      <div className="relative flex-1 overflow-hidden bg-[#0c0a09]">
        {/* Dither pattern */}
        <div className="dither-dots absolute inset-0" />

        {/* Topo grid */}
        <div className="topo-grid absolute inset-0" />

        {/* SVG connecting lines */}
        <svg className="absolute inset-0 h-full w-full" style={{ zIndex: 2 }}>
          {categoryConnections.map((conn, i) => {
            const from = categoryEngagement.find((c) => c.id === conn.from);
            const to = categoryEngagement.find((c) => c.id === conn.to);
            if (!from || !to) return null;

            const fromLayout = CATEGORY_LAYOUT[from.id];
            const toLayout = CATEGORY_LAYOUT[to.id];
            if (!fromLayout || !toLayout) return null;

            const fromSize = getCategorySize(from as Category, maxMinutes);
            const toSize = getCategorySize(to as Category, maxMinutes);

            const fromX = fromLayout.x + fromSize.width / 2;
            const fromY = fromLayout.y + fromSize.height / 2;
            const toX = toLayout.x + toSize.width / 2;
            const toY = toLayout.y + toSize.height / 2;

            return (
              <line
                key={i}
                x1={`${fromX}%`}
                y1={`${fromY}%`}
                x2={`${toX}%`}
                y2={`${toY}%`}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}
        </svg>

        {/* Learning domain nodes */}
        {categoryEngagement.map((category) => {
          const layout = CATEGORY_LAYOUT[category.id];
          if (!layout) return null;
          const { width, height } = getCategorySize(category, maxMinutes);

          const filled = category.totalMinutes > 0;

          return (
            <div
              key={category.id}
              className="absolute"
              style={{
                left: `${layout.x}%`,
                top: `${layout.y}%`,
                width,
                height,
                transform: `rotate(${layout.rotation}deg)`,
                border: `1px solid ${
                  filled
                    ? "rgba(255,255,255,0.22)"
                    : "rgba(255,255,255,0.08)"
                }`,
                background: filled
                  ? "rgba(255,255,255,0.04)"
                  : "transparent",
                zIndex: 3,
                transition: "border-color 0.3s, background 0.3s, width 0.3s, height 0.3s",
              }}
            >
              {/* Category ID above shape */}
              <span
                className="absolute left-2 text-[11px] font-medium tracking-wide text-white/50"
                style={{
                  top: -20,
                  transform: `rotate(${-layout.rotation}deg)`,
                  transformOrigin: "left bottom",
                }}
              >
                {category.categoryId}
              </span>

              {/* Category name inside shape */}
              {filled && (
                <span
                  className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold uppercase tracking-widest text-white/30"
                  style={{ transform: `rotate(${-layout.rotation}deg)` }}
                >
                  {category.label}
                </span>
              )}
            </div>
          );
        })}

        {/* Corner accent glow */}
        <div
          className="pointer-events-none absolute"
          style={{
            top: "15%",
            left: "30%",
            width: 300,
            height: 300,
            background:
              "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
            zIndex: 2,
          }}
        />

        {/* Status label in bottom-left */}
        <div
          className="absolute bottom-6 left-6 flex gap-3"
          style={{ zIndex: 4 }}
        >
          <span className="inline-flex items-center gap-2 border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/50">
            <span className="h-1.5 w-1.5 bg-[#3b82f6]" />
            Knowledge Map
          </span>
          <span className="border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] tabular-nums text-white/50">
            {categoryEngagement.length} Domains
          </span>
          <span className="border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] tabular-nums text-white/50">
            {categoryEngagement.filter((c) => c.totalMinutes > 0).length} Active
          </span>
        </div>

        {/* Welcome text overlay */}
        <div
          className="absolute top-6 right-8"
          style={{ zIndex: 4 }}
        >
          <p className="text-shimmer text-xs">
            Welcome back, {firstName}
          </p>
        </div>
      </div>
    </div>
  );
}
