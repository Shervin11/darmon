"use client";
import React, { useEffect, useRef, useState } from "react";
import { BellRing, CheckCircle2, Loader2, Send } from "lucide-react";
import toast from "react-hot-toast";
import useStore from "@/store/store";
import axios from "axios";
import { api, apiError } from "@/lib/api";
import { useTranslation } from "@/lib/i18n";

const POLL_EVERY_MS = 3000;
const POLL_FOR_MS = 2 * 60 * 1000;

/**
 * Connects the account to the DARMON Telegram bot for booking notifications and reminders.
 * `compact` is the short sidebar version (shown only while not connected).
 */
export default function TelegramConnect({ compact = false }: { compact?: boolean }) {
  const { userById, loginMe } = useStore((s) => s);
  const { t } = useTranslation();
  const [waiting, setWaiting] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const linked = !!userById.telegramLinked;

  const stopPolling = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = null;
    setWaiting(false);
  };
  useEffect(() => stopPolling, []);

  // The bot confirms the link on its side; refresh the profile until it shows up
  useEffect(() => {
    if (waiting && linked) {
      stopPolling();
      toast.success(t("telegram.connected"));
    }
  }, [waiting, linked]);

  const connect = async () => {
    // Open the tab synchronously so the popup blocker allows it, then point it at the bot
    const tab = window.open("", "_blank");
    try {
      const { data } = await api.post<{ url: string }>("/users/me/telegram");
      if (tab) tab.location.href = data.url;
      else window.location.href = data.url;
      setWaiting(true);
      const startedAt = Date.now();
      pollRef.current = setInterval(() => {
        if (Date.now() - startedAt > POLL_FOR_MS) stopPolling();
        else loginMe();
      }, POLL_EVERY_MS);
    } catch (error) {
      tab?.close();
      const notConfigured = axios.isAxiosError(error) && error.response?.status === 503;
      toast.error(notConfigured ? t("telegram.unavailable") : apiError(error, t("common.error")));
    }
  };

  const disconnect = async () => {
    try {
      const { data } = await api.delete("/users/me/telegram");
      useStore.setState({ userById: data });
      toast.success(t("telegram.disconnected"));
    } catch (error) {
      toast.error(apiError(error, t("common.error")));
    }
  };

  const connectButton = (
    <button
      type="button"
      onClick={connect}
      disabled={waiting}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#229ED9] px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:brightness-110 active:scale-95 disabled:opacity-70 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#229ED9]"
    >
      {waiting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
      {waiting ? t("telegram.waiting") : t("telegram.connect")}
    </button>
  );

  if (compact) {
    if (linked) return null;
    return (
      <div className="rounded-[2rem] bg-md-surface-container-lowest clinical-shadow p-6 space-y-3">
        <div className="h-11 w-11 rounded-full bg-[#229ED9]/15 text-[#229ED9] flex items-center justify-center">
          <BellRing className="w-5 h-5" />
        </div>
        <h4 className="font-headline font-bold text-md-on-surface text-lg">{t("telegram.title")}</h4>
        <p className="text-md-on-surface-variant text-sm leading-relaxed">{t("telegram.hint")}</p>
        <div className="[&>button]:w-full">{connectButton}</div>
      </div>
    );
  }

  return (
    <section className="bg-md-surface-container-lowest rounded-[2rem] clinical-shadow p-6 md:p-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3 max-w-xl">
          <span className="h-10 w-10 shrink-0 rounded-full bg-[#229ED9]/15 text-[#229ED9] flex items-center justify-center">
            <BellRing className="w-5 h-5" />
          </span>
          <div className="space-y-1.5">
            <h3 className="font-headline font-bold text-xl md:text-2xl tracking-tight text-md-on-surface">{t("telegram.title")}</h3>
            <p className="text-sm text-md-on-surface-variant leading-relaxed">{t("telegram.hint")}</p>
          </div>
        </div>
        {linked ? (
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3.5 py-1.5 text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4" /> {t("telegram.connectedBadge")}
            </span>
            <button
              type="button"
              onClick={disconnect}
              className="text-sm font-semibold text-md-error hover:underline cursor-pointer"
            >
              {t("telegram.disconnect")}
            </button>
          </div>
        ) : (
          connectButton
        )}
      </div>
    </section>
  );
}
