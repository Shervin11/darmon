"use client";

import { useState, useEffect } from "react";
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Stethoscope, UserPlus, Heart, Shield } from "lucide-react";
import useStore from "@/store/store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n";

export default function Auth() {
  const [nameReg, setNameReg] = useState("");
  const [emailReg, setEmailReg] = useState("");
  const [passReg, setPassReg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const { registerUser } = useStore((state) => state);

  async function register(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const user = {
      fullName: nameReg.trim(),
      phone: "",
      email: emailReg.trim().toLowerCase(),
      city: "Душанбе",
      password: passReg.trim(),
      role: "client",
      image: "",
    };

    if (!nameReg || !passReg || !emailReg) {
      toast.error(t("auth.error.fillData"));
      return;
    }
    if (!emailReg.includes("@") || !emailReg.includes(".")) {
      toast.error(t("auth.error.invalidEmail"));
      return;
    }
    if (passReg.length < 6) {
      toast.error(t("auth.error.shortPassword"));
      return;
    }

    setLoading(true);
    const result = await registerUser(user);
    setLoading(false);

    if (result.success) {
      const redirectMap: Record<string, string> = {
        admin: "/admin/panel",
        clinic: "/clinic/dashboard",
        doctor: "/dashboard",
        client: "/doctors",
      };
      router.push(redirectMap[result.role || "client"] || "/doctors");
      setNameReg("");
      setPassReg("");
      setEmailReg("");
    }
  }

  return (
    <div className="min-h-screen w-full flex">
      {/* Left - Illustration */}
      <div className="hidden lg:flex w-1/2 relative signature-gradient items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-md-secondary-container/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center px-12 text-center">
          <div className="w-80 h-80 rounded-3xl overflow-hidden shadow-2xl mb-8 border-4 border-white/10">
            <Image
              src={"/register.jpg"}
              alt="Medical illustration"
              width={320}
              height={320}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3 text-balance font-headline">
            {t("auth.joinCommunity")}
          </h2>
          <p className="text-teal-100/80 leading-relaxed max-w-xs">
            {t("auth.joinDesc")}
          </p>
          <div className="flex gap-6 mt-8">
            {[
              { icon: <Shield className="w-4 h-4" />, label: t("auth.secure") },
              { icon: <Heart className="w-4 h-4" />, label: t("auth.trustworthy") },
              { icon: <Stethoscope className="w-4 h-4" />, label: t("auth.professional") },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-white/70 text-sm bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                {item.icon}
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 sm:px-16 xl:px-24 py-12 bg-white dark:bg-[#121218]">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-lg bg-md-primary flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-md-on-surface font-headline">D A R M O N</span>
        </div>

        <div className="max-w-sm w-full">
          <h1 className="text-3xl font-bold text-md-on-surface mb-2 text-balance font-headline">{t("auth.createAccount")}</h1>
          <p className="text-md-on-surface-variant mb-8 leading-relaxed">
            {t("auth.createDesc")}
          </p>

          <form onSubmit={register} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name-reg" className="text-sm font-medium text-md-on-surface-variant">{t("auth.fullName")}</label>
              <input
                id="name-reg"
                type="text"
                value={nameReg}
                onChange={(e) => setNameReg(e.target.value)}
                placeholder={t("auth.namePlaceholder")}
                className="w-full border border-md-outline-variant/30 text-md-on-surface px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-md-primary focus:border-transparent placeholder-md-outline transition-all bg-md-surface-container-low"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email-reg" className="text-sm font-medium text-md-on-surface-variant">{t("auth.email")}</label>
              <input
                id="email-reg"
                type="email"
                value={emailReg}
                onChange={(e) => setEmailReg(e.target.value)}
                placeholder="example@mail.com"
                className="w-full border border-md-outline-variant/30 text-md-on-surface px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-md-primary focus:border-transparent placeholder-md-outline transition-all bg-md-surface-container-low"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="pass-reg" className="text-sm font-medium text-md-on-surface-variant">{t("auth.password")}</label>
              <input
                id="pass-reg"
                type="password"
                value={passReg}
                onChange={(e) => setPassReg(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-md-outline-variant/30 text-md-on-surface px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-md-primary focus:border-transparent placeholder-md-outline transition-all bg-md-surface-container-low"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-md-primary text-white py-3 rounded-xl font-semibold hover:bg-md-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-headline"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  {t("auth.register")}
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-md-on-surface-variant">
            {t("auth.haveAccount")}{" "}
            <button
              onClick={() => router.push("/auth/login")}
              className="text-md-primary cursor-pointer font-semibold hover:underline"
            >
              {t("auth.login")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
