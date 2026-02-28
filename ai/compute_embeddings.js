/**
 * Compute embeddings for seed items and output items_with_embeddings.json.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... node ai/compute_embeddings.js        # real embeddings
 *   node ai/compute_embeddings.js                               # deterministic mock vectors
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const SEED_PATH = path.join(__dirname, "..", "seed", "items.json");
const OUTPUT_PATH = path.join(__dirname, "items_with_embeddings.json");
const EMBEDDING_DIM = 128;
const OPENAI_MODEL = "text-embedding-3-small";

// --- Mock embedding: deterministic 128-dim vector from text hash ---

function mockEmbedding(text) {
  const hash = crypto.createHash("sha256").update(text).digest();
  const vec = new Array(EMBEDDING_DIM);
  for (let i = 0; i < EMBEDDING_DIM; i++) {
    vec[i] = (hash[i % hash.length] / 255) * 2 - 1;
  }
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0));
  return vec.map((v) => Math.round((v / norm) * 1e6) / 1e6);
}

// --- OpenAI embedding via fetch ---

async function openaiEmbeddings(texts, apiKey) {
  const batchSize = 20;
  const allEmbeddings = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: OPENAI_MODEL, input: batch }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI API error ${res.status}: ${err}`);
    }

    const data = await res.json();
    const sorted = data.data.sort((a, b) => a.index - b.index);
    allEmbeddings.push(...sorted.map((d) => d.embedding));
    if (i + batchSize < texts.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  return allEmbeddings;
}

// --- Main ---

async function main() {
  const items = JSON.parse(fs.readFileSync(SEED_PATH, "utf-8"));
  const apiKey = process.env.OPENAI_API_KEY;
  const useReal = apiKey && apiKey.startsWith("sk-");

  console.log(`Loaded ${items.length} seed items`);
  console.log(`Embedding mode: ${useReal ? "OpenAI " + OPENAI_MODEL : "mock (hash-based)"}`);

  const texts = items.map((item) => `${item.title} ${item.description}`);
  let embeddings;

  if (useReal) {
    try {
      embeddings = await openaiEmbeddings(texts, apiKey);
      console.log(`Received ${embeddings.length} embeddings (dim=${embeddings[0].length})`);
    } catch (err) {
      console.warn(`OpenAI failed: ${err.message} — falling back to mock`);
      embeddings = texts.map(mockEmbedding);
    }
  } else {
    embeddings = texts.map(mockEmbedding);
  }

  const output = items.map((item, i) => ({
    ...item,
    embedding: embeddings[i],
  }));

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`Wrote ${output.length} items to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
