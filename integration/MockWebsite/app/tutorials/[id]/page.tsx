"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import { MOCK_TUTORIALS } from "@/lib/constants";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  BarChart2,
  Play,
  Loader2,
  Video,
  RefreshCw,
  AlertCircle,
  Download,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";

type VideoCache = Record<
  string,
  { file_id: string; download_url: string; cached_at: number }
>;

const CACHE_KEY = "badgeforge-video-cache";

function loadVideoCache(): VideoCache {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveVideoCache(tutorialId: string, file_id: string, download_url: string) {
  const cache = loadVideoCache();
  cache[tutorialId] = { file_id, download_url, cached_at: Date.now() };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

type GenStatus =
  | "idle"
  | "submitting"
  | "Preparing"
  | "Queueing"
  | "Processing"
  | "Success"
  | "Fail"
  | "error";

const statusMessages: Record<string, string> = {
  submitting: "Submitting to MiniMax...",
  Preparing: "Preparing video generation...",
  Queueing: "In queue — waiting for GPU...",
  Processing: "Generating your video...",
  Success: "Video ready!",
  Fail: "Generation failed.",
  error: "Something went wrong.",
};

export default function TutorialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const tutorial = MOCK_TUTORIALS.find((t) => t.id === id);

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [genStatus, setGenStatus] = useState<GenStatus>("idle");
  const [taskId, setTaskId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!tutorial) return;

    const localPath = `/videos/${tutorial.id}.mp4`;
    fetch(localPath, { method: "HEAD" })
      .then((res) => {
        if (res.ok) {
          setVideoUrl(localPath);
          setGenStatus("Success");
          setIsSaved(true);
        } else {
          const cache = loadVideoCache();
          const entry = cache[tutorial.id];
          if (entry?.download_url) {
            const ageMs = Date.now() - entry.cached_at;
            if (ageMs < 55 * 60 * 1000) {
              setVideoUrl(entry.download_url);
              setGenStatus("Success");
            }
          }
        }
      })
      .catch(() => {
        const cache = loadVideoCache();
        const entry = cache[tutorial.id];
        if (entry?.download_url) {
          const ageMs = Date.now() - entry.cached_at;
          if (ageMs < 55 * 60 * 1000) {
            setVideoUrl(entry.download_url);
            setGenStatus("Success");
          }
        }
      });
  }, [tutorial]);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const pollStatus = useCallback(
    (tid: string) => {
      if (pollRef.current) clearInterval(pollRef.current);

      pollRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/video-status?task_id=${tid}`);
          const data = await res.json();

          if (data.error) {
            setGenStatus("error");
            setErrorMsg(data.error);
            if (pollRef.current) clearInterval(pollRef.current);
            return;
          }

          setGenStatus(data.status as GenStatus);

          if (data.status === "Success" && data.download_url) {
            setVideoUrl(data.download_url);
            if (tutorial) {
              saveVideoCache(tutorial.id, data.file_id, data.download_url);
            }
            if (pollRef.current) clearInterval(pollRef.current);
          } else if (data.status === "Fail") {
            setErrorMsg("Video generation failed. Try again.");
            if (pollRef.current) clearInterval(pollRef.current);
          }
        } catch {
          setGenStatus("error");
          setErrorMsg("Network error while checking status.");
          if (pollRef.current) clearInterval(pollRef.current);
        }
      }, 5000);
    },
    [tutorial],
  );

  const handleGenerate = async () => {
    if (!tutorial) return;

    setGenStatus("submitting");
    setErrorMsg(null);
    setVideoUrl(null);

    try {
      const res = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: (tutorial as typeof tutorial & { videoPrompt?: string }).videoPrompt || tutorial.description,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setGenStatus("error");
        setErrorMsg(data.error);
        return;
      }

      setTaskId(data.task_id);
      setGenStatus("Preparing");
      pollStatus(data.task_id);
    } catch {
      setGenStatus("error");
      setErrorMsg("Failed to submit video generation request.");
    }
  };

  if (!tutorial) {
    return (
      <>
        <TopBar />
        <main className="mx-auto max-w-[1600px] px-8 py-10">
          <p className="text-white">Tutorial not found.</p>
          <button
            onClick={() => router.push("/tutorials")}
            className="mt-4 text-sm text-[#3b82f6] hover:text-blue-400"
          >
            Back to tutorials
          </button>
        </main>
      </>
    );
  }

  const isGenerating = ["submitting", "Preparing", "Queueing", "Processing"].includes(genStatus);

  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-[1600px] px-8 py-10">
        <button
          onClick={() => router.push("/tutorials")}
          className="mb-6 flex items-center gap-1.5 text-sm text-[#a8a29e] hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to tutorials
        </button>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <div className="relative aspect-video w-full overflow-hidden bg-[#141211] border border-white/[0.06]">
              {videoUrl && genStatus === "Success" ? (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="h-full w-full object-contain"
                  playsInline
                />
              ) : (
                <div className="absolute inset-0">
                  <Image
                    src={tutorial.imageUrl}
                    alt={tutorial.title}
                    fill
                    className="object-cover opacity-40"
                    sizes="66vw"
                  />
                  <div className="absolute inset-0 bg-black/40" />

                  <div className="relative flex h-full flex-col items-center justify-center gap-4 px-8">
                    {genStatus === "idle" && (
                      <>
                        <button
                          onClick={handleGenerate}
                          className="flex items-center gap-3 bg-[#3b82f6] px-8 py-4 text-base font-semibold text-white hover:bg-[#2563eb] transition-colors"
                        >
                          <Video className="h-5 w-5" />
                          Generate Video
                        </button>
                        <p className="text-xs text-white/50 text-center max-w-sm">
                          AI-generated tutorial video powered by MiniMax Hailuo.
                          Takes 1-3 minutes.
                        </p>
                      </>
                    )}

                    {isGenerating && (
                      <>
                        <Loader2 className="h-10 w-10 text-[#3b82f6] animate-spin" />
                        <p className="text-sm font-medium text-white">
                          {statusMessages[genStatus] || "Working..."}
                        </p>
                        <div className="w-64 h-1.5 bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-[#3b82f6] transition-all duration-1000"
                            style={{
                              width:
                                genStatus === "submitting"
                                  ? "10%"
                                  : genStatus === "Preparing"
                                    ? "25%"
                                    : genStatus === "Queueing"
                                      ? "45%"
                                      : "75%",
                            }}
                          />
                        </div>
                        <p className="text-[11px] text-white/40">
                          This usually takes 1-3 minutes. Don&apos;t close this page.
                        </p>
                      </>
                    )}

                    {(genStatus === "Fail" || genStatus === "error") && (
                      <>
                        <AlertCircle className="h-10 w-10 text-red-400" />
                        <p className="text-sm font-medium text-red-400">
                          {errorMsg || "Generation failed."}
                        </p>
                        <button
                          onClick={handleGenerate}
                          className="flex items-center gap-2 bg-white/10 px-6 py-2.5 text-sm font-medium text-white hover:bg-white/15 transition-colors"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Try again
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {videoUrl && genStatus === "Success" && (
              <div className="mt-3 flex items-center gap-3">
                {!isSaved && (
                  <button
                    onClick={async () => {
                      if (!tutorial) return;
                      const cache = loadVideoCache();
                      const entry = cache[tutorial.id];
                      if (!entry?.file_id) return;
                      setIsSaving(true);
                      try {
                        const res = await fetch("/api/download-video", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ file_id: entry.file_id, tutorialId: tutorial.id }),
                        });
                        const data = await res.json();
                        if (data.localPath) {
                          setVideoUrl(data.localPath);
                          setIsSaved(true);
                        }
                      } catch { /* ignore */ }
                      setIsSaving(false);
                    }}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 text-xs text-[#3b82f6] hover:text-blue-400 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                    {isSaving ? "Saving..." : "Save video permanently"}
                  </button>
                )}
                {isSaved && (
                  <span className="flex items-center gap-1.5 text-xs text-green-400">
                    <CheckCircle className="h-3 w-3" />
                    Saved locally
                  </span>
                )}
                <button
                  onClick={handleGenerate}
                  className="flex items-center gap-1.5 text-xs text-[#a8a29e] hover:text-white transition-colors"
                >
                  <RefreshCw className="h-3 w-3" />
                  Regenerate video
                </button>
              </div>
            )}
          </div>

          <div className="col-span-1">
            <div className="bg-white p-6">
              <h1 className="text-xl font-bold text-gray-900">
                {tutorial.title}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {tutorial.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                  <BookOpen className="h-3.5 w-3.5" />
                  {tutorial.modules} modules
                </span>
                <span className="inline-flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                  <Clock className="h-3.5 w-3.5" />
                  {tutorial.duration}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                  <BarChart2 className="h-3.5 w-3.5" />
                  {tutorial.level}
                </span>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-5">
                <h2 className="text-sm font-semibold text-gray-900">
                  About this tutorial
                </h2>
                <ul className="mt-3 space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <Play className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3b82f6]" />
                    AI-generated video overview
                  </li>
                  <li className="flex items-start gap-2">
                    <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3b82f6]" />
                    {tutorial.modules} structured learning modules
                  </li>
                  <li className="flex items-start gap-2">
                    <BarChart2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3b82f6]" />
                    {tutorial.level} difficulty level
                  </li>
                </ul>
              </div>

              {!videoUrl && genStatus === "idle" && (
                <button
                  onClick={handleGenerate}
                  className="mt-6 flex w-full items-center justify-center gap-2 bg-[#3b82f6] py-3 text-sm font-semibold text-white hover:bg-[#2563eb] transition-colors"
                >
                  <Video className="h-4 w-4" />
                  Generate Tutorial Video
                </button>
              )}

              {isGenerating && (
                <div className="mt-6 flex w-full items-center justify-center gap-2 bg-zinc-800 py-3 text-sm font-medium text-white">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {statusMessages[genStatus] || "Generating..."}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
