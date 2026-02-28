"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import {
  ExternalLink,
  Clock,
  Loader2,
  RefreshCw,
  Zap,
  FileText,
} from "lucide-react";

type Article = {
  id: number;
  title: string;
  description: string | null;
  url: string;
  image: string | null;
  source: string | null;
  publishedAt: string;
  author: string | null;
  content: string | null;
  provider: string;
};

type SourceCounts = {
  newsapi: number;
  cryptocompare: number;
  coingecko: number;
  marketmovers: number;
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const pub = new Date(dateStr);
  const nowUTCDay = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const pubUTCDay = Date.UTC(pub.getUTCFullYear(), pub.getUTCMonth(), pub.getUTCDate());
  const daysDiff = Math.floor((nowUTCDay - pubUTCDay) / 86400000);

  if (daysDiff === 0) {
    const diff = Date.now() - pub.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    return `${hrs}h ago`;
  }
  return `${daysDiff}d ago`;
}

function slugify(title: string, id: number): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
  return `${slug}-${id}`;
}

function toDateStr(date: Date): string {
  return date.toISOString().split("T")[0];
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

const GRADIENT_PAIRS = [
  ["#1a1a2e", "#16213e", "#0f3460"],
  ["#0d1b2a", "#1b263b", "#415a77"],
  ["#10002b", "#240046", "#3c096c"],
  ["#1b1b2f", "#162447", "#1f4068"],
  ["#0a0a23", "#1a1a40", "#2d2d6b"],
  ["#0f0c29", "#302b63", "#24243e"],
  ["#141e30", "#243b55", "#2d5f8a"],
  ["#0c0c1d", "#1a1a3e", "#2b2b5e"],
  ["#1a0a2e", "#2d1b4e", "#4a2c6e"],
  ["#0a1628", "#152a4a", "#1f3d6d"],
];

const ACCENT_COLORS = [
  "#60a5fa",
  "#818cf8",
  "#a78bfa",
  "#c084fc",
  "#e879f9",
  "#f472b6",
  "#fb7185",
  "#f97316",
  "#fbbf24",
  "#34d399",
  "#2dd4bf",
  "#22d3ee",
];

function PlaceholderThumb({
  title,
  source,
}: {
  title: string;
  source: string | null;
}) {
  const hash = hashString(title);
  const gradientIdx = hash % GRADIENT_PAIRS.length;
  const accentIdx = (hash >> 4) % ACCENT_COLORS.length;
  const gradient = GRADIENT_PAIRS[gradientIdx];
  const accent = ACCENT_COLORS[accentIdx];
  const initial = (source || title).charAt(0).toUpperCase();
  const angle = (hash % 6) * 30 + 120;

  return (
    <div
      className="relative flex h-44 w-full items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(${angle}deg, ${gradient[0]}, ${gradient[1]}, ${gradient[2]})`,
      }}
    >
      <div
        className="absolute -right-6 -top-6 h-32 w-32 rounded-full opacity-[0.07]"
        style={{ background: accent }}
      />
      <div
        className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full opacity-[0.05]"
        style={{ background: accent }}
      />
      <div className="relative flex flex-col items-center gap-2">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold"
          style={{
            background: `${accent}18`,
            color: accent,
            border: `1px solid ${accent}30`,
          }}
        >
          {initial}
        </div>
        {source && (
          <span
            className="text-[11px] font-medium tracking-wide opacity-60"
            style={{ color: accent }}
          >
            {source}
          </span>
        )}
      </div>
    </div>
  );
}

export default function NewsPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [sources, setSources] = useState<SourceCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const [apiPage, setApiPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [fromDate, setFromDate] = useState(toDateStr(new Date(Date.now() - 5 * 86400000)));
  const [toDate, setToDate] = useState(toDateStr(new Date()));
  const [activePreset, setActivePreset] = useState(0);

  const fetchNews = useCallback(async (from?: string, to?: string) => {
    setLoading(true);
    setError(null);
    setFailedImages(new Set());
    setApiPage(1);
    setHasMore(true);
    try {
      const params = new URLSearchParams();
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      params.set("page", "1");
      const res = await fetch(`/api/news?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch news");
      setArticles(data.articles || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMoreNews = useCallback(async () => {
    const nextPage = apiPage + 1;
    setLoadingMore(true);
    try {
      const params = new URLSearchParams();
      if (fromDate) params.set("from", fromDate);
      if (toDate) params.set("to", toDate);
      params.set("page", String(nextPage));
      const res = await fetch(`/api/news?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch news");
      const newArticles = (data.articles || []) as Article[];
      if (newArticles.length === 0) {
        setHasMore(false);
      } else {
        setArticles((prev) => {
          const existingTitles = new Set(prev.map((a) => a.title.toLowerCase()));
          const unique = newArticles.filter(
            (a) => !existingTitles.has(a.title.toLowerCase())
          );
          if (unique.length === 0) {
            setHasMore(false);
            return prev;
          }
          const reindexed = unique.map((a, i) => ({ ...a, id: prev.length + i }));
          return [...prev, ...reindexed];
        });
        setApiPage(nextPage);
      }
    } catch (err) {
      console.error("Failed to load more:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [apiPage, fromDate, toDate]);

  useEffect(() => {
    fetchNews(fromDate, toDate);
  }, []);


  function onImageError(articleId: number) {
    setFailedImages((prev) => new Set(prev).add(articleId));
  }

  function openArticle(article: Article) {
    const slug = slugify(article.title, article.id);
    sessionStorage.setItem(`news-article-${slug}`, JSON.stringify(article));
    router.push(`/news/${slug}`);
  }

  const totalArticles = sources
    ? sources.newsapi + sources.cryptocompare + sources.coingecko + sources.marketmovers
    : 0;

  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-[1600px] px-8 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              News
            </h1>
            <p className="mt-1 text-sm text-white/40">
              Live crypto updates from NewsAPI, CryptoCompare &amp; CoinGecko.
            </p>
          </div>
          <button
            onClick={() => fetchNews(fromDate, toDate)}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-white/60 transition-colors hover:border-white/[0.16] hover:text-white disabled:opacity-40"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        <div className="mt-6 flex gap-3">
          {[
            { label: "Today", fromDays: 0, toDays: 5 },
            { label: "3 Days Ago", fromDays: 3, toDays: 5 },
            { label: "5 Days Ago", fromDays: 5, toDays: 5 },
          ].map((preset) => {
            const isActive = activePreset === preset.fromDays;
            return (
              <button
                key={preset.fromDays}
                onClick={() => {
                  setActivePreset(preset.fromDays);
                  const to = toDateStr(new Date(Date.now() - preset.fromDays * 86400000));
                  const from = toDateStr(new Date(Date.now() - preset.toDays * 86400000));
                  setFromDate(from);
                  setToDate(to);
                  fetchNews(from, to);
                }}
                className={`w-36 py-2.5 text-center text-sm font-medium transition-all duration-150 border ${
                  isActive
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white/60 border-white/[0.1] hover:bg-white hover:text-black hover:border-white"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="mt-16 flex flex-col items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-white/30" />
            <p className="text-sm text-white/30">Fetching latest news...</p>
          </div>
        )}

        {error && !loading && (
          <div className="mt-8 rounded-lg border border-red-500/20 bg-red-500/5 p-6 text-center">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="mt-8 rounded-lg border border-white/[0.06] bg-white/[0.02] p-12 text-center">
            <p className="text-sm text-white/40">
              No articles found for this date range.
            </p>
          </div>
        )}

        {!loading && !error && articles.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article) => {
              const showImage =
                article.image && !failedImages.has(article.id);
              const hasFullContent =
                article.content && article.content.length > 400;

              return (
                <button
                  key={article.id}
                  onClick={() => openArticle(article)}
                  className="group flex min-h-[220px] flex-row overflow-hidden bg-white text-left shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <div className="relative flex min-w-0 flex-1 flex-col overflow-visible p-6 pb-14">
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-600">
                      {article.provider === "Market Movers" && (
                        <span className="inline-flex items-center gap-1 rounded bg-blue-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                          <Zap className="h-2.5 w-2.5" />
                          Market Mover
                        </span>
                      )}
                      {article.source && (
                        <span>{article.source}</span>
                      )}
                      {article.publishedAt && (
                        <>
                          <span className="text-blue-600/60">·</span>
                          <span className="inline-flex items-center gap-1 text-blue-600/80">
                            <Clock className="h-3 w-3" />
                            {timeAgo(article.publishedAt)}
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="text-xl font-bold leading-snug tracking-tight text-gray-900 line-clamp-4 group-hover:text-gray-950">
                      {article.title}
                    </h3>

                    {article.description && (
                      <p className="mt-2 text-base leading-relaxed text-gray-500 line-clamp-3">
                        {article.description}
                      </p>
                    )}

                    {hasFullContent && (
                      <span className="absolute bottom-6 left-6 z-10 inline-flex w-fit items-center gap-1.5 rounded bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                        <FileText className="h-3 w-3" />
                        Full Article
                      </span>
                    )}

                    <div className="mt-auto inline-flex items-center gap-1.5 pt-3 text-xs font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                      Read more
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  </div>

                  <div className="relative w-[180px] shrink-0 self-stretch">
                    {showImage ? (
                      <img
                        src={article.image!}
                        alt=""
                        className="h-full w-full object-cover"
                        onError={() => onImageError(article.id)}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-3xl font-bold text-gray-400">
                        {(article.source || article.title).charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {!loading && !error && articles.length > 0 && hasMore && (
          <div className="mt-8 flex justify-center pb-8">
            <button
              onClick={fetchMoreNews}
              disabled={loadingMore}
              className="px-8 py-3 text-sm font-medium text-white/60 border border-white/[0.08] bg-white/[0.03] transition-colors hover:border-white/[0.16] hover:text-white disabled:opacity-40"
            >
              {loadingMore ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Loading...
                </span>
              ) : (
                "Show more"
              )}
            </button>
          </div>
        )}
      </main>
    </>
  );
}
