import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio") as File;

    if (!audio) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    // Build FormData for Groq Whisper API
    const groqFormData = new FormData();
    groqFormData.append("file", audio);
    // Используем полную модель для лучшего распознавания редких языков
    groqFormData.append("model", "whisper-large-v3");
    // Явно указываем таджикский язык
    groqFormData.append("language", "tg");
    // Даем подсказку-промпт на таджикском (кириллица), чтобы модель не путала с персидским/русским
    groqFormData.append("prompt", "Салом, ин матн бо забони тоҷикӣ аст. Духтур, бемор, беморхона, табобат, сардард.");
    groqFormData.append("response_format", "json");

    const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: groqFormData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Groq Whisper API error:", errorData);
      return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
    }

    const data = await response.json();

    return NextResponse.json({ text: data.text || "" });
  } catch (error) {
    console.error("Transcribe API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
