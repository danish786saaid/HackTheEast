/**
 * POST /api/download-video
 * Downloads a generated video from MiniMax and saves it to public/videos/{tutorialId}.mp4
 * Body: { file_id, tutorialId }
 * Returns: { localPath } or { error }
 */
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "MINIMAX_API_KEY not configured" });
  }

  const { file_id, tutorialId } = req.body || {};
  if (!file_id || !tutorialId) {
    return res.status(400).json({ error: "file_id and tutorialId are required" });
  }

  try {
    const fileRes = await fetch(
      `https://api.minimax.io/v1/files/retrieve?file_id=${file_id}`,
      { headers: { Authorization: `Bearer ${apiKey}` } },
    );
    const fileData = await fileRes.json();
    const downloadUrl = fileData.file?.download_url;

    if (!downloadUrl) {
      return res.status(400).json({ error: "Could not get download URL from MiniMax" });
    }

    const videoRes = await fetch(downloadUrl);
    if (!videoRes.ok) {
      return res.status(500).json({ error: "Failed to download video file" });
    }

    const buffer = Buffer.from(await videoRes.arrayBuffer());
    const videosDir = path.join(process.cwd(), "public", "videos");
    if (!fs.existsSync(videosDir)) {
      fs.mkdirSync(videosDir, { recursive: true });
    }

    const filePath = path.join(videosDir, `${tutorialId}.mp4`);
    fs.writeFileSync(filePath, buffer);

    const localPath = `/videos/${tutorialId}.mp4`;
    return res.status(200).json({ localPath, size: buffer.length });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
