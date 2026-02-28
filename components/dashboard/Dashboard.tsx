"use client";

import { useAuth } from "@/lib/auth-context";
import {
  MOCK_ACTIVE_TUTORIALS,
  LEARNING_HEALTH,
  WEEKLY_STATS,
  MOCK_LEARNING_TREND,
  LEARNING_NODES,
  NODE_CONNECTIONS,
} from "@/lib/constants";
import { ChevronRight, Pencil, Check, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(/\s+/)[0] ?? "there";
  const maxProgress = Math.max(...MOCK_LEARNING_TREND.map((d) => d.progress));

  return (
    <div className="flex" style={{ height: "calc(100vh - 56px)" }}>
      {/* ─── Left Panel (white) ─── */}
      <div className="w-[420px] shrink-0 overflow-y-auto panel-white px-8 py-7">
        {/* Title */}
        <h1 className="text-[32px] leading-[1.15] tracking-tight">
          <span className="font-light">Learning</span>
          <br />
          <span className="font-bold">Overview</span>
        </h1>
        <p className="mt-2 text-xs text-gray-400">
          Last updated &middot; 28 Feb 2026
        </p>

        {/* Status pills */}
        <div className="mt-5 flex gap-2">
          <span className="inline-flex items-center gap-1.5 border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            <Check className="h-3 w-3" />
            On Track
          </span>
          <span className="inline-flex items-center gap-1.5 border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
            3 Active Paths
          </span>
          <span className="inline-flex items-center gap-1.5 border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            <AlertTriangle className="h-3 w-3" />2 Alerts
          </span>
        </div>

        {/* Active Tutorials */}
        <div className="mt-7">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">
              Active Tutorials
            </h2>
            <button className="flex items-center gap-0.5 text-xs font-medium text-[#3b82f6] hover:text-[#2563eb] transition-colors">
              View all
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-0 border border-gray-200 divide-y divide-gray-200">
            {MOCK_ACTIVE_TUTORIALS.map((t) => (
              <div
                key={t.id}
                className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
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
              </div>
            ))}
          </div>
        </div>

        {/* Learning Health */}
        <div className="mt-7">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">
              Learning Health
            </h2>
            <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 border border-gray-200 divide-x divide-gray-200">
            {LEARNING_HEALTH.map((stat) => (
              <div key={stat.label} className="px-3 py-3.5 text-center">
                <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">
                  {stat.label}
                </p>
                <p className="mt-1 text-xl font-bold tabular-nums text-gray-900">
                  {stat.value}
                  {stat.unit && (
                    <span className="ml-0.5 text-xs font-medium text-gray-400">
                      {stat.unit}
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="mt-7">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">
              Weekly Progress
            </h2>
            <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Stat pills row */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {WEEKLY_STATS.map((s) => (
              <div
                key={s.label}
                className="border border-gray-200 px-2 py-2 text-center"
              >
                <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">
                  {s.label}
                </p>
                <p className="mt-0.5 text-sm font-bold tabular-nums text-gray-900">
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div className="flex items-end gap-[6px]" style={{ height: 80 }}>
            {MOCK_LEARNING_TREND.map((d) => {
              const h = (d.progress / maxProgress) * 100;
              return (
                <div
                  key={d.day}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <div
                    className="w-full bg-[#0c0a09] transition-all"
                    style={{ height: `${h}%` }}
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

      {/* ─── Right Panel (dark + dithered visual) ─── */}
      <div className="flex-1 relative overflow-hidden bg-[#0c0a09]">
        {/* Dither pattern */}
        <div className="absolute inset-0 dither-dots" />

        {/* Topo grid */}
        <div className="absolute inset-0 topo-grid" />

        {/* SVG connecting lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 2 }}>
          {NODE_CONNECTIONS.map((conn, i) => (
            <line
              key={i}
              x1={`${conn.x1}%`}
              y1={`${conn.y1}%`}
              x2={`${conn.x2}%`}
              y2={`${conn.y2}%`}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}
        </svg>

        {/* Learning domain nodes */}
        {LEARNING_NODES.map((node) => (
          <div
            key={node.id}
            className="absolute"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              width: node.w,
              height: node.h,
              transform: `rotate(${node.rotation}deg)`,
              border: `1px solid ${
                node.filled
                  ? "rgba(255,255,255,0.22)"
                  : "rgba(255,255,255,0.08)"
              }`,
              background: node.filled
                ? "rgba(255,255,255,0.04)"
                : "transparent",
              zIndex: 3,
              transition: "border-color 0.3s, background 0.3s",
            }}
          >
            {/* Label above shape */}
            <span
              className="absolute left-2 text-[11px] font-medium tracking-wide text-white/50"
              style={{
                top: -20,
                transform: `rotate(${-node.rotation}deg)`,
                transformOrigin: "left bottom",
              }}
            >
              {node.label}
            </span>

            {/* Subtitle inside shape */}
            {node.filled && (
              <span
                className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold uppercase tracking-widest text-white/20"
                style={{ transform: `rotate(${-node.rotation}deg)` }}
              >
                {node.subtitle}
              </span>
            )}
          </div>
        ))}

        {/* Corner accent glow */}
        <div
          className="absolute pointer-events-none"
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
            6 Domains
          </span>
          <span className="border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] tabular-nums text-white/50">
            3 Active
          </span>
        </div>

        {/* Welcome text overlay */}
        <div
          className="absolute top-6 right-8"
          style={{ zIndex: 4 }}
        >
          <p className="text-xs text-white/30">
            Welcome back, {firstName}
          </p>
        </div>
      </div>
    </div>
  );
}
