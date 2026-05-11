"use client";
import React, { useEffect, useState } from "react";
import useStore from "@/store/store";
import axios from "axios";
import ChatWidget from "@/components/chat/ChatWidget";
import { MessageSquare, User, Stethoscope, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const API = process.env.NEXT_PUBLIC_BASE_URL;

interface ChatPartner {
  id: number;
  fullName: string;
  image: string;
  role: string;
  specialty?: string;
  unreadCount?: number;
}

const ChatPage = () => {
  const { t } = useTranslation();
  const { loginMe, userById } = useStore((s) => s);
  const [partners, setPartners] = useState<ChatPartner[]>([]);
  const [selected, setSelected] = useState<ChatPartner | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => { loginMe(); }, []);

  const fetchPartners = async (isFirstLoad = false) => {
    if (!userById?.id) return;
    try {
      const { data } = await axios.get(`${API}/chat-partners?userId=${userById.id}`);
      let currentPartners = data;

      if (isFirstLoad) {
        const searchParams = new URLSearchParams(window.location.search);
        const pId = searchParams.get("partnerId");

        if (pId) {
          const partnerIdNum = Number(pId);
          const exists = currentPartners.find((p: ChatPartner) => p.id === partnerIdNum);
          
          if (!exists) {
            try {
              const res = await axios.get(`${API}/users/${partnerIdNum}`);
              if (res.data) {
                currentPartners = [res.data, ...currentPartners];
              }
            } catch {}
          }
          const toSelect = currentPartners.find((p: ChatPartner) => p.id === partnerIdNum);
          if (toSelect) {
            setSelected(toSelect);
            setShowSidebar(false);
          }
        }
      }

      setPartners(currentPartners);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPartners(true);
    const interval = setInterval(() => fetchPartners(), 5000);
    return () => clearInterval(interval);
  }, [userById]);

  // Mark as read when selected partner changes
  useEffect(() => {
    if (selected && userById?.id) {
      axios.post(`${API}/messages/mark-read`, {
        userId: Number(userById.id),
        partnerId: selected.id
      }).then(() => {
        setPartners(prev => prev.map(p => 
          p.id === selected.id ? { ...p, unreadCount: 0 } : p
        ));
      }).catch(console.error);
    }
  }, [selected, userById]);

  const handleSelectPartner = (p: ChatPartner) => {
    setSelected(p);
    setShowSidebar(false); // Hide sidebar on mobile
  };

  const handleBackToList = () => {
    setShowSidebar(true);
    setSelected(null);
  };

  return (
    <div className="pt-20 pb-0 min-h-screen flex flex-col">
      {/* Header */}
      <div className="max-w-7xl mx-auto w-full px-6 py-4">
        <h1 className="font-headline font-bold text-2xl text-md-on-surface flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-md-primary" /> {t("chat.title")}
        </h1>
      </div>

      {/* Chat layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-6">
        <div className="flex h-[calc(100vh-160px)] rounded-3xl overflow-hidden border border-md-outline/10 bg-white dark:bg-md-surface-container-low shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
          
          {/* Sidebar - hidden on mobile when chat is open */}
          <div className={`${showSidebar ? 'flex' : 'hidden'} md:flex w-full md:w-80 border-r border-md-outline/10 flex-col shrink-0`}>
            <div className="px-4 py-3 border-b border-md-outline/10">
              <p className="text-xs font-bold text-md-on-surface-variant uppercase tracking-wider">{t("chat.conversations")}</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {partners.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-md-on-surface-variant gap-2 px-4">
                  <MessageSquare className="w-8 h-8 opacity-20" />
                  <p className="text-xs text-center">{t("chat.noConversations")}</p>
                </div>
              )}
              {partners.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPartner(p)}
                  className={`w-full text-left px-5 py-4 flex items-center gap-4 transition-all cursor-pointer border-b border-md-outline/5 last:border-0 hover:bg-md-primary/5 ${
                    selected?.id === p.id ? "bg-md-primary/5 border-l-4 border-l-md-primary" : "border-l-4 border-l-transparent"
                  }`}
                >
                  {p.image ? (
                    <img src={p.image} alt={p.fullName} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-md-surface-container flex items-center justify-center">
                      {p.role === "doctor" ? <Stethoscope className="w-4 h-4 text-md-primary" /> : <User className="w-4 h-4 text-md-on-surface-variant" />}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-md-on-surface truncate">{p.fullName}</p>
                    <p className="text-xs text-md-on-surface-variant truncate">{p.specialty || (p.role === "doctor" ? t("profile.doctorRole") : t("profile.patientRole"))}</p>
                  </div>
                  {(p.unreadCount && p.unreadCount > 0) ? (
                    <div className="bg-emerald-500 text-white text-[10px] font-bold h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center animate-pulse">
                      {p.unreadCount}
                    </div>
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          {/* Chat area - full width on mobile */}
          <div className={`${!showSidebar ? 'flex' : 'hidden'} md:flex flex-1 flex-col`}>
            {selected && userById?.id ? (
              <>
                {/* Mobile back button */}
                <div className="md:hidden px-4 py-2 border-b border-md-outline/10 bg-md-surface-container-lowest">
                  <button
                    onClick={handleBackToList}
                    className="flex items-center gap-2 text-md-primary text-sm font-bold cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> {t("chat.backToList")}
                  </button>
                </div>
                <ChatWidget
                  currentUserId={Number(userById.id)}
                  partnerId={selected.id}
                  partnerName={selected.fullName}
                  partnerImage={selected.image}
                  partnerRole={selected.role}
                />
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-md-on-surface-variant gap-3">
                <MessageSquare className="w-16 h-16 opacity-10" />
                <p className="text-sm">{t("chat.selectConversation")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
