export interface SeedItem {
  id: string;
  title: string;
  url: string;
  type: string;
  source: string;
  description: string;
  date: string;
  tags: string[];
  embedding: number[];
}

export interface ScoredItem extends SeedItem {
  similarity: number;
  recency_score: number;
  score: number;
}

function dotProduct(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

function magnitude(v: number[]): number {
  return Math.sqrt(dotProduct(v, v));
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const magA = magnitude(a);
  const magB = magnitude(b);
  if (magA === 0 || magB === 0) return 0;
  return dotProduct(a, b) / (magA * magB);
}

/**
 * Recency score: 1.0 for today, decaying toward 0 for older items.
 * Uses exponential decay with a half-life of ~14 days.
 */
export function recencyScore(dateStr: string): number {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const daysDiff = (now - then) / (1000 * 60 * 60 * 24);
  const halfLife = 14;
  return Math.exp((-Math.LN2 * daysDiff) / halfLife);
}

/**
 * Retrieve top-k items by combined score:
 * score = similarity + alpha * recency_score
 */
export function retrieve(
  goalEmbedding: number[],
  items: SeedItem[],
  topK: number = 10,
  alpha: number = 0.15
): ScoredItem[] {
  const scored: ScoredItem[] = items.map((item) => {
    const similarity = cosineSimilarity(goalEmbedding, item.embedding);
    const recency = recencyScore(item.date);
    const score = similarity + alpha * recency;
    return { ...item, similarity, recency_score: recency, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

/**
 * Simple keyword-based fallback when embedding service is unavailable.
 * Scores by tag/title overlap with goal keywords.
 */
export function keywordFallback(
  goal: string,
  items: SeedItem[],
  topK: number = 10
): ScoredItem[] {
  const goalWords = goal
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 2);

  const scored: ScoredItem[] = items.map((item) => {
    const text = `${item.title} ${item.description} ${item.tags.join(" ")}`.toLowerCase();
    const matches = goalWords.filter((w) => text.includes(w)).length;
    const similarity = goalWords.length > 0 ? matches / goalWords.length : 0;
    const recency = recencyScore(item.date);
    const score = similarity + 0.15 * recency;
    return { ...item, similarity, recency_score: recency, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

/**
 * Generate a mock embedding for a goal string.
 * Deterministic based on character codes — good enough for demo.
 * In production, call an embedding API (e.g. MiniMax or OpenAI).
 */
export function mockEmbedding(text: string, dims: number = 32): number[] {
  const embedding: number[] = new Array(dims).fill(0);
  const normalized = text.toLowerCase();

  for (let i = 0; i < normalized.length; i++) {
    const idx = i % dims;
    embedding[idx] += normalized.charCodeAt(i) / 122;
  }

  const mag = Math.sqrt(embedding.reduce((s, v) => s + v * v, 0));
  if (mag > 0) {
    for (let i = 0; i < dims; i++) embedding[i] /= mag;
  }

  return embedding;
}
