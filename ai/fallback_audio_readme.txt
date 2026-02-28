Fallback Audio Strategy
======================

If MiniMax Speech-02 audio generation is unavailable:

1. Record the narration from audio_script.txt manually (any team member).
   Save as ai/demo_audio.mp3 (target ~80 seconds).

2. Use any free TTS service (e.g. Google TTS, macOS `say` command) to
   generate a placeholder MP3 from the script.

3. The frontend audio playback component should check for ai/demo_audio.mp3
   first. If missing, skip audio and rely on the visual demo flow.

MiniMax Speech-02 generation (when API is available):
  - Endpoint: POST https://api.minimax.chat/v1/t2a_v2
  - Model: speech-02-hd
  - Auth: Bearer $MINIMAX_API_KEY
  - Body: { "model": "speech-02-hd", "text": "<script>", "voice_setting": { "voice_id": "default" } }
  - Save response audio bytes to ai/demo_audio.mp3
