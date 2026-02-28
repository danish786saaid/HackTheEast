"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "@/lib/auth-context";
import {
  fetchUserTutorialProgress,
  upsertUserTutorialProgress,
  upsertUserCategoryMastery,
} from "@/lib/user-learning";
import { RULE_CATEGORIES } from "@/lib/constants";

export type TutorialProgressEntry = {
  watchedPercent: number;
  lastWatchedAt: string;
  durationSeconds?: number;
};

type TutorialProgressStore = Record<string, TutorialProgressEntry>;

type TutorialProgressContextValue = {
  progress: TutorialProgressStore;
  getProgress: (tutorialId: string) => number;
  updateProgress: (
    tutorialId: string,
    watchedPercent: number,
    durationSeconds?: number
  ) => void;
};

const TutorialProgressContext =
  createContext<TutorialProgressContextValue | null>(null);

export function TutorialProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<TutorialProgressStore>({});

  useEffect(() => {
    async function load() {
      if (!user?.id) {
        setProgress({});
        return;
      }
      try {
        const rows = await fetchUserTutorialProgress(user.id);
        const mapped: TutorialProgressStore = {};
        Object.values(rows).forEach((row) => {
          mapped[row.tutorialId] = {
            watchedPercent: row.watchedPercent,
            lastWatchedAt: row.lastWatchedAt,
            durationSeconds: row.durationSeconds,
          };
        });
        setProgress(mapped);
      } catch {
        setProgress({});
      }
    }
    void load();
  }, [user?.id]);

  const persistCategoryMastery = useCallback(
    async (next: TutorialProgressStore) => {
      if (!user?.id) return;
      const byCategory: Record<string, number[]> = {
        ai: [],
        crypto: [],
        geopolitics: [],
        career: [],
      };
      const mapTutorialToCategory: Record<string, keyof typeof byCategory> = {
        tut1: "crypto",
        tut2: "ai",
        tut3: "crypto",
      };
      Object.entries(next).forEach(([tutorialId, entry]) => {
        const category = mapTutorialToCategory[tutorialId];
        if (!category) return;
        byCategory[category].push(entry.watchedPercent);
      });

      const rows = RULE_CATEGORIES.map((category) => {
        const values = byCategory[category.id] ?? [];
        const avg =
          values.length > 0
            ? Math.round(values.reduce((sum, v) => sum + v, 0) / values.length)
            : 0;
        return {
          categoryId: category.id,
          masteryPercent: avg,
        };
      });
      await upsertUserCategoryMastery(user.id, rows);
    },
    [user?.id]
  );

  const updateProgress = useCallback(
    (
      tutorialId: string,
      watchedPercent: number,
      durationSeconds?: number
    ) => {
      if (!user?.id) return;
      setProgress((prev) => {
        const existing = prev[tutorialId];
        const next = {
          ...prev,
          [tutorialId]: {
            watchedPercent,
            lastWatchedAt: new Date().toISOString(),
            durationSeconds: durationSeconds ?? existing?.durationSeconds,
          },
        };
        void upsertUserTutorialProgress({
          userId: user.id,
          tutorialId,
          watchedPercent,
          durationSeconds: durationSeconds ?? existing?.durationSeconds ?? 0,
          lastWatchedAt: next[tutorialId].lastWatchedAt,
        }).then(() => persistCategoryMastery(next));
        return next;
      });
    },
    [persistCategoryMastery, user?.id]
  );

  const getProgress = useCallback(
    (tutorialId: string) => {
      return progress[tutorialId]?.watchedPercent ?? 0;
    },
    [progress]
  );

  const value: TutorialProgressContextValue = {
    progress,
    getProgress,
    updateProgress,
  };

  return (
    <TutorialProgressContext.Provider value={value}>
      {children}
    </TutorialProgressContext.Provider>
  );
}

export function useTutorialProgress(): TutorialProgressContextValue {
  const ctx = useContext(TutorialProgressContext);
  if (!ctx) {
    throw new Error(
      "useTutorialProgress must be used within TutorialProgressProvider"
    );
  }
  return ctx;
}
