"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
      <h2 className="text-lg font-semibold text-white">Something went wrong</h2>
      <button
        type="button"
        onClick={reset}
        className="rounded border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3b82f6]/20 hover:border-[#3b82f6]/40"
      >
        Try again
      </button>
    </div>
  );
}
