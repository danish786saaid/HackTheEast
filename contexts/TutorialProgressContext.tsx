"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  getTutorialProgress,
  setTutorialProgress as persistProgress,
  type TutorialProgressEntry,
} from "@/lib/tutorial-progress";

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
  const [progress, setProgress] = useState<TutorialProgressStore>({});

  useEffect(() => {
    setProgress(getTutorialProgress());
  }, []);

  const updateProgress = useCallback(
    (
      tutorialId: string,
      watchedPercent: number,
      durationSeconds?: number
    ) => {
      persistProgress(tutorialId, watchedPercent, durationSeconds);
      setProgress((prev) => {
        const existing = prev[tutorialId];
        return {
          ...prev,
          [tutorialId]: {
            watchedPercent,
            lastWatchedAt: new Date().toISOString(),
            durationSeconds: durationSeconds ?? existing?.durationSeconds,
          },
        };
      });
    },
    []
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
