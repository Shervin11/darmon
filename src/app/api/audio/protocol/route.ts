import { NextRequest, NextResponse } from "next/server";
import { MAX_AUDIO_BYTES, guardAi } from "@/lib/ai-guard";
import { groqChat, groqTranscribe, parseModelJson } from "@/lib/groq";

const SYSTEM_PROMPT = `Ты — медицинский секретарь платформы DARMON. Твоя задача — прослушать диктовку врача и извлечь данные в строгий JSON-формат.

ПРАВИЛА:
1. Извлекай ТОЛЬКО то, что врач упомянул. Не додумывай.
2. Если врач не упомянул какой-то пункт, ставь null.
3. Отвечай на том же языке, на котором говорит врач (таджикский, русский, английский).
4. Возвращай ТОЛЬКО JSON, без markdown и пояснений.

Формат ответа:
{
  "complaints": "жалобы пациента или null",
  "diagnosis": "диагноз или null",
  "treatment": "назначенное лечение или null",
  "follow_up": "дата или условия повторного приёма или null"
}`;

export async function POST(req: NextRequest) {
  const denied = await guardAi(req, "protocol", { limit: 40, roles: ["doctor"] });
  if (denied) return denied;

  try {
    const audio = (await req.formData()).get("audio");
    if (!(audio instanceof File)) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }
    if (audio.size > MAX_AUDIO_BYTES) {
      return NextResponse.json({ error: "Audio file is too large" }, { status: 413 });
    }

    // Step 1: speech → text
    const transcript = await groqTranscribe(audio);
    if (!transcript.trim()) {
      return NextResponse.json(
        { error: "Empty transcription — no speech detected", transcript: "", protocol: null },
        { status: 400 }
      );
    }

    // Step 2: text → structured protocol (the transcript is still returned if this fails)
    try {
      const reply = await groqChat(
        [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Диктовка врача:\n\n${transcript}` },
        ],
        { temperature: 0.1 }
      );
      return NextResponse.json({ transcript, protocol: parseModelJson(reply) });
    } catch (error) {
      console.error("Protocol extraction error:", error);
      return NextResponse.json({ transcript, protocol: null, error: "Failed to extract protocol data" });
    }
  } catch (error) {
    console.error("Protocol API error:", error);
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
  }
}
