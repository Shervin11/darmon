"use client";
import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, Mic, Volume2, Loader2, Trash2, Square } from "lucide-react";
import useStore from "@/store/store";
import { useTranslation } from "@/lib/i18n";
import { ECG_WIDE, ECG_SHORT } from "@/lib/ui";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/* Линия пульса: та же форма, что на остальных страницах, но компактная */

const suggestions = ["Сардард дорам 🤕", "Кадом духтур лозим? 🏥", "Сулфаи сахт 🤧"];

const AICompanion = () => {
  const userById = useStore((s) => s.userById);
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (userById !== undefined) {
      const key = `darmon-ai-chat-${userById?.id || "guest"}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        setMessages(JSON.parse(saved));
      }
      setInitialized(true);
    }
  }, [userById]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  useEffect(() => {
    if (initialized) {
      const key = `darmon-ai-chat-${userById?.id || "guest"}`;
      localStorage.setItem(key, JSON.stringify(messages));
    }
  }, [messages, initialized, userById]);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const newMessages: ChatMessage[] = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const assistantText = response.status === 429 ? t("ai.limit") : data.message || "Хатогӣ рӯй дод.";
      setMessages([...newMessages, { role: "assistant", content: assistantText }]);

      // Auto-play the response
      handleSpeak(assistantText, newMessages.length);
    } catch {
      const errorMsg = "Хатогӣ дар пайвастшавӣ ба сервер.";
      setMessages([...newMessages, { role: "assistant", content: errorMsg }]);
      handleSpeak(errorMsg, newMessages.length);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = async (text: string, index: number) => {
    if (speakingId !== null) return;
    setSpeakingId(index);
    try {
      const response = await fetch("/api/audio/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) { setSpeakingId(null); return; }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => { setSpeakingId(null); URL.revokeObjectURL(url); };
      audio.play();
    } catch {
      setSpeakingId(null);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm",
      });
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setIsTranscribing(true);
        try {
          const formData = new FormData();
          formData.append("audio", blob, "voice.webm");
          const res = await fetch("/api/audio/transcribe", { method: "POST", body: formData });
          const data = await res.json();
          if (data.text) {
            sendMessage(data.text);
          }
        } catch (e) { console.error(e); }
        setIsTranscribing(false);
      };
      mediaRecorder.start(250);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch {
      alert("Нет доступа к микрофону");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
  };

  const clearChat = () => {
    setMessages([]);
    const key = `darmon-ai-chat-${userById?.id || "guest"}`;
    localStorage.removeItem(key);
  };

  if (!initialized) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-md-primary" /></div>;

  const busy = loading || isRecording || isTranscribing || speakingId !== null;
  const status = isRecording
    ? "Идёт запись…"
    : isTranscribing
    ? "Распознаю речь…"
    : loading
    ? "Думаю…"
    : speakingId !== null
    ? "Озвучиваю ответ…"
    : "Интеллектуальный помощник";

  return (
    <div className="pt-20 min-h-[calc(100vh-80px)] h-screen flex flex-col">

      {/* Header: линия пульса оживает, когда ассистент что-то делает */}
      <header className="relative shrink-0 border-b border-md-outline/10">
        <div className="max-w-3xl mx-auto w-full px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 shrink-0">
              {busy && <span className="fx-ring absolute inset-0 rounded-full bg-md-primary/40" />}
              <div className="relative h-12 w-12 rounded-full bg-md-primary flex items-center justify-center shadow-lg shadow-md-primary/25">
                <Bot className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="font-headline font-bold text-xl text-md-on-surface leading-tight">AI-ёвар DARMON</h1>
              <p className="text-sm text-md-on-surface-variant" aria-live="polite">{status}</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              aria-label="Очистить чат"
              title="Очистить чат"
              className="h-11 w-11 rounded-full flex items-center justify-center text-md-on-surface-variant hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
        <svg aria-hidden="true" viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute inset-x-0 -bottom-px h-6 w-full text-md-primary pointer-events-none">
          <path d={ECG_WIDE} fill="none" stroke="currentColor" strokeOpacity={busy ? 0.15 : 0.3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 w-full scrollbar-thin">
        <div className="max-w-3xl mx-auto py-8 space-y-6">
          {messages.length === 0 && (
            <div className="py-10 md:py-16 space-y-10">
              <div className="space-y-4 max-w-xl">
                <svg aria-hidden="true" viewBox="0 0 120 40" className="h-10 w-28 text-md-primary">
                  <path d={ECG_SHORT} pathLength="1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="fx-draw" />
                </svg>
                <h2 className="font-headline font-extrabold tracking-tight text-3xl md:text-4xl text-md-on-surface leading-tight">
                  Салом! Ман ёвари тиббии DARMON ҳастам
                </h2>
                <p className="text-md-on-surface-variant leading-relaxed">
                  Ман метавонам дар бораи аломатҳо, бемориҳо ва пайдо кардани духтур ёрӣ расонам. Саволатонро пурсед!
                </p>
              </div>

              <div className="grid gap-3 max-w-md">
                {suggestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="group text-left px-6 py-4 rounded-full bg-md-surface-container-low border border-md-outline/10 text-md-on-surface transition-all hover:border-md-primary/40 hover:bg-md-primary/5 hover:translate-x-1 active:scale-[0.98] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-md-primary"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="fx-pop flex justify-end">
                <div className="max-w-[85%] md:max-w-[75%] bg-md-primary text-white rounded-[1.75rem] rounded-br-lg px-6 py-4 shadow-md shadow-md-primary/20">
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ) : (
              <div key={i} className="fx-pop flex gap-3 items-start">
                <div className="h-9 w-9 mt-1 shrink-0 rounded-full bg-md-primary/10 text-md-primary flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="max-w-[85%] md:max-w-[75%] space-y-2">
                  <div className="bg-md-surface-container-low border border-md-outline/10 rounded-[1.75rem] rounded-tl-lg px-6 py-4">
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap text-md-on-surface">{m.content}</p>
                  </div>
                  <button
                    onClick={() => handleSpeak(m.content, i)}
                    disabled={speakingId !== null}
                    aria-label="Озвучить"
                    title="Озвучить"
                    className="ml-2 h-8 px-3 rounded-full flex items-center gap-2 text-xs text-md-on-surface-variant hover:text-md-primary hover:bg-md-primary/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {speakingId === i ? (
                      <span className="flex items-end gap-0.5 h-3.5" aria-hidden="true">
                        {[0, 0.15, 0.3, 0.1].map((d, k) => (
                          <span key={k} className="fx-bar w-0.5 h-full rounded-full bg-md-primary" style={{ animationDelay: `${d}s` }} />
                        ))}
                      </span>
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                    Озвучить
                  </button>
                </div>
              </div>
            )
          )}

          {loading && (
            <div className="fx-pop flex gap-3 items-start">
              <div className="h-9 w-9 mt-1 shrink-0 rounded-full bg-md-primary/10 text-md-primary flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-md-surface-container-low border border-md-outline/10 rounded-[1.75rem] rounded-tl-lg px-6 py-4" role="status" aria-label="Ассистент отвечает">
                <svg aria-hidden="true" viewBox="0 0 120 40" className="h-8 w-20 text-md-primary">
                  <path d={ECG_SHORT} pathLength="1" fill="none" stroke="currentColor" strokeOpacity=".2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d={ECG_SHORT} pathLength="1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="fx-run" />
                </svg>
              </div>
            </div>
          )}
          <div ref={bottomRef} className="h-4" />
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 w-full px-4 pb-6 pt-3">
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
          className="max-w-3xl mx-auto flex gap-2 items-center bg-md-surface-container-low p-2 rounded-full border border-md-outline/10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.25)] transition-colors focus-within:border-md-primary/40"
        >
          <div className="relative shrink-0">
            {isRecording && <span className="absolute inset-0 rounded-full bg-red-500/40 animate-ping" />}
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isTranscribing || loading}
              aria-label={isRecording ? "Остановить" : "Голосовой ввод"}
              title={isRecording ? "Остановить" : "Голосовой ввод"}
              className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed ${
                isRecording
                  ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                  : isTranscribing
                  ? "bg-md-outline/10 text-md-outline"
                  : "bg-md-surface-container text-md-on-surface-variant hover:text-md-primary hover:bg-md-primary/10"
              }`}
            >
              {isTranscribing ? <Loader2 className="w-5 h-5 animate-spin" /> : isRecording ? <Square className="w-4 h-4" fill="currentColor" /> : <Mic className="w-5 h-5" />}
            </button>
          </div>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Саволи худро нависед..."
            disabled={loading || isRecording}
            className="flex-1 min-w-0 bg-transparent px-3 py-3 text-base text-md-on-surface placeholder:text-md-outline outline-none disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Отправить"
            className="w-12 h-12 shrink-0 rounded-full bg-md-primary text-white flex items-center justify-center shadow-md shadow-md-primary/25 hover:shadow-lg hover:shadow-md-primary/35 active:scale-90 transition-all cursor-pointer disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AICompanion;