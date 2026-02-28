"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  change: string;
  changeLabel: string;
  positive: boolean;
}

export default function KpiCard({ label, value, change, changeLabel, positive }: KpiCardProps) {
  const TrendIcon = positive ? TrendingUp : TrendingDown;
  return (
    <div className="glass-card p-6 transition-shadow">
      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-[#a8a29e]">
        {label}
      </p>
      <p className="mb-2 text-2xl font-bold text-white">{value}</p>
      <div className="flex items-center gap-1.5">
        <TrendIcon
          className="h-4 w-4 shrink-0"
          style={{ color: positive ? "#f97316" : "#ef4444" }}
        />
        <span
          className="text-sm font-medium"
          style={{ color: positive ? "#f97316" : "#ef4444" }}
        >
          {change}
        </span>
        <span className="text-xs text-[#a8a29e]">{changeLabel}</span>
      </div>
    </div>
  );
}
