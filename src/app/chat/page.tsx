"use client";
import React, { useEffect, useState } from "react";
import useStore from "@/store/store";
import { api } from "@/lib/api";
import ChatWidget from "@/components/chat/ChatWidget";
import { MessageSquare, User, Stethoscope, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { ECG_WIDE, ECG_SHORT } from "@/lib/ui";

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
  const userById = useStore((s) => s.userById);
  const [partners, setPartners] = useState<ChatPartner[]>([]);
  const [selected, setSelected] = useState<ChatPartner | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);


  const fetchPartners = async (isFirstLoad = false) => {
    if (!userById?.id) return;
    try {
      const { data } = await api.get("/chat-partners");
      let currentPartners = data;

      if (isFirstLoad) {
        const searchParams = new URLSearchParams(window.location.search);
        const pId = searchParams.get("partnerId");

        if (pId) {
          const partnerIdNum = Number(pId);
          const exists = currentPartners.find((p: ChatPartner) => p.id === partnerIdNum);

          if (!exists) {
            try {
              const res = await api.get(`/users/${partnerIdNum}`);
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
  }, [userById?.id]);

  // Mark as read when selected partner changes
  useEffect(() => {
    if (selected && userById?.id) {
      api.post("/messages/mark-read", { partnerId: selected.id }).then(() => {
        setPartners(prev => prev.map(p =>
          p.id === selected.id ? { ...p, unreadCount: 0 } : p
        ));
      }).catch(console.error);
    }
  }, [selected, userById?.id]);

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
      <div className="max-w-7xl mx-auto w-full px-6 pt-4 pb-5 relative">
        <h1 className="font-headline font-extrabold tracking-tight text-3xl md:text-4xl text-md-on-surface">
          {t("chat.title")}
        </h1>
        <svg aria-hidden="true" viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute right-6 top-3 hidden md:block h-12 w-72 text-md-primary/30">
          <path d={ECG_WIDE} pathLength="1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" className="fx-draw" />
        </svg>
      </div>

      {/* Chat layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-6">
        <div className="flex h-[calc(100vh-170px)] rounded-[2rem] overflow-hidden border border-md-outline/10 bg-md-surface-container-lowest shadow-[0_8px_30px_rgb(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.25)]">

          {/* Sidebar */}
          <div className={`${showSidebar ? "flex" : "hidden"} md:flex w-full md:w-80 border-r border-md-outline/10 bg-md-surface-container-low/50 flex-col shrink-0`}>
            <div className="px-6 pt-6 pb-4 flex items-baseline justify-between">
              <h2 className="font-headline font-bold text-lg text-md-on-surface">{t("chat.conversations")}</h2>
              {partners.length > 0 && <span className="text-sm text-md-on-surface-variant tabular-nums">{partners.length}</span>}
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
              {partners.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-md-on-surface-variant gap-3 px-4">
                  <div className="h-14 w-14 rounded-full bg-md-primary/10 text-md-primary flex items-center justify-center">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-center leading-relaxed">{t("chat.noConversations")}</p>
                </div>
              )}
              {partners.map((p) => {
                const active = selected?.id === p.id;
                const unread = p.unreadCount && p.unreadCount > 0 ? p.unreadCount : 0;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPartner(p)}
                    aria-current={active ? "true" : undefined}
                    className={`w-full text-left px-3 py-3 rounded-2xl flex items-center gap-3 transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-md-primary ${
                      active ? "bg-md-primary text-white shadow-md shadow-md-primary/20" : "hover:bg-md-primary/5"
                    }`}
                  >
                    {p.image ? (
                      <img src={p.image} alt={p.fullName} className="w-11 h-11 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center ${active ? "bg-white/20" : "bg-md-surface-container"}`}>
                        {p.role === "doctor"
                          ? <Stethoscope className={`w-4 h-4 ${active ? "text-white" : "text-md-primary"}`} />
                          : <User className={`w-4 h-4 ${active ? "text-white" : "text-md-on-surface-variant"}`} />}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm truncate ${active ? "text-white" : "text-md-on-surface"}`}>{p.fullName}</p>
                      <p className={`text-xs truncate ${active ? "text-white/80" : "text-md-on-surface-variant"}`}>
                        {p.specialty || (p.role === "doctor" ? t("profile.doctorRole") : t("profile.patientRole"))}
                      </p>
                    </div>
                    {unread > 0 && (
                      <span
                        key={unread}
                        className={`fx-badge-pop text-[11px] font-bold h-6 min-w-[24px] px-1.5 rounded-full flex items-center justify-center ${
                          active ? "bg-white text-md-primary" : "bg-md-primary text-white"
                        }`}
                        aria-label={`${unread}`}
                      >
                        {unread}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat area */}
          <div className={`${!showSidebar ? "flex" : "hidden"} md:flex flex-1 min-w-0 flex-col`}>
            {selected && userById?.id ? (
              <>
                {/* Mobile back button */}
                <div className="md:hidden px-4 py-3 border-b border-md-outline/10 bg-md-surface-container-lowest">
                  <button
                    onClick={handleBackToList}
                    className="inline-flex items-center gap-2 rounded-full bg-md-primary/10 px-4 py-2 text-md-primary text-sm font-bold cursor-pointer"
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
              <div className="flex-1 flex flex-col items-center justify-center text-md-on-surface-variant gap-4 px-6 text-center">
                <svg aria-hidden="true" viewBox="0 0 120 40" className="h-12 w-32 text-md-primary/50">
                  <path d={ECG_SHORT} pathLength="1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="fx-draw" />
                </svg>
                <p className="text-base max-w-xs leading-relaxed">{t("chat.selectConversation")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;