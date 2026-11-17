"use client";
import Link from "next/link";

import React, { useState } from "react";
import Image from "next/image";
import { Stethoscope, Heart, Shield, LogIn } from "lucide-react";
import useStore from "@/store/store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useTranslation } from "@/lib/i18n";
import { ROLE_HOME } from "@/lib/roles";
import { ECG_WIDE, delay } from "@/lib/ui";

export default function Login() {
  const [emailLogin, setEmailLogin] = useState("");
  const [passLogin, setPassLogin] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const { loginUser } = useStore((state) => state);

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Email or phone number; the backend normalizes both
    const user = {
      login: emailLogin.trim(),
      password: passLogin.trim(),
    };
    if (!emailLogin || !passLogin) {
      toast.error(t("auth.error.fillData"));
      return;
    }

    setLoading(true);
    const result = await loginUser(user);
    setLoading(false);

    if (result.success) {
      router.push(ROLE_HOME[result.role || "client"] || "/doctors");
      setPassLogin("");
      setEmailLogin("");
    } else {
      toast.error(t("auth.error.wrongCredentials"));
    }
  }

  return (
    <div className="min-h-screen w-full flex overflow-hidden">

      {/* Left - Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 sm:px-16 xl:px-24 py-12 bg-md-surface-container-lowest">
        <div className="max-w-sm mx-auto w-full">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-md-primary flex items-center justify-center text-white shadow-md shadow-md-primary/20">
              <Stethoscope className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black tracking-tight text-md-primary font-headline">
              DARMON
            </span>
          </div>

          <h1 className="text-3xl font-black text-md-on-surface mb-2 tracking-tight font-headline">
            {t("auth.welcome")}
          </h1>
          <p className="text-md-on-surface-variant mb-8 text-sm leading-relaxed">
            {t("auth.loginDesc")}
          </p>

          <form onSubmit={login} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email-login" className="text-sm font-semibold text-md-on-surface-variant">
                {t("auth.emailOrPhone")} *
              </label>
              <input
                id="email-login"
                type="text"
                autoComplete="username"
                value={emailLogin}
                onChange={(e) => setEmailLogin(e.target.value)}
                placeholder="example@mail.com / 93 123 45 67"
                className="w-full border border-md-outline-variant/30 text-md-on-surface px-4 h-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-md-primary/20 focus:border-md-primary/50 placeholder-md-outline transition-all bg-md-surface-container-low"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="pass-login" className="text-sm font-semibold text-md-on-surface-variant">
                {t("auth.password")} *
              </label>
              <input
                id="pass-login"
                type="password"
                value={passLogin}
                onChange={(e) => setPassLogin(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full border border-md-outline-variant/30 text-md-on-surface px-4 h-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-md-primary/20 focus:border-md-primary/50 placeholder-md-outline transition-all bg-md-surface-container-low"
              />
              <Link href="/auth/reset" className="self-end text-sm font-semibold text-md-primary hover:underline">
                {t("auth.forgot")}
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-md-primary text-white h-12 rounded-full font-bold shadow-lg shadow-md-primary/25 hover:shadow-xl hover:shadow-md-primary/30 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-headline"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  {t("auth.login")}
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-md-on-surface-variant">
            {t("auth.noAccount")}{" "}
            <button
              onClick={() => router.push("/auth")}
              className="text-md-primary cursor-pointer font-bold hover:underline"
            >
              {t("auth.register")}
            </button>
          </p>
        </div>
      </div>

      {/* Right - Illustration */}
      <div className="hidden lg:flex w-1/2 relative bg-md-banner text-white items-center justify-center p-12 overflow-hidden">
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-10 h-28 w-full text-white/20 pointer-events-none"
        >
          <path
            d={ECG_WIDE}
            pathLength="1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className="fx-draw"
          />
        </svg>

        <div className="relative z-10 flex flex-col items-center max-w-md text-center">
          <div className="fx-rise relative w-72 h-80 rounded-t-[999px] rounded-b-[2rem] overflow-hidden shadow-2xl mb-8 border-4 border-white/20" style={delay("0.1s")}>
            <Image
              src="/login.jpg"
              alt="Medical illustration"
              fill
              priority
              sizes="18rem"
              className="object-cover"
            />
          </div>

          <h2 className="fx-rise text-3xl font-black text-white mb-3 tracking-tight font-headline" style={delay("0.3s")}>
            {t("auth.healthPriority")}
          </h2>

          <p className="fx-rise text-md-on-banner-muted leading-relaxed text-sm mb-8 max-w-xs" style={delay("0.5s")}>
            {t("auth.connectBest")}
          </p>

          <div className="fx-rise flex flex-wrap justify-center gap-3" style={delay("0.7s")}>
            {[
              { icon: <Shield className="w-4 h-4 text-md-on-banner-muted" />, label: t("auth.secure") },
              { icon: <Heart className="w-4 h-4 text-md-on-banner-muted" />, label: t("auth.trustworthy") },
              { icon: <Stethoscope className="w-4 h-4 text-md-on-banner-muted" />, label: t("auth.professional") },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-white text-xs font-bold font-headline bg-white/15 px-4 py-2 rounded-full backdrop-blur-md"
              >
                {item.icon}
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}