"use client";
import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, Mic, Volume2, Loader2, Trash2, Square } from "lucide-react";
import useStore from "@/store/store";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const AICompanion = () => {
  const { userById, loginMe } = useStore((s) => s);
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
    loginMe();
  }, []);

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
      const assistantText = data.message || "Хатогӣ рӯй дод.";
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

  return (
    <div className="pt-20 min-h-[calc(100vh-80px)] h-screen flex flex-col bg-md-surface/30">
      {/* Background gradients */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-md-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] bg-teal-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto w-full px-4 py-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-md-primary to-teal-400 flex items-center justify-center shadow-lg shadow-md-primary/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-headline font-bold text-xl text-md-on-surface">AI-ёвар DARMON</h1>
            <p className="text-xs text-md-on-surface-variant/80 font-medium tracking-wide uppercase">Интеллектуальный помощник</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={clearChat} className="text-md-on-surface-variant hover:text-red-500 p-2.5 rounded-xl bg-white dark:bg-md-surface-container-low shadow-sm border border-md-outline/5 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-500/20 transition-all cursor-pointer group" title="Очистить чат">
            <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 w-full max-w-4xl mx-auto scrollbar-thin">
        <div className="space-y-5">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-md-on-surface-variant">
              <div className="w-20 h-20 rounded-2xl bg-md-primary/10 flex items-center justify-center animate-ai-pulse">
                <Bot className="w-10 h-10 text-md-primary" />
              </div>
              <h2 className="font-headline font-bold text-xl text-md-on-surface">Салом! Ман ёвари тиббии DARMON ҳастам</h2>
              <p className="text-sm text-center max-w-md">
                Ман метавонам дар бораи аломатҳо, бемориҳо ва пайдо кардани духтур ёрӣ расонам. Саволатонро пурсед!
              </p>
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {["Сардард дорам 🤕", "Кадом духтур лозим? 🏥", "Сулфаи сахт 🤧"].map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="px-4 py-2 rounded-full bg-md-surface-container-low border border-md-outline/10 text-sm text-md-on-surface hover:bg-md-primary/5 hover:border-md-primary/20 transition-all cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "assistant" && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-md-primary to-teal-400 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-[85%] relative group ${
                m.role === "user"
                  ? "bg-md-primary text-white rounded-[24px] rounded-br-[8px] px-5 py-3.5 shadow-md shadow-md-primary/20"
                  : "bg-white dark:bg-md-surface-container-highest border border-md-outline/10 rounded-[24px] rounded-tl-[8px] px-5 py-3.5 shadow-sm"
              }`}>
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-medium">{m.content}</p>
                {m.role === "assistant" && (
                  <button
                    onClick={() => handleSpeak(m.content, i)}
                    disabled={speakingId !== null}
                    className="absolute -bottom-3 right-2 opacity-0 group-hover:opacity-100 bg-white dark:bg-md-surface-container-high border border-md-outline/10 rounded-full p-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-30"
                    title="Озвучить"
                  >
                    {speakingId === i ? <Loader2 className="w-3 h-3 animate-spin text-md-primary" /> : <Volume2 className="w-3 h-3 text-md-primary" />}
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-md-primary to-teal-400 flex items-center justify-center shrink-0 shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white dark:bg-md-surface-container-highest border border-md-outline/10 rounded-2xl rounded-tl-md px-5 py-4 shadow-sm">
                <div className="flex gap-2 items-center h-full">
                  <div className="w-2.5 h-2.5 rounded-full bg-md-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2.5 h-2.5 rounded-full bg-md-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2.5 h-2.5 rounded-full bg-md-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} className="h-4" />
        </div>
      </div>

      {/* Input Area */}
      <div className="shrink-0 w-full px-4 pb-6 pt-2 bg-gradient-to-t from-md-surface via-md-surface to-transparent">
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
          className="max-w-4xl mx-auto flex gap-3 items-end bg-white dark:bg-md-surface-container-low p-2 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-md-outline/10"
        >
          {/* Voice button */}
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isTranscribing || loading}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
              isRecording
                ? "bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse"
                : isTranscribing
                ? "bg-md-outline/10 text-md-outline"
                : "bg-md-surface-container text-md-on-surface-variant hover:text-md-primary hover:bg-md-primary/10"
            }`}
            title={isRecording ? "Остановить" : "Голосовой ввод"}
          >
            {isTranscribing ? <Loader2 className="w-5 h-5 animate-spin" /> : isRecording ? <Square className="w-5 h-5" fill="currentColor" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Саволи худро нависед..."
            disabled={loading || isRecording}
            className="flex-1 bg-transparent px-4 py-3.5 text-base text-md-on-surface placeholder:text-md-outline outline-none disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-md-primary to-teal-500 text-white flex items-center justify-center hover:shadow-lg hover:shadow-md-primary/30 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AICompanion;
