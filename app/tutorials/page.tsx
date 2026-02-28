"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import { MOCK_TUTORIALS } from "@/lib/constants";
import { useTutorialProgress } from "@/contexts/TutorialProgressContext";
import {
  Search,
  BookOpen,
  Clock,
  BarChart2,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Loader2,
  ExternalLink,
  Wand2,
  Play,
  X,
} from "lucide-react";
import Image from "next/image";

/* ── types ── */

type ExaResult = {
  id: string;
  title: string;
  url: string;
  publishedDate: string | null;
  author: string | null;
  text: string;
  highlights: string[];
  image: string | null;
};

type VideoGenStatus = "idle" | "submitting" | "polling" | "ready" | "error";

type VideoGen = {
  status: VideoGenStatus;
  taskId?: string;
  videoUrl?: string;
  error?: string;
  progress: number;
  startedAt?: number;
};

const ESTIMATED_DURATION_MS = 120_000;
const POLL_INTERVAL_MS = 5_000;

/* ── main page ── */

export default function TutorialsPage() {
  const [query, setQuery] = useState("");
  const { getProgress } = useTutorialProgress();

  const [exaResults, setExaResults] = useState<ExaResult[]>([]);
  const [exaLoading, setExaLoading] = useState(false);
  const [exaError, setExaError] = useState<string | null>(null);
  const [exaSearched, setExaSearched] = useState(false);

  const [videoGens, setVideoGens] = useState<Record<string, VideoGen>>({});
  const [playingId, setPlayingId] = useState<string | null>(null);
  const pollRefs = useRef<Record<string, ReturnType<typeof setInterval>>>({});
  const progressRefs = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  /* cleanup intervals on unmount */
  useEffect(() => {
    const polls = pollRefs.current;
    const progs = progressRefs.current;
    return () => {
      Object.values(polls).forEach(clearInterval);
      Object.values(progs).forEach(clearInterval);
    };
  }, []);

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

  /* ── Exa search ── */

  const searchExa = useCallback(async () => {
    const q = query.trim();
    if (!q) return;
    setExaLoading(true);
    setExaError(null);
    setExaSearched(true);
    try {
      const res = await fetch("/api/exa-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, numResults: 6 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Search failed");
      setExaResults(data.results ?? []);
    } catch (err: unknown) {
      setExaError(err instanceof Error ? err.message : "Search failed");
      setExaResults([]);
    } finally {
      setExaLoading(false);
    }
  }, [query]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        searchExa();
      }
    },
    [searchExa],
  );

  /* ── video generation + polling ── */

  const startProgressTimer = useCallback((id: string) => {
    if (progressRefs.current[id]) clearInterval(progressRefs.current[id]);
    const start = Date.now();
    progressRefs.current[id] = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(92, (elapsed / ESTIMATED_DURATION_MS) * 92);
      setVideoGens((prev) => {
        const cur = prev[id];
        if (!cur || cur.status === "ready" || cur.status === "error") return prev;
        return { ...prev, [id]: { ...cur, progress: Math.round(pct) } };
      });
      if (elapsed > ESTIMATED_DURATION_MS) clearInterval(progressRefs.current[id]);
    }, 500);
  }, []);

  const startPolling = useCallback((id: string, taskId: string) => {
    if (pollRefs.current[id]) clearInterval(pollRefs.current[id]);
    pollRefs.current[id] = setInterval(async () => {
      try {
        const res = await fetch(`/api/video-status?task_id=${taskId}`);
        const data = await res.json();
        if (data.status === "Success" && data.download_url) {
          clearInterval(pollRefs.current[id]);
          clearInterval(progressRefs.current[id]);
          setVideoGens((prev) => ({
            ...prev,
            [id]: { status: "ready", progress: 100, videoUrl: data.download_url, taskId },
          }));
        } else if (data.status === "Fail" || data.error) {
          clearInterval(pollRefs.current[id]);
          clearInterval(progressRefs.current[id]);
          setVideoGens((prev) => ({
            ...prev,
            [id]: { status: "error", progress: 0, error: data.error ?? "Generation failed", taskId },
          }));
        }
      } catch {
        /* keep polling on network hiccups */
      }
    }, POLL_INTERVAL_MS);
  }, []);

  const handleGenerateTutorial = useCallback(
    async (result: ExaResult) => {
      const id = result.id;
      setVideoGens((prev) => ({
        ...prev,
        [id]: { status: "submitting", progress: 0 },
      }));
      try {
        const videoPrompt = `A cinematic educational animation visually explaining the concept of "${result.title}". Use abstract visual metaphors, 3D icons, flowing diagrams, and symbolic imagery to convey the idea. Smooth camera movement, soft depth of field. Modern clean aesthetic with blue and white tones. Do NOT include any text, words, letters, numbers, or written language on screen.`;
        const res = await fetch("/api/generate-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: videoPrompt }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Generation failed");
        setVideoGens((prev) => ({
          ...prev,
          [id]: { status: "polling", progress: 0, taskId: data.task_id, startedAt: Date.now() },
        }));
        startProgressTimer(id);
        startPolling(id, data.task_id);
      } catch (err: unknown) {
        setVideoGens((prev) => ({
          ...prev,
          [id]: { status: "error", progress: 0, error: err instanceof Error ? err.message : "Failed" },
        }));
      }
    },
    [startProgressTimer, startPolling],
  );

  /* ── helpers ── */

  const hostname = (url: string) => {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  };

  const genState = (id: string): VideoGen =>
    videoGens[id] ?? { status: "idle", progress: 0 };

  const formatEta = (progress: number) => {
    if (progress >= 92) return "Almost done…";
    const remaining = Math.round(((100 - progress) / 100) * (ESTIMATED_DURATION_MS / 1000));
    if (remaining > 60) return `~${Math.ceil(remaining / 60)} min remaining`;
    return `~${remaining}s remaining`;
  };

  return (
    <>
      <TopBar />

      {/* ── Video overlay ── */}
      {playingId && videoGens[playingId]?.videoUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setPlayingId(null)}
        >
          <div
            className="relative w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPlayingId(null)}
              className="absolute -right-3 -top-3 z-10 rounded-full bg-white/10 p-1.5 text-white transition-colors hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </button>
            <video
              src={videoGens[playingId].videoUrl}
              controls
              autoPlay
              className="w-full rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}

      <main className="mx-auto max-w-[1600px] px-8 py-10">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Tutorials
            </h1>
            <p className="mt-1 text-sm text-[#78716c]">
              AI-generated tutorials powered by MiniMax. Search with{" "}
              <span className="text-[#3b82f6]">Exa AI</span> to discover more.
            </p>
          </div>

          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#78716c]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search tutorials or discover new topics..."
              className="w-full border border-white/[0.06] bg-white/[0.03] py-2 pl-9 pr-20 text-xs text-white placeholder-[#78716c] transition-colors focus:border-[#3b82f6]/40 focus:outline-none"
            />
            <button
              type="button"
              onClick={searchExa}
              disabled={exaLoading || !query.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-sm bg-[#3b82f6]/90 px-2 py-1 text-[10px] font-medium text-white transition-colors hover:bg-[#3b82f6] disabled:opacity-40"
            >
              {exaLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Sparkles className="h-3 w-3" />
              )}
              Discover
            </button>
          </div>
        </div>

        {/* ── Your Tutorials ── */}
        {filtered.length > 0 && (
          <>
            {exaSearched && (
              <h2 className="mt-10 text-xs font-semibold uppercase tracking-widest text-[#78716c]">
                Your Tutorials
              </h2>
            )}
            <div className={`${exaSearched ? "mt-4" : "mt-10"} grid grid-cols-3 gap-5`}>
              {filtered.map((t) => {
                const completed = getProgress(t.id) >= 100;
                const progress = getProgress(t.id);
                return (
                  <Link key={t.id} href={`/tutorials/${t.id}`}>
                    <article
                      className={`group relative flex flex-col overflow-hidden border bg-[#141211] transition-all duration-300 hover:border-white/[0.12] ${
                        completed
                          ? "border-emerald-500/30 opacity-90"
                          : "border-white/[0.06]"
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
          </>
        )}

        {filtered.length === 0 && !exaSearched && (
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

        {/* ── Discover More (Exa AI results) ── */}
        {exaSearched && (
          <section className="mt-12">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#3b82f6]" />
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#78716c]">
                Discover More
              </h2>
              <span className="text-[10px] text-[#78716c]/60">
                powered by Exa AI
              </span>
            </div>

            {exaLoading && (
              <div className="mt-8 flex items-center justify-center gap-2 text-sm text-[#78716c]">
                <Loader2 className="h-4 w-4 animate-spin text-[#3b82f6]" />
                Searching the web with Exa AI…
              </div>
            )}

            {exaError && (
              <div className="mt-6 rounded-md border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-400">
                {exaError}
              </div>
            )}

            {!exaLoading && !exaError && exaResults.length === 0 && (
              <p className="mt-6 text-xs text-[#78716c]">
                No web results found for &quot;{query}&quot;. Try a different
                search term.
              </p>
            )}

            {!exaLoading && exaResults.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-5">
                {exaResults.map((r) => {
                  const gen = genState(r.id);
                  const isActive = gen.status === "submitting" || gen.status === "polling";
                  const isReady = gen.status === "ready";

                  return (
                    <article
                      key={r.id}
                      className={`group relative flex flex-col overflow-hidden border bg-[#141211] transition-all duration-300 ${
                        isReady
                          ? "border-emerald-500/30"
                          : isActive
                            ? "border-[#3b82f6]/30"
                            : "border-white/[0.06] hover:border-[#3b82f6]/30"
                      }`}
                    >
                      {/* thumbnail / video-ready overlay */}
                      <div
                        className={`relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-[#3b82f6]/20 via-[#141211] to-[#141211] ${
                          isReady ? "cursor-pointer" : ""
                        }`}
                        onClick={isReady ? () => setPlayingId(r.id) : undefined}
                      >
                        {r.image ? (
                          <Image
                            src={r.image}
                            alt={r.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            sizes="(max-width: 768px) 100vw, 33vw"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Sparkles className="h-10 w-10 text-[#3b82f6]/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* play button overlay when video is ready */}
                        {isReady && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity group-hover:bg-black/40">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3b82f6] shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-110">
                              <Play className="h-6 w-6 text-white" fill="white" />
                            </div>
                          </div>
                        )}

                        <div className="absolute bottom-3 left-3 flex gap-1.5">
                          <span className="inline-flex items-center gap-1 border border-white/[0.12] bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-sm">
                            <ExternalLink className="h-3 w-3" />
                            {hostname(r.url)}
                          </span>
                          {r.publishedDate && (
                            <span className="inline-flex items-center gap-1 border border-white/[0.12] bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-sm">
                              <Clock className="h-3 w-3" />
                              {new Date(r.publishedDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* progress bar */}
                      {isActive && (
                        <div className="relative h-2.5 w-full overflow-hidden bg-[#1e1e1e]">
                          <div
                            className="absolute inset-y-0 left-0 transition-all duration-700 ease-out"
                            style={{
                              width: `${gen.progress}%`,
                              background: "linear-gradient(90deg, #3b82f6 0%, #818cf8 50%, #3b82f6 100%)",
                              backgroundSize: "200% 100%",
                              animation: "shimmer 2s linear infinite",
                              boxShadow: "0 0 12px 2px rgba(99,102,241,0.5), 0 0 4px 1px rgba(59,130,246,0.6)",
                            }}
                          />
                          <div
                            className="absolute inset-0"
                            style={{
                              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                              backgroundSize: "200% 100%",
                              animation: "shimmer 1.5s linear infinite",
                            }}
                          />
                        </div>
                      )}
                      {isReady && (
                        <div
                          className="h-2.5 w-full"
                          style={{
                            background: "linear-gradient(90deg, #10b981, #34d399, #10b981)",
                            boxShadow: "0 0 8px 1px rgba(16,185,129,0.4)",
                          }}
                        />
                      )}

                      <div className="flex flex-1 flex-col justify-between border-t border-white/[0.06] bg-[#1a1918] px-5 py-4">
                        <div>
                          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white">
                            {r.title}
                          </h3>
                          <p className="mt-1.5 line-clamp-3 text-[11px] leading-relaxed text-[#78716c]">
                            {r.highlights?.[0] || r.text}
                          </p>
                        </div>

                        {/* generation status / actions */}
                        {isActive && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="flex items-center gap-1 text-[#3b82f6]">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Generating tutorial…
                              </span>
                              <span className="text-[#78716c]">
                                {gen.progress}% · {formatEta(gen.progress)}
                              </span>
                            </div>
                          </div>
                        )}

                        {gen.status === "error" && (
                          <div className="mt-3 text-[10px] text-red-400">
                            {gen.error}
                          </div>
                        )}

                        {(gen.status === "idle" || gen.status === "error") && (
                          <div className="mt-3 flex items-center gap-2">
                            <a
                              href={r.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-[11px] font-medium text-[#78716c] transition-colors hover:text-white"
                            >
                              Read source
                              <ExternalLink className="h-3 w-3" />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleGenerateTutorial(r)}
                              className="ml-auto flex items-center gap-1 rounded-sm bg-[#3b82f6]/90 px-2.5 py-1 text-[10px] font-semibold text-white transition-colors hover:bg-[#3b82f6]"
                            >
                              <Wand2 className="h-3 w-3" />
                              Generate Tutorial
                            </button>
                          </div>
                        )}

                        {isReady && (
                          <div className="mt-3 flex items-center gap-2">
                            <a
                              href={r.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-[11px] font-medium text-[#78716c] transition-colors hover:text-white"
                            >
                              Read source
                              <ExternalLink className="h-3 w-3" />
                            </a>
                            <button
                              type="button"
                              onClick={() => setPlayingId(r.id)}
                              className="ml-auto flex items-center gap-1 rounded-sm bg-emerald-500/90 px-2.5 py-1 text-[10px] font-semibold text-white transition-colors hover:bg-emerald-500"
                            >
                              <Play className="h-3 w-3" />
                              Watch Tutorial
                            </button>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>
    </>
  );
}
