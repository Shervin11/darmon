"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { KeyRound, Stethoscope } from "lucide-react";
import { api, apiError } from "@/lib/api";
import { useTranslation } from "@/lib/i18n";

const inputCls =
  "w-full border border-md-outline-variant/30 text-md-on-surface px-4 h-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-md-primary/20 focus:border-md-primary/50 placeholder-md-outline transition-all bg-md-surface-container-low";
const labelCls = "text-sm font-semibold text-md-on-surface-variant";

/** Two steps: request a 6-digit code (Telegram or SMS), then set a new password with it. */
export default function ResetPassword() {
  const { t } = useTranslation();
  const router = useRouter();
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [login, setLogin] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const request = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!login.trim()) return;
    setLoading(true);
    try {
      await api.post("/auth/reset/request", { login: login.trim() });
      setStep("confirm");
      toast.success(t("reset.sent"));
    } catch (err) {
      toast.error(apiError(err, t("common.error")));
    } finally {
      setLoading(false);
    }
  };

  const confirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error(t("auth.error.shortPassword"));
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/reset/confirm", { login: login.trim(), code: code.trim(), password });
      toast.success(t("reset.done"));
      router.push("/auth/login");
    } catch {
      toast.error(t("reset.invalidCode"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16 bg-md-surface-container-lowest">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-2xl bg-md-primary flex items-center justify-center text-white shadow-md shadow-md-primary/20">
            <Stethoscope className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black tracking-tight text-md-primary font-headline">DARMON</span>
        </div>
        <h1 className="text-3xl font-black text-md-on-surface mb-2 tracking-tight font-headline">{t("reset.title")}</h1>
        <p className="text-md-on-surface-variant mb-8 text-sm leading-relaxed">
          {step === "request" ? t("reset.desc") : t("reset.codeDesc")}
        </p>

        {step === "request" ? (
          <form onSubmit={request} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reset-login" className={labelCls}>{t("auth.emailOrPhone")}</label>
              <input id="reset-login" autoComplete="username" value={login} onChange={(e) => setLogin(e.target.value)} className={inputCls} required />
            </div>
            <SubmitButton loading={loading} label={t("reset.sendCode")} />
          </form>
        ) : (
          <form onSubmit={confirm} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reset-code" className={labelCls}>{t("reset.code")}</label>
              <input
                id="reset-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className={`${inputCls} tracking-[0.5em] text-center font-bold tabular-nums`}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reset-pass" className={labelCls}>{t("reset.newPassword")}</label>
              <input id="reset-pass" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} required />
            </div>
            <SubmitButton loading={loading} label={t("doctor.save")} />
            <button type="button" onClick={() => setStep("request")} className="text-sm font-semibold text-md-primary hover:underline cursor-pointer">
              {t("reset.again")}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-md-on-surface-variant">
          <Link href="/auth/login" className="font-semibold text-md-primary hover:underline">{t("auth.login")}</Link>
        </p>
      </div>
    </div>
  );
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-md-primary text-white h-12 rounded-full font-bold shadow-lg shadow-md-primary/25 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 cursor-pointer font-headline"
    >
      {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <><KeyRound className="w-4 h-4" />{label}</>}
    </button>
  );
}
