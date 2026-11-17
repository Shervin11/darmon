"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { api } from "@/lib/api";
import { Send, User, Mic, Trash2, Edit3, Smile, X, Check, Play, Pause } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  text: string;
  audioUrl?: string;
  timestamp: string;
  isRead: boolean;
  isEdited?: boolean;
}

interface ChatWidgetProps {
  currentUserId: number;
  partnerId: number;
  partnerName: string;
  partnerImage?: string;
  partnerRole?: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ currentUserId, partnerId, partnerName, partnerImage, partnerRole }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Audio playback
  const [playingId, setPlayingId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get("/messages", { params: { partnerId } });
      setMessages(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchMessages();
    intervalRef.current = setInterval(fetchMessages, 3000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [currentUserId, partnerId]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
    const hasUnread = messages.some(m => m.senderId === partnerId && m.receiverId === currentUserId && !m.isRead);
    if (hasUnread) {
      api.post("/messages/mark-read", { partnerId }).catch(console.error);
    }
  }, [messages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    };
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      if (editingId) {
        await api.patch(`/messages/${editingId}`, { text: text.trim() });
        setEditingId(null);
      } else {
        await api.post("/messages", { receiverId: partnerId, text: text.trim() });
      }
      setText("");
      setShowEmoji(false);
      await fetchMessages();
    } catch (e) { console.error(e); }
    setSending(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("chat.confirmDelete"))) return;
    try {
      await api.delete(`/messages/${id}`);
      await fetchMessages();
    } catch (e) { console.error(e); }
  };

  const handleEdit = (msg: Message) => {
    setEditingId(msg.id);
    setText(msg.text);
    setShowEmoji(false);
  };

  // ── Voice Recording ──
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true }
      });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus" : "audio/webm";
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
          streamRef.current = null;
        }

        if (chunksRef.current.length === 0) return;
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        if (blob.size < 1000) return; // Too short, ignore

        // Convert to base64
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64 = reader.result as string;
          try {
            await api.post("/messages", {
              receiverId: partnerId,
              text: `🎤 ${t("chat.voiceMessage")}`,
              audioUrl: base64,
            });
            await fetchMessages();
          } catch (err) { console.error(err); }
        };
      };

      mediaRecorder.start(250);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingDuration(0);
      recordTimerRef.current = setInterval(() => setRecordingDuration(d => d + 1), 1000);
    } catch (err) {
      console.error("Mic access denied:", err);
      alert("Нет доступа к микрофону / Микрофон дастрас нест");
    }
  }, [currentUserId, partnerId, t]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
  }, []);

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.ondataavailable = null;
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    chunksRef.current = [];
    setIsRecording(false);
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
  }, []);

  // ── Audio Playback ──
  const togglePlay = (msg: Message) => {
    if (!msg.audioUrl) return;
    if (playingId === msg.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(msg.audioUrl);
    audio.onended = () => setPlayingId(null);
    audio.play().catch(console.error);
    audioRef.current = audio;
    setPlayingId(msg.id);
  };

  const emojis = ["😊", "😂", "🥰", "👍", "🙏", "❤️", "👨‍⚕️", "💊", "🏥", "🩺", "👋", "🤔", "😢", "🤗", "✅"];

  const formatTime = (ts: string) => new Date(ts).toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });
  const formatDuration = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const handleClear = async () => {
    if (!confirm(t("chat.clearHistory") + "?")) return;
    try {
      await api.delete("/messages", { params: { partnerId } });
      await fetchMessages();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="flex flex-col h-full bg-md-surface-container-lowest">
      {/* Header */}
      <div className="px-5 py-4 border-b border-md-outline/10 flex items-center justify-between bg-white dark:bg-md-surface-container-lowest shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          {partnerImage ? (
            <img src={partnerImage} alt={partnerName} className="w-10 h-10 rounded-full object-cover ring-2 ring-md-primary/20" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-md-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-md-primary" />
            </div>
          )}
          <div>
            <h3 className="font-headline font-bold text-md-on-surface text-sm">{partnerName}</h3>
            <p className="text-xs text-md-on-surface-variant">{partnerRole === "doctor" ? t("profile.doctorRole") : t("profile.patientRole")}</p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="p-2.5 rounded-xl text-md-on-surface-variant hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
          title={t("chat.clearHistory")}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-3 bg-md-surface-container-low/20 scrollbar-thin">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-md-on-surface-variant gap-3 opacity-50">
            <Send className="w-10 h-10" />
            <p className="text-sm">{t("chat.selectConversation")}</p>
          </div>
        )}
        {messages.map((m) => {
          const isMe = m.senderId == currentUserId;
          return (
            <div key={m.id} className={`flex group ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`relative max-w-[80%] flex items-end gap-1.5 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`px-4 py-2.5 rounded-[20px] text-[15px] leading-relaxed shadow-sm ${
                  isMe
                    ? "bg-md-primary text-white rounded-br-[4px]"
                    : "bg-white dark:bg-md-surface-container-highest text-md-on-surface rounded-bl-[4px] border border-md-outline/5"
                }`}>
                  {m.audioUrl ? (
                    <div className="flex items-center gap-3 min-w-[160px] py-0.5">
                      <button
                        type="button"
                        onClick={() => togglePlay(m)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 cursor-pointer ${isMe ? "bg-white/20 hover:bg-white/30" : "bg-md-primary/10 hover:bg-md-primary/20"}`}
                      >
                        {playingId === m.id
                          ? <Pause className={`w-4 h-4 ${isMe ? "text-white" : "text-md-primary"}`} />
                          : <Play className={`w-4 h-4 ${isMe ? "text-white" : "text-md-primary"}`} fill="currentColor" />}
                      </button>
                      <div className="flex-1 flex flex-col gap-1">
                        <div className={`h-1 rounded-full ${isMe ? "bg-white/20" : "bg-md-outline/20"}`}>
                          <div className={`h-full rounded-full transition-all ${isMe ? "bg-white" : "bg-md-primary"} ${playingId === m.id ? "w-2/3 animate-pulse" : "w-0"}`} />
                        </div>
                        <span className={`text-[10px] font-mono ${isMe ? "text-white/60" : "text-md-on-surface-variant/60"}`}>
                          🎤 {t("chat.voiceMessage")}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  )}
                  <div className={`flex items-center justify-end gap-1 mt-0.5 text-[10px] font-medium ${isMe ? "text-white/60" : "text-md-on-surface-variant/50"}`}>
                    {m.isEdited && <span className="italic">{t("chat.edited")}</span>}
                    <span>{formatTime(m.timestamp)}</span>
                  </div>
                </div>

                {/* Actions on own messages */}
                {isMe && (
                  <div className="opacity-0 group-hover:opacity-100 flex gap-0.5 transition-all mb-1">
                    {!m.audioUrl && (
                      <button onClick={() => handleEdit(m)} className="p-1 rounded-full hover:bg-md-primary/10 text-md-on-surface-variant cursor-pointer" title={t("chat.edit")}>
                        <Edit3 className="w-3 h-3" />
                      </button>
                    )}
                    <button onClick={() => handleDelete(m.id)} className="p-1 rounded-full hover:bg-red-500/10 text-red-500 cursor-pointer" title={t("chat.delete")}>
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="px-3 py-3 border-t border-md-outline/10 bg-white dark:bg-md-surface-container-lowest shrink-0 relative">

        {/* Emoji Picker — compact */}
        {showEmoji && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-white dark:bg-md-surface-container rounded-2xl shadow-lg border border-md-outline/10 p-2 grid grid-cols-8 gap-1 z-20">
            {emojis.map(e => (
              <button key={e} onClick={() => setText(prev => prev + e)} className="text-lg hover:scale-110 transition-transform p-1 rounded-lg hover:bg-md-primary/5 cursor-pointer">
                {e}
              </button>
            ))}
          </div>
        )}

        {/* Editing indicator */}
        {editingId && (
          <div className="flex items-center justify-between px-3 py-1.5 mb-2 bg-md-primary/5 rounded-xl text-xs text-md-primary font-bold">
            <span className="flex items-center gap-1.5"><Edit3 className="w-3 h-3" /> {t("chat.edit")}</span>
            <button onClick={() => { setEditingId(null); setText(""); }} className="cursor-pointer"><X className="w-3.5 h-3.5" /></button>
          </div>
        )}

        {/* Recording UI */}
        {isRecording ? (
          <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/10 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-600 dark:text-red-400 font-mono font-bold text-sm">{formatDuration(recordingDuration)}</span>
              <span className="text-red-500/60 text-xs ml-2">{t("chat.holdToRecord")}</span>
            </div>
            <button type="button" onClick={cancelRecording} className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 cursor-pointer" title={t("chat.cancel")}>
              <X className="w-5 h-5" />
            </button>
            <button type="button" onClick={stopRecording} className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center cursor-pointer hover:bg-red-600 transition-all">
              <Send className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSend} className="flex gap-2 items-center">
            <div className="flex-1 flex items-center bg-md-surface-container-low rounded-[24px] px-1.5 py-1 border border-md-outline/10 focus-within:border-md-primary/30 transition-all">
              <button type="button" onClick={() => setShowEmoji(!showEmoji)} className={`p-2 rounded-full hover:bg-md-outline/10 cursor-pointer ${showEmoji ? "text-md-primary" : "text-md-on-surface-variant"}`}>
                <Smile className="w-5 h-5" />
              </button>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t("ai.placeholder") || "Паём нависед..."}
                className="flex-1 bg-transparent px-2 py-2 text-[15px] text-md-on-surface placeholder:text-md-on-surface-variant/40 outline-none"
              />
            </div>
            {text.trim() || editingId ? (
              <button type="submit" disabled={sending} className="w-11 h-11 rounded-full bg-gradient-to-br from-md-primary to-teal-500 text-white flex items-center justify-center hover:shadow-lg active:scale-95 transition-all cursor-pointer disabled:opacity-40 shrink-0">
                {editingId ? <Check className="w-5 h-5" /> : <Send className="w-4 h-4 ml-0.5" />}
              </button>
            ) : (
              <button type="button" onClick={startRecording} className="w-11 h-11 rounded-full bg-md-primary/10 text-md-primary hover:bg-md-primary/20 flex items-center justify-center cursor-pointer transition-all">
                <Mic className="w-5 h-5" />
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default ChatWidget;
