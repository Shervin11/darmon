"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, User, Mic, Trash2, Edit3, Smile, X, Check, Play, Pause, MoreVertical } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const API = process.env.NEXT_PUBLIC_BASE_URL;

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
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(`${API}/messages?userId1=${currentUserId}&userId2=${partnerId}`);
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
      axios.post(`${API}/messages/mark-read`, {
        userId: currentUserId,
        partnerId: partnerId
      }).catch(console.error);
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!text.trim() && !isRecording) || sending) return;

    setSending(true);
    try {
      if (editingId) {
        await axios.patch(`${API}/messages/${editingId}`, { text: text.trim() });
        setEditingId(null);
      } else {
        await axios.post(`${API}/messages`, {
          senderId: currentUserId,
          receiverId: partnerId,
          text: text.trim(),
        });
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
      await axios.delete(`${API}/messages/${id}`);
      await fetchMessages();
    } catch (e) { console.error(e); }
  };

  const handleEdit = (msg: Message) => {
    setEditingId(msg.id);
    setText(msg.text);
    setShowEmoji(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64 = reader.result as string;
          try {
            await axios.post(`${API}/messages`, {
              senderId: currentUserId,
              receiverId: partnerId,
              text: "[Voice Message]",
              audioUrl: base64,
            });
            await fetchMessages();
          } catch (e) { console.error(e); }
        };
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingDuration(0);
      timerRef.current = setInterval(() => setRecordingDuration(d => d + 1), 1000);
    } catch (e) { console.error(e); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const emojis = ["😊", "😂", "🥰", "👍", "🙏", "❤️", "👨‍⚕️", "💊", "🏥", "🦷", "🩺", "🩹", "👋", "😭", "🤔"];

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });
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
            <p className="text-xs text-md-on-surface-variant capitalize">{partnerRole === "doctor" ? "Духтур" : "Бемор"}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-md-surface-container-low/20 scrollbar-thin">
        {messages.map((m) => {
          const isMe = m.senderId == currentUserId;
          return (
            <div key={m.id} className={`flex group ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`relative max-w-[80%] flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`px-4 py-3 rounded-[22px] text-[15px] leading-relaxed shadow-sm transition-all ${
                  isMe
                    ? "bg-md-primary text-white rounded-br-[4px] shadow-md-primary/10"
                    : "bg-white dark:bg-md-surface-container-highest text-md-on-surface rounded-bl-[4px] border border-md-outline/5"
                }`}>
                  {m.audioUrl ? (
                    <div className="flex items-center gap-3 min-w-[150px] py-1">
                      <button className={`w-8 h-8 rounded-full flex items-center justify-center ${isMe ? "bg-white/20" : "bg-md-primary/10"}`}>
                        <Play className={`w-4 h-4 ${isMe ? "text-white" : "text-md-primary"}`} fill="currentColor" />
                      </button>
                      <div className={`h-1.5 flex-1 rounded-full ${isMe ? "bg-white/20" : "bg-md-outline/20"}`}>
                        <div className={`h-full w-1/3 rounded-full ${isMe ? "bg-white" : "bg-md-primary"}`} />
                      </div>
                      <span className="text-[10px] opacity-70 font-mono">0:12</span>
                    </div>
                  ) : (
                    <p>{m.text}</p>
                  )}
                  <div className={`flex items-center justify-end gap-1.5 mt-1 text-[10px] font-medium ${isMe ? "text-white/70" : "text-md-on-surface-variant/70"}`}>
                    {m.isEdited && <span>{t("chat.edited")}</span>}
                    <span>{formatTime(m.timestamp)}</span>
                  </div>
                </div>

                {/* Message Actions */}
                {isMe && (
                  <div className="opacity-0 group-hover:opacity-100 flex flex-col gap-1 transition-all">
                    {!m.audioUrl && (
                      <button onClick={() => handleEdit(m)} className="p-1.5 rounded-full hover:bg-md-primary/10 text-md-on-surface-variant transition-all cursor-pointer">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button onClick={() => handleDelete(m.id)} className="p-1.5 rounded-full hover:bg-red-500/10 text-red-500 transition-all cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-md-outline/10 bg-white dark:bg-md-surface-container-lowest shrink-0">
        
        {/* Emoji Picker */}
        {showEmoji && (
          <div className="absolute bottom-24 left-4 right-4 bg-white dark:bg-md-surface-container rounded-3xl shadow-xl border border-md-outline/10 p-4 grid grid-cols-8 gap-2 z-20 animate-in slide-in-from-bottom-4">
            {emojis.map(e => (
              <button 
                key={e} 
                onClick={() => setText(prev => prev + e)} 
                className="text-2xl hover:scale-125 transition-all p-2 cursor-pointer"
              >
                {e}
              </button>
            ))}
          </div>
        )}

        {/* Editing indicator */}
        {editingId && (
          <div className="flex items-center justify-between px-4 py-2 bg-md-primary/5 rounded-t-2xl border-x border-t border-md-primary/10 text-xs text-md-primary font-bold">
            <span className="flex items-center gap-2"><Edit3 className="w-3.5 h-3.5" /> {t("chat.edit")}</span>
            <button onClick={() => { setEditingId(null); setText(""); }} className="cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSend} className="flex gap-2 items-center">
          <div className="flex-1 flex items-center bg-md-surface-container-low rounded-[28px] px-2 py-1.5 border border-md-outline/10 focus-within:border-md-primary/30 focus-within:ring-2 focus-within:ring-md-primary/5 transition-all">
            <button
              type="button"
              onClick={() => setShowEmoji(!showEmoji)}
              className={`p-2.5 rounded-full hover:bg-md-outline/10 transition-all cursor-pointer ${showEmoji ? "text-md-primary" : "text-md-on-surface-variant"}`}
            >
              <Smile className="w-5 h-5" />
            </button>

            {isRecording ? (
              <div className="flex-1 px-4 flex items-center justify-between text-red-500 font-bold animate-pulse">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /> {recordingDuration}s</span>
                <button type="button" onClick={stopRecording} className="text-xs uppercase tracking-widest">{t("chat.releaseToSend")}</button>
              </div>
            ) : (
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Паём нависед..."
                className="flex-1 bg-transparent px-3 py-2 text-[15px] text-md-on-surface placeholder:text-md-on-surface-variant/40 outline-none"
              />
            )}
          </div>

          {!text.trim() && !editingId ? (
            <button
              type="button"
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isRecording ? "bg-red-500 scale-125 shadow-lg shadow-red-500/20" : "bg-md-primary/10 text-md-primary hover:bg-md-primary/20"
              }`}
            >
              <Mic className={`w-5 h-5 ${isRecording ? "text-white" : ""}`} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={sending}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-md-primary to-teal-500 text-white flex items-center justify-center hover:shadow-lg hover:shadow-md-primary/20 active:scale-95 transition-all cursor-pointer disabled:opacity-40 shrink-0"
            >
              {editingId ? <Check className="w-5 h-5" /> : <Send className="w-5 h-5 ml-0.5" />}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatWidget;
