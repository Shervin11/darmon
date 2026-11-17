// Server-only helpers for the Groq API (used by the app/api routes)
const GROQ_URL = "https://api.groq.com/openai/v1";
const CHAT_MODEL = "openai/gpt-oss-20b";

const authHeader = () => ({ Authorization: `Bearer ${process.env.GROQ_API_KEY}` });

/** Chat completion; returns the assistant text or throws. */
export async function groqChat(
  messages: { role: string; content: unknown }[],
  { temperature = 0.7, maxTokens = 1024 } = {}
): Promise<string> {
  const res = await fetch(`${GROQ_URL}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ model: CHAT_MODEL, messages, temperature, max_tokens: maxTokens }),
  });
  if (!res.ok) throw new Error(`Groq chat error: ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

/** Whisper transcription tuned for Tajik speech; returns the text or throws. */
export async function groqTranscribe(audio: File): Promise<string> {
  const form = new FormData();
  form.append("file", audio);
  form.append("model", "whisper-large-v3");
  // Explicit language + a Tajik (Cyrillic) prompt keep Whisper from drifting to Persian/Russian
  form.append("language", "tg");
  form.append("prompt", "Салом, ин матн бо забони тоҷикӣ аст. Духтур, бемор, беморхона, табобат, сардард.");
  form.append("response_format", "json");

  const res = await fetch(`${GROQ_URL}/audio/transcriptions`, { method: "POST", headers: authHeader(), body: form });
  if (!res.ok) throw new Error(`Groq transcription error: ${await res.text()}`);
  const data = await res.json();
  return data.text || "";
}

/** Parses JSON from a model reply, tolerating ```json fences. Returns null if invalid. */
export function parseModelJson<T>(text: string): T | null {
  try {
    return JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
  } catch {
    return null;
  }
}
