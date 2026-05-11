import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio") as File;

    if (!audio) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    // ── Step 1: Transcribe with Whisper ──
    const whisperFormData = new FormData();
    whisperFormData.append("file", audio);
    whisperFormData.append("model", "whisper-large-v3");
    whisperFormData.append("language", "tg");
    whisperFormData.append("prompt", "Салом, ин матн бо забони тоҷикӣ аст. Духтур, бемор, беморхона, табобат, сардард.");
    whisperFormData.append("response_format", "json");

    const whisperResponse = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: whisperFormData,
    });

    if (!whisperResponse.ok) {
      const errorData = await whisperResponse.text();
      console.error("Whisper error:", errorData);
      return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
    }

    const whisperData = await whisperResponse.json();
    const transcribedText = whisperData.text || "";

    if (!transcribedText.trim()) {
      return NextResponse.json({
        error: "Empty transcription — no speech detected",
        transcript: "",
        protocol: null,
      }, { status: 400 });
    }

    // ── Step 2: Extract structured data with LLM ──
    const systemPrompt = `Ты — медицинский секретарь платформы DARMON. Твоя задача — прослушать диктовку врача и извлечь данные в строгий JSON-формат.

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

    const llmResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Диктовка врача:\n\n${transcribedText}` },
        ],
        temperature: 0.1,
        max_tokens: 1024,
      }),
    });

    if (!llmResponse.ok) {
      const errorData = await llmResponse.text();
      console.error("LLM error:", errorData);
      // Return transcript even if LLM fails
      return NextResponse.json({
        transcript: transcribedText,
        protocol: null,
        error: "Failed to extract protocol data",
      });
    }

    const llmData = await llmResponse.json();
    const llmMessage = llmData.choices?.[0]?.message?.content || "{}";

    let protocol;
    try {
      const cleanJson = llmMessage.replace(/```json/g, "").replace(/```/g, "").trim();
      protocol = JSON.parse(cleanJson);
    } catch {
      console.error("Failed to parse protocol JSON:", llmMessage);
      protocol = null;
    }

    return NextResponse.json({
      transcript: transcribedText,
      protocol,
    });
  } catch (error) {
    console.error("Protocol API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
