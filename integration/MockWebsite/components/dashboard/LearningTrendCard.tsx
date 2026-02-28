"use client";

import { MOCK_LEARNING_TREND } from "@/lib/constants";

export default function LearningTrendCard() {
  const maxProgress = Math.max(...MOCK_LEARNING_TREND.map((d) => d.progress));

  return (
    <div className="glass-card p-6">
      <h3 className="mb-1 text-sm font-semibold text-white">Learning Progress</h3>
      <p className="mb-4 text-[11px] text-[#78716c]">Knowledge score trend this week</p>

      <div className="flex items-end gap-2" style={{ height: 120 }}>
        {MOCK_LEARNING_TREND.map((d) => {
          const h = (d.progress / maxProgress) * 100;
          return (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[10px] font-medium text-[#a8a29e]">{d.progress}%</span>
              <div
                className="w-full rounded-t-md transition-all"
                style={{
                  height: `${h}%`,
                  background: `linear-gradient(180deg, #f97316 0%, rgba(249,115,22,0.3) 100%)`,
                }}
              />
              <span className="text-[10px] text-[#78716c]">{d.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
