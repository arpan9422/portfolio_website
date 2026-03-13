import { NextRequest, NextResponse } from "next/server";

const SARVAM_API_KEY = process.env.SARVAM_API_KEY || "";

// Batch REST endpoint — supports WAV and WebM (via FormData)
const SARVAM_STT_URL = "https://api.sarvam.ai/speech-to-text";

export async function POST(req: NextRequest) {
  try {
    if (!SARVAM_API_KEY) {
      return NextResponse.json(
        { error: "Sarvam API key not configured" },
        { status: 503 }
      );
    }

    // Expect multipart/form-data with a "file" field containing the audio blob
    const formData = await req.formData();
    const audioFile = formData.get("file") as File | null;

    if (!audioFile) {
      return NextResponse.json(
        { error: "Audio file is required" },
        { status: 400 }
      );
    }

    // Forward to Sarvam STT using saaras:v3 (recommended model)
    // mode=transcribe → standard transcription in the original language
    const sarvamForm = new FormData();
    sarvamForm.append("file", audioFile, "recording.webm");
    sarvamForm.append("model", "saaras:v3");
    sarvamForm.append("mode", "transcribe");
    sarvamForm.append("language_code", "en-IN");
    sarvamForm.append("with_timestamps", "false");
    sarvamForm.append("with_diarization", "false");

    const sarvamRes = await fetch(SARVAM_STT_URL, {
      method: "POST",
      headers: {
        "api-subscription-key": SARVAM_API_KEY,
      },
      body: sarvamForm,
    });

    if (!sarvamRes.ok) {
      const errText = await sarvamRes.text();
      console.error("Sarvam STT error:", sarvamRes.status, errText);
      return NextResponse.json(
        { error: "STT service unavailable" },
        { status: 502 }
      );
    }

    const data = await sarvamRes.json();
    // Sarvam returns { transcript: "..." }
    const transcript: string = data?.transcript ?? "";

    return NextResponse.json({ transcript });
  } catch (err) {
    console.error("STT API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
