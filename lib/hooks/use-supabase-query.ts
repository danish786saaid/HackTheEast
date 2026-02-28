"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type QueryState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

/**
 * Generic hook for Supabase queries.
 * Returns live data when Supabase is configured, otherwise returns fallback.
 */
export function useSupabaseQuery<T>(
  queryFn: () => Promise<T>,
  fallback: T,
  deps: unknown[] = []
): QueryState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) {
      setData(fallback);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await queryFn();
      setData(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Query failed";
      console.error("[useSupabaseQuery]", message);
      setError(message);
      setData(fallback);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data: data ?? fallback, loading, error, refetch: execute };
}
