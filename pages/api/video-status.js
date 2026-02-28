/**
 * GET /api/video-status?task_id=xxx
 * Polls MiniMax for video generation task status.
 * When complete, fetches the download URL via file retrieve API.
 * Returns: { status, file_id?, download_url?, video_width?, video_height? }
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey || apiKey === "YOUR_KEY_HERE") {
    return res.status(500).json({ error: "MINIMAX_API_KEY not configured" });
  }

  const { task_id } = req.query;
  if (!task_id) {
    return res.status(400).json({ error: "task_id is required" });
  }

  try {
    const statusRes = await fetch(
      `https://api.minimax.io/v1/query/video_generation?task_id=${task_id}`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      },
    );
    const statusData = await statusRes.json();

    if (statusData.base_resp?.status_code !== 0) {
      return res.status(400).json({
        error: statusData.base_resp?.status_msg || "Query failed",
        code: statusData.base_resp?.status_code,
      });
    }

    const result = {
      status: statusData.status,
      file_id: statusData.file_id || null,
      video_width: statusData.video_width || null,
      video_height: statusData.video_height || null,
      download_url: null,
    };

    if (statusData.status === "Success" && statusData.file_id) {
      const fileRes = await fetch(
        `https://api.minimax.io/v1/files/retrieve?file_id=${statusData.file_id}`,
        {
          headers: { Authorization: `Bearer ${apiKey}` },
        },
      );
      const fileData = await fileRes.json();

      if (fileData.file?.download_url) {
        result.download_url = fileData.file.download_url;
      }
    }

    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
