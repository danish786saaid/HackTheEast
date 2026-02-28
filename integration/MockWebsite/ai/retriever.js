/**
 * Retriever + Ranker — PRD-aligned.
 *
 * score = cosine_similarity(goal_embedding, item_embedding) + alpha * recency_score
 *
 * Exports: retrieve, keywordFallback, cosineSimilarity, recencyScore, mockEmbedding
 */

const crypto = require("crypto");
const path = require("path");

const ALPHA = 0.15;
const EMBEDDING_DIM = 128;
const RECENCY_HALF_LIFE_DAYS = 14;

let _itemsCache = null;

function loadItems() {
  if (_itemsCache) return _itemsCache;
  const fs = require("fs");
  const filePath = path.join(process.cwd(), "ai", "items_with_embeddings.json");
  _itemsCache = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return _itemsCache;
}

// --- Vector math ---

function dotProduct(a, b) {
  let sum = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) sum += a[i] * b[i];
  return sum;
}

function magnitude(v) {
  return Math.sqrt(dotProduct(v, v));
}

function cosineSimilarity(a, b) {
  const magA = magnitude(a);
  const magB = magnitude(b);
  if (magA === 0 || magB === 0) return 0;
  return dotProduct(a, b) / (magA * magB);
}

// --- Recency scoring ---

function recencyScore(dateStr) {
  if (!dateStr) return 0;
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const daysDiff = (now - then) / (1000 * 60 * 60 * 24);
  return Math.exp((-Math.LN2 * daysDiff) / RECENCY_HALF_LIFE_DAYS);
}

// --- Mock embedding (matches compute_embeddings.js) ---

function mockEmbedding(text) {
  const hash = crypto.createHash("sha256").update(text).digest();
  const vec = new Array(EMBEDDING_DIM);
  for (let i = 0; i < EMBEDDING_DIM; i++) {
    vec[i] = (hash[i % hash.length] / 255) * 2 - 1;
  }
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0));
  return vec.map((v) => Math.round((v / norm) * 1e6) / 1e6);
}

// --- Main retriever ---

function retrieve(goalEmbedding, topK = 10, alpha = ALPHA) {
  const items = loadItems();

  const scored = items.map((item) => {
    const similarity = cosineSimilarity(goalEmbedding, item.embedding);
    const recency = recencyScore(item.date);
    const score = similarity + alpha * recency;
    return {
      id: item.id,
      title: item.title,
      url: item.url,
      type: item.type,
      description: item.description,
      date: item.date,
      similarity: Math.round(similarity * 1e4) / 1e4,
      recency_score: Math.round(recency * 1e4) / 1e4,
      score: Math.round(score * 1e4) / 1e4,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

// --- Keyword fallback when embeddings unavailable ---

function keywordFallback(goal, topK = 10) {
  const items = loadItems();
  const goalWords = goal
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 2);

  const scored = items.map((item) => {
    const text = `${item.title} ${item.description}`.toLowerCase();
    const matches = goalWords.filter((w) => text.includes(w)).length;
    const similarity = goalWords.length > 0 ? matches / goalWords.length : 0;
    const recency = recencyScore(item.date);
    const score = similarity + ALPHA * recency;
    return {
      id: item.id,
      title: item.title,
      url: item.url,
      type: item.type,
      description: item.description,
      date: item.date,
      similarity: Math.round(similarity * 1e4) / 1e4,
      recency_score: Math.round(recency * 1e4) / 1e4,
      score: Math.round(score * 1e4) / 1e4,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

/**
 * High-level retrieve: compute goal embedding, then rank.
 * Falls back to keyword scoring if embedding fails.
 */
function retrieveByGoal(userGoal, topK = 10) {
  try {
    const goalText = (userGoal || "").trim();
    if (!goalText) return keywordFallback("general learning", topK);

    const goalEmbedding = mockEmbedding(goalText);
    return retrieve(goalEmbedding, topK);
  } catch (err) {
    console.warn("[retriever] Embedding failed, using keyword fallback:", err.message);
    return keywordFallback(userGoal || "general learning", topK);
  }
}

module.exports = {
  retrieve,
  retrieveByGoal,
  keywordFallback,
  cosineSimilarity,
  recencyScore,
  mockEmbedding,
  loadItems,
  ALPHA,
};
