"use client";

import { createClient } from "@/lib/supabase/client";

export type UserTutorialProgressRow = {
  tutorialId: string;
  watchedPercent: number;
  durationSeconds: number;
  lastWatchedAt: string;
};

export type UserCategoryMasteryRow = {
  categoryId: string;
  masteryPercent: number;
};

export type UserAchievementRow = {
  achievementId: string;
  progress: number;
  total: number;
  achieved: boolean;
};

function getDb() {
  const db = createClient();
  if (!db) throw new Error("Supabase not configured");
  return db;
}

export async function fetchUserTutorialProgress(
  userId: string
): Promise<Record<string, UserTutorialProgressRow>> {
  const { data, error } = await getDb()
    .from("user_tutorial_progress")
    .select("tutorial_id, watched_percent, duration_seconds, last_watched_at")
    .eq("user_id", userId);
  if (error) throw error;

  const out: Record<string, UserTutorialProgressRow> = {};
  (data ?? []).forEach((row) => {
    out[row.tutorial_id] = {
      tutorialId: row.tutorial_id,
      watchedPercent: row.watched_percent,
      durationSeconds: row.duration_seconds ?? 0,
      lastWatchedAt: row.last_watched_at,
    };
  });
  return out;
}

export async function upsertUserTutorialProgress(input: {
  userId: string;
  tutorialId: string;
  watchedPercent: number;
  durationSeconds: number;
  lastWatchedAt?: string;
}): Promise<void> {
  const nowIso = input.lastWatchedAt ?? new Date().toISOString();
  const completedAt = input.watchedPercent >= 100 ? nowIso : null;
  const { error } = await getDb().from("user_tutorial_progress").upsert(
    {
      user_id: input.userId,
      tutorial_id: input.tutorialId,
      watched_percent: Math.max(0, Math.min(100, Math.round(input.watchedPercent))),
      duration_seconds: Math.max(0, Math.round(input.durationSeconds)),
      last_watched_at: nowIso,
      completed_at: completedAt,
      updated_at: nowIso,
    },
    { onConflict: "user_id,tutorial_id" }
  );
  if (error) throw error;
}

export async function recordUserArticleRead(input: {
  userId: string;
  articleSlug: string;
}): Promise<void> {
  const { error } = await getDb().from("user_article_reads").insert({
    user_id: input.userId,
    article_slug: input.articleSlug,
  });
  if (error) throw error;
}

function getWeekStartIso(): string {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);
  return start.toISOString();
}

export async function getUserArticlesReadThisWeek(userId: string): Promise<number> {
  const { count, error } = await getDb()
    .from("user_article_reads")
    .select("id", { head: true, count: "exact" })
    .eq("user_id", userId)
    .gte("read_at", getWeekStartIso());
  if (error) throw error;
  return count ?? 0;
}

export async function upsertUserCategoryMastery(
  userId: string,
  rows: UserCategoryMasteryRow[]
): Promise<void> {
  if (rows.length === 0) return;
  const payload = rows.map((row) => ({
    user_id: userId,
    category_id: row.categoryId,
    mastery_percent: Math.max(0, Math.min(100, Math.round(row.masteryPercent))),
    updated_at: new Date().toISOString(),
  }));
  const { error } = await getDb()
    .from("user_category_mastery")
    .upsert(payload, { onConflict: "user_id,category_id" });
  if (error) throw error;
}

export async function fetchUserCategoryMastery(
  userId: string
): Promise<Record<string, number>> {
  const { data, error } = await getDb()
    .from("user_category_mastery")
    .select("category_id, mastery_percent")
    .eq("user_id", userId);
  if (error) throw error;
  const out: Record<string, number> = {};
  (data ?? []).forEach((row) => {
    out[row.category_id] = row.mastery_percent ?? 0;
  });
  return out;
}

export async function upsertUserAchievements(
  userId: string,
  rows: UserAchievementRow[]
): Promise<void> {
  if (rows.length === 0) return;
  const payload = rows.map((row) => ({
    user_id: userId,
    achievement_id: row.achievementId,
    progress: Math.max(0, Math.round(row.progress)),
    total: Math.max(1, Math.round(row.total)),
    achieved: row.achieved,
    updated_at: new Date().toISOString(),
  }));
  const { error } = await getDb()
    .from("user_achievements")
    .upsert(payload, { onConflict: "user_id,achievement_id" });
  if (error) throw error;
}

export async function fetchUserAchievements(
  userId: string
): Promise<Record<string, UserAchievementRow>> {
  const { data, error } = await getDb()
    .from("user_achievements")
    .select("achievement_id, progress, total, achieved")
    .eq("user_id", userId);
  if (error) throw error;
  const out: Record<string, UserAchievementRow> = {};
  (data ?? []).forEach((row) => {
    out[row.achievement_id] = {
      achievementId: row.achievement_id,
      progress: row.progress ?? 0,
      total: row.total ?? 1,
      achieved: !!row.achieved,
    };
  });
  return out;
}
