import { NextRequest } from "next/server";

const SARVAM_API_KEY = process.env.SARVAM_API_KEY || "";

// HTTP Streaming endpoint — returns raw binary audio, no base64 wrapping
const SARVAM_TTS_STREAM_URL = "https://api.sarvam.ai/text-to-speech/stream";

// Strip markdown syntax so the TTS voice doesn't read out ** or - characters
function stripMarkdownForTTS(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")        // **bold** → bold
    .replace(/\*(.+?)\*/g, "$1")            // *italic* → italic
    .replace(/^#{1,6}\s+/gm, "")           // ## heading → plain
    .replace(/^[-*]\s+/gm, "")             // - bullets → remove marker
    .replace(/`{1,3}[^`]*`{1,3}/g, "")     // `code` → remove
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // [text](url) → text
    .replace(/\n{3,}/g, "\n\n")            // collapse triple+ newlines
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const { text } = (await req.json()) as { text: string };

    if (!text?.trim()) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!SARVAM_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Sarvam API key not configured" }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    // Stream endpoint supports up to 3500 chars (much better than old 500-char limit)
    // Strip markdown first so the voice doesn't read out ** or bullet chars
    const safeText = stripMarkdownForTTS(text.slice(0, 3500));

    const sarvamRes = await fetch(SARVAM_TTS_STREAM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": SARVAM_API_KEY,
      },
      body: JSON.stringify({
        text: safeText,
        target_language_code: "en-IN",
        speaker: "advait",
        model: "bulbul:v3",           // recommended model
        output_audio_codec: "mp3",
        pace: 1.0,
        speech_sample_rate: 22050,
        enable_preprocessing: true,   // normalise English words & numbers
      }),
    });

    if (!sarvamRes.ok) {
      const errText = await sarvamRes.text();
      console.error("Sarvam TTS stream error:", sarvamRes.status, errText);
      return new Response(
        JSON.stringify({ error: "TTS service unavailable" }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    // Proxy the raw binary MP3 stream straight to the client
    return new Response(sarvamRes.body, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("TTS API error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
