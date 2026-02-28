import { createClient } from "@supabase/supabase-js";

export default async function handler(_req, res) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return res.status(500).json({ error: "Supabase env vars not set" });
  }

  const supabase = createClient(url, key);
  const { data, error } = await supabase.from("users").select("id").limit(1);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ ok: true, sample: data });
}
