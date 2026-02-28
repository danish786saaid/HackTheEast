"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import { MOCK_TUTORIALS } from "@/lib/constants";
import { useTutorialProgress } from "@/contexts/TutorialProgressContext";
import { Search, BookOpen, Clock, BarChart2, ArrowRight, CheckCircle } from "lucide-react";
import Image from "next/image";

export default function TutorialsPage() {
  const [query, setQuery] = useState("");
  const { getProgress } = useTutorialProgress();

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    const list = !q
      ? [...MOCK_TUTORIALS]
      : MOCK_TUTORIALS.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.level.toLowerCase().includes(q),
        );
    return list.sort((a, b) => {
      const aDone = getProgress(a.id) >= 100;
      const bDone = getProgress(b.id) >= 100;
      if (aDone === bDone) return 0;
      return aDone ? 1 : -1;
    });
  }, [query, getProgress]);

  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-[1600px] px-8 py-10">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Tutorials
            </h1>
            <p className="mt-1 text-sm text-[#78716c]">
              AI-generated tutorials powered by MiniMax.
            </p>
          </div>

          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#78716c]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tutorials..."
              className="w-full border border-white/[0.06] bg-white/[0.03] py-2 pl-9 pr-12 text-xs text-white placeholder-[#78716c] transition-colors focus:border-[#3b82f6]/40 focus:outline-none"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-[#78716c]">
              ⌘K
            </kbd>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="mt-10 grid grid-cols-3 gap-5">
            {filtered.map((t) => {
              const completed = getProgress(t.id) >= 100;
              const progress = getProgress(t.id);
              return (
              <Link key={t.id} href={`/tutorials/${t.id}`}>
              <article
                className={`group relative flex flex-col overflow-hidden border bg-[#141211] transition-all duration-300 hover:border-white/[0.12] ${
                  completed ? "border-emerald-500/30 opacity-90" : "border-white/[0.06]"
                }`}
              >
                {completed && (
                  <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg backdrop-blur-sm">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Completed
                  </div>
                )}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={t.imageUrl}
                    alt={t.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  <div className="absolute bottom-3 left-3 flex gap-1.5">
                    <span className="inline-flex items-center gap-1 border border-white/[0.12] bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-sm">
                      <BookOpen className="h-3 w-3" />
                      {t.modules} modules
                    </span>
                    <span className="inline-flex items-center gap-1 border border-white/[0.12] bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-sm">
                      <Clock className="h-3 w-3" />
                      {t.duration}
                    </span>
                    <span className="inline-flex items-center gap-1 border border-white/[0.12] bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-sm">
                      <BarChart2 className="h-3 w-3" />
                      {t.level}
                    </span>
                  </div>
                  {progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                      <div
                        className="h-full bg-red-500 transition-all duration-300"
                        style={{ width: `${Math.min(100, progress)}%` }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between border-t border-gray-200 bg-white px-5 py-4">
                  <div>
                    <h3 className="text-sm font-semibold leading-snug text-[#3b82f6]">
                      {t.title}
                    </h3>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-[#78716c]">
                      {t.description}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center text-[11px] font-medium text-[#3b82f6] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {completed ? "Review" : "Start learning"}
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </div>
                </div>
              </article>
              </Link>
            );
            })}
          </div>
        ) : (
          <div className="mt-20 text-center">
            <Search className="mx-auto h-8 w-8 text-[#78716c]/50" />
            <p className="mt-3 text-sm text-[#78716c]">
              No tutorials match &quot;{query}&quot;
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-2 text-xs font-medium text-[#3b82f6] hover:text-blue-400 transition-colors"
            >
              Clear search
            </button>
          </div>
        )}
      </main>
    </>
  );
}
