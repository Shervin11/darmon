import { NextRequest, NextResponse } from "next/server";

const DEFAULT_VOICE_ID = "nPczCjzI2devNBz1zQrb"; // Brian — professional male voice

export async function POST(req: NextRequest) {
  try {
    const { text, voice_id } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "ElevenLabs API key not configured" }, { status: 500 });
    }

    const voiceId = voice_id || DEFAULT_VOICE_ID;

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2_5",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("ElevenLabs API error:", errorData);
      return NextResponse.json({ error: "Text-to-speech failed" }, { status: 500 });
    }

    // Stream the MP3 audio back
    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(audioBuffer.byteLength),
      },
    });
  } catch (error) {
    console.error("Speak API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
