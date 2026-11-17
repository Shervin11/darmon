import { NextRequest, NextResponse } from "next/server";
import { MAX_AUDIO_BYTES, guardAi } from "@/lib/ai-guard";
import { groqTranscribe } from "@/lib/groq";

export async function POST(req: NextRequest) {
  const denied = await guardAi(req, "transcribe", { limit: 40 });
  if (denied) return denied;

  try {
    const audio = (await req.formData()).get("audio");
    if (!(audio instanceof File)) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }
    if (audio.size > MAX_AUDIO_BYTES) {
      return NextResponse.json({ error: "Audio file is too large" }, { status: 413 });
    }
    return NextResponse.json({ text: await groqTranscribe(audio) });
  } catch (error) {
    console.error("Transcribe API error:", error);
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
  }
}
