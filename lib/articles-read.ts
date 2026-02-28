const KEY = "badgeforge-articles-read";

function getWeekKey(): string {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);
  return start.toISOString().slice(0, 10);
}

export function recordArticleRead(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    const week = getWeekKey();
    const raw = localStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : {};
    if (data.week !== week) {
      data.week = week;
      data.slugs = [];
    }
    const slugs = new Set<string>(data.slugs || []);
    slugs.add(slug);
    data.slugs = Array.from(slugs);
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function getArticlesReadThisWeek(): number {
  if (typeof window === "undefined") return 0;
  try {
    const week = getWeekKey();
    const raw = localStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : {};
    if (data.week !== week) return 0;
    return (data.slugs || []).length;
  } catch {
    return 0;
  }
}
