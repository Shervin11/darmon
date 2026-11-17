"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useEscape } from "@/lib/useEscape";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AiChat = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEscape(isOpen, () => setIsOpen(false));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();
      if (res.status === 429) {
        setMessages([...updatedMessages, { role: "assistant", content: t("ai.limit") }]);
      } else if (data.message) {
        setMessages([...updatedMessages, { role: "assistant", content: data.message }]);
      } else {
        setMessages([...updatedMessages, { role: "assistant", content: t("ai.error") }]);
      }
    } catch {
      setMessages([...updatedMessages, { role: "assistant", content: t("ai.error") }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-md-primary/25 transition-all duration-300 cursor-pointer active:scale-90 ${
          isOpen
            ? "bg-red-500 hover:bg-red-600 text-white rotate-90"
            : "bg-md-primary text-white hover:bg-md-primary/90"
        }`}
        aria-label="AI Chat"
        id="ai-chat-toggle"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Bot className="w-6 h-6 transition-transform group-hover:scale-110" />
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed z-[59] transition-all duration-300 ease-out ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        } bottom-24 right-6 w-[380px] max-w-[calc(100vw-3rem)] h-[540px] max-h-[calc(100vh-8rem)] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col bg-md-surface-container-lowest border border-md-outline/10`}
      >
        {/* Header */}
        <div className="bg-md-banner p-4 px-6 flex items-center gap-3 shrink-0 text-white">
          <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-headline font-bold text-base truncate">{t("ai.title")}</h3>
            <p className="text-md-on-banner-muted text-xs truncate">{t("ai.subtitle")}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-md-surface-container-low/40">
          {messages.length === 0 && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-md-primary/10 text-md-primary flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-md-surface-container-lowest border border-md-outline/10 rounded-2xl rounded-tl-sm p-3.5 shadow-sm text-sm text-md-on-surface leading-relaxed">
                  {t("ai.greeting")}
                </div>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" ? (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-md-primary/10 text-md-primary flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-md-surface-container-lowest border border-md-outline/10 rounded-2xl rounded-tl-sm p-3.5 shadow-sm text-sm text-md-on-surface leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div className="max-w-[85%]">
                  <div className="bg-md-primary text-white rounded-2xl rounded-tr-sm p-3.5 shadow-md shadow-md-primary/20 text-sm leading-relaxed">
                    {msg.content}
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-md-primary/10 text-md-primary flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-md-surface-container-lowest border border-md-outline/10 rounded-2xl rounded-tl-sm p-3.5 shadow-sm">
                  <div className="flex gap-1.5 items-center">
                    <div className="w-2 h-2 bg-md-primary rounded-full animate-bounce [animation-delay:0ms]" />
                    <div className="w-2 h-2 bg-md-primary rounded-full animate-bounce [animation-delay:150ms]" />
                    <div className="w-2 h-2 bg-md-primary rounded-full animate-bounce [animation-delay:300ms]" />
                    <span className="text-xs text-md-on-surface-variant ml-2">{t("ai.thinking")}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="p-3 border-t border-md-outline/10 bg-md-surface-container-lowest shrink-0">
          <div className="flex gap-2 items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("ai.placeholder")}
              className="flex-1 bg-md-surface-container-low text-md-on-surface rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-md-primary/20 focus:border-md-primary/50 placeholder:text-md-outline transition-all"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-md-primary text-white flex items-center justify-center shadow-md shadow-md-primary/20 hover:bg-md-primary/90 transition-all disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer active:scale-90"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AiChat;