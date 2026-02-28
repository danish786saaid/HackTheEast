const TUTORIAL_PROGRESS_KEY = "badgeforge-tutorial-progress";

export type TutorialProgressEntry = {
  watchedPercent: number;
  lastWatchedAt: string;
  /** Actual video duration in seconds, set when user watches */
  durationSeconds?: number;
};

export function getTutorialProgress(): Record<
  string,
  TutorialProgressEntry
> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(TUTORIAL_PROGRESS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function setTutorialProgress(
  tutorialId: string,
  watchedPercent: number,
  durationSeconds?: number
): void {
  if (typeof window === "undefined") return;
  try {
    const store = getTutorialProgress();
    const existing = store[tutorialId];
    store[tutorialId] = {
      watchedPercent,
      lastWatchedAt: new Date().toISOString(),
      durationSeconds:
        durationSeconds ??
        existing?.durationSeconds,
    };
    localStorage.setItem(TUTORIAL_PROGRESS_KEY, JSON.stringify(store));
  } catch {
    // ignore
  }
}
