"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

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
      if (data.message) {
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
      <div
        className={`fixed z-[59] transition-all duration-300 ease-out ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        } bottom-24 right-6 w-[360px] max-w-[calc(100vw-3rem)] h-[520px] max-h-[calc(100vh-8rem)] rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.3)] flex flex-col bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-700`}
      >
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#12121f]">
          {messages.length === 0 && (
            <div className="flex justify-start">
              <div className="flex gap-2 max-w-[85%]">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00BFA5] to-[#00A896] flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white dark:bg-[#252540] rounded-2xl rounded-tl-md p-3 shadow-sm text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                  {t("ai.greeting")}
                </div>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" ? (
                <div className="flex gap-2 max-w-[85%]">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00BFA5] to-[#00A896] flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white dark:bg-[#252540] rounded-2xl rounded-tl-md p-3 shadow-sm text-sm text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div className="max-w-[85%]">
                  <div className="bg-gradient-to-r from-[#00A896] to-[#00BFA5] text-white rounded-2xl rounded-tr-md p-3 shadow-sm text-sm leading-relaxed">
                    {msg.content}
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-2 max-w-[85%]">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00BFA5] to-[#00A896] flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white dark:bg-[#252540] rounded-2xl rounded-tl-md p-3 shadow-sm">
                  <div className="flex gap-1.5 items-center">
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:300ms]" />
                    <span className="text-xs text-gray-400 ml-2">{t("ai.thinking")}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

