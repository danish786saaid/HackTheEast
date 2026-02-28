import {
  getUserArticlesReadThisWeek,
  recordUserArticleRead,
} from "@/lib/user-learning";

export async function recordArticleRead(
  userId: string,
  slug: string
): Promise<void> {
  if (!userId || !slug) return;
  await recordUserArticleRead({ userId, articleSlug: slug });
}

export async function getArticlesReadThisWeek(userId: string): Promise<number> {
  if (!userId) return 0;
  return getUserArticlesReadThisWeek(userId);
}
