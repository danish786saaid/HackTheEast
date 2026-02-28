#!/usr/bin/env node

/**
 * Seed loader — loads items_with_embeddings.json into Supabase content table.
 *
 * Usage:
 *   node scripts/seed.js
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const dotenvPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(dotenvPath)) {
  const envContent = fs.readFileSync(dotenvPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY must be set in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ITEMS_PATH = path.resolve(__dirname, "../data/items_with_embeddings.json");

async function seed() {
  console.log("Loading items from", ITEMS_PATH);
  const items = JSON.parse(fs.readFileSync(ITEMS_PATH, "utf-8"));
  console.log(`Found ${items.length} items`);

  // Get the first user to use as owner
  const { data: users, error: userErr } = await supabase
    .from("users")
    .select("id")
    .limit(1);

  if (userErr || !users?.length) {
    console.error("Error: No users found. Create a user first (run the migration seed.sql).");
    console.error(userErr?.message);
    process.exit(1);
  }

  const ownerId = users[0].id;
  console.log(`Using owner: ${ownerId}`);

  // Map items to content table schema
  const rows = items.map((item) => ({
    owner: ownerId,
    title: item.title,
    summary: item.description,
    source_url: item.url,
    source_type: mapSourceType(item.type),
    tags: item.tags,
    relevance_score: 0.8,
    created_at: new Date(item.date).toISOString(),
  }));

  // Upsert in batches of 25
  const batchSize = 25;
  let inserted = 0;

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = await supabase.from("content").insert(batch);
    if (error) {
      console.error(`Batch ${Math.floor(i / batchSize) + 1} error:`, error.message);
    } else {
      inserted += batch.length;
      console.log(`Inserted ${inserted}/${rows.length}`);
    }
  }

  console.log(`\nDone! ${inserted} items seeded into content table.`);
}

function mapSourceType(type) {
  const map = {
    article: "article",
    video: "video",
    practice: "course",
    paper: "paper",
    podcast: "podcast",
  };
  return map[type] || "other";
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
