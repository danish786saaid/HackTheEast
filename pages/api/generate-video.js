/**
 * POST /api/generate-video
 * Submits a text-to-video generation task to MiniMax Hailuo API.
 * Body: { prompt, model?, duration?, resolution? }
 * Returns: { task_id } or { error }
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey || apiKey === "YOUR_KEY_HERE") {
    return res.status(500).json({ error: "MINIMAX_API_KEY not configured" });
  }

  const {
    prompt,
    model = "MiniMax-Hailuo-02",
    duration = 6,
    resolution = "768P",
  } = req.body || {};

  if (!prompt) {
    return res.status(400).json({ error: "prompt is required" });
  }

  try {
    const response = await fetch("https://api.minimax.io/v1/video_generation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        prompt,
        duration,
        resolution,
        prompt_optimizer: true,
      }),
    });

    const data = await response.json();

    if (data.base_resp?.status_code !== 0) {
      return res.status(400).json({
        error: data.base_resp?.status_msg || "Video generation failed",
        code: data.base_resp?.status_code,
      });
    }

    return res.status(200).json({ task_id: data.task_id });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
