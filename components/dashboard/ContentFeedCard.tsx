"use client";

import { MOCK_CONTENT_FEED } from "@/lib/constants";
import { ExternalLink } from "lucide-react";

const relevanceColor = {
  high: "#22c55e",
  medium: "#f59e0b",
  low: "#78716c",
};

export default function ContentFeedCard() {
  return (
    <div className="glass-card p-6">
      <h3 className="mb-4 text-sm font-semibold text-white">Latest Content</h3>
      <div className="space-y-3">
        {MOCK_CONTENT_FEED.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]"
          >
            <div
              className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
              style={{ background: relevanceColor[item.relevance] }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white leading-snug">{item.title}</p>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-[#78716c]">
                <span>{item.source}</span>
                <span>·</span>
                <span>{item.time}</span>
                <span>·</span>
                <span style={{ color: relevanceColor[item.relevance] }}>{item.domain}</span>
              </div>
            </div>
            <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 text-[#78716c]" />
          </div>
        ))}
      </div>
    </div>
  );
}
