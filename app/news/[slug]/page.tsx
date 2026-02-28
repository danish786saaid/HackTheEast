"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import { ArrowLeft, ExternalLink, Clock, Loader2, User, Bookmark } from "lucide-react";

type Article = {
  title: string;
  description: string | null;
  url: string;
  image: string | null;
  source: string | null;
  publishedAt: string;
  author: string | null;
  content: string | null;
  provider?: string;
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatContent(raw: string): string[] {
  const cleaned = raw
    .replace(/\[\+\d+ chars\]$/, "")
    .replace(/Continue Reading:.*$/i, "")
    .replace(/The post .* appeared first on .*\.$/i, "")
    .trim();

  const explicitParagraphs = cleaned.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  if (explicitParagraphs.length >= 3) {
    return explicitParagraphs.filter((p) => p.length > 20);
  }

  const sentences = cleaned.match(/[^.!?]+[.!?]+(?:\s|$)/g);
  if (!sentences || sentences.length <= 4) {
    return cleaned.length > 20 ? [cleaned] : [];
  }

  const SENTENCES_PER_PARA = 4;
  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += SENTENCES_PER_PARA) {
    const chunk = sentences
      .slice(i, i + SENTENCES_PER_PARA)
      .map((s) => s.trim())
      .join(" ");
    if (chunk.length > 20) paragraphs.push(chunk);
  }
  return paragraphs;
}

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = sessionStorage.getItem(`news-article-${params.slug}`);
      if (stored) {
        setArticle(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, [params.slug]);

  if (loading) {
    return (
      <>
        <TopBar />
        <main className="mx-auto max-w-3xl px-8 py-20 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-white/30" />
        </main>
      </>
    );
  }

  if (!article) {
    return (
      <>
        <TopBar />
        <main className="mx-auto max-w-3xl px-8 py-20 text-center">
          <p className="text-sm text-white/40">Article not found.</p>
          <button
            onClick={() => router.push("/news")}
            className="mt-4 text-sm text-[#2b6cb0] hover:underline"
          >
            Back to News
          </button>
        </main>
      </>
    );
  }

  const hasFullContent = article.content && article.content.length > 150;
  const paragraphs = hasFullContent ? formatContent(article.content!) : [];

  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-[920px] px-6 py-10">
        <button
          onClick={() => router.back()}
          className="mb-10 inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white/70"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to News
        </button>

        <div className="flex flex-wrap items-center gap-3">
          {article.provider === "Market Movers" && (
            <span className="rounded bg-red-500/20 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-red-400">
              Market Mover
            </span>
          )}
          {article.source && (
            <span className="rounded bg-[#2b6cb0]/15 px-2.5 py-1 text-xs font-semibold text-[#60a5fa]">
              {article.source}
            </span>
          )}
          {article.publishedAt && (
            <span className="inline-flex items-center gap-1.5 text-xs text-white/40">
              <Clock className="h-3.5 w-3.5" />
              {formatDate(article.publishedAt)}
            </span>
          )}
        </div>

        <h1 className="mt-6 text-4xl font-bold leading-[1.15] tracking-tight text-white">
          {article.title}
        </h1>

        {article.author && (
          <div className="mt-5 inline-flex items-center gap-2.5 text-sm text-white/50">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
              <User className="h-3.5 w-3.5 text-white/60" />
            </div>
            <span className="font-medium text-white/70">{article.author}</span>
          </div>
        )}

        {article.image && (
          <div className="mt-8 max-h-[320px] overflow-hidden rounded-lg border border-white/[0.08]">
            <img
              src={article.image}
              alt=""
              className="w-full object-cover max-h-[320px]"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}

        {article.description && (
          <p className="mt-10 border-l-2 border-[#2b6cb0]/40 pl-5 text-xl font-medium leading-relaxed text-white/90">
            {article.description}
          </p>
        )}

        {hasFullContent && paragraphs.length > 0 ? (
          <div className="mt-10 space-y-7">
            {paragraphs.map((para, i) => (
              <p
                key={i}
                className="text-[17px] leading-[1.9] text-white/85"
              >
                {para}
              </p>
            ))}
          </div>
        ) : article.content ? (
          <p className="mt-8 text-[17px] leading-[1.9] text-white/85">
            {article.content.replace(/\[\+\d+ chars\]$/, "")}
          </p>
        ) : null}

        <div className="mt-14 flex items-center gap-4 border-t border-white/[0.08] pt-8">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[#2b6cb0]/40 bg-[#2b6cb0]/10 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#2b6cb0]/25 hover:border-[#2b6cb0]/60"
          >
            Read on {article.source || "source"}
            <ExternalLink className="h-4 w-4" />
          </a>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-6 py-3 text-sm text-white/50 transition-colors hover:border-white/[0.16] hover:text-white/70"
          >
            <Bookmark className="h-4 w-4" />
            Back to Feed
          </button>
        </div>
      </main>
    </>
  );
}
