"use client";

import { useState } from "react";
import React from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Stethoscope, Heart, Shield, LogIn } from "lucide-react";
import useStore from "@/store/store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Login() {
  const [emailLogin, setEmailLogin] = useState("");
  const [passLogin, setPassLogin] = useState("");
  const [docLog, setDocLog] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { loginUser } = useStore((state) => state);

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const user = {
      email: emailLogin.trim().toLowerCase(),
      password: passLogin.trim(),
    };
    if (!emailLogin || !passLogin) {
      toast.error("Маълумоти худро пур кунед");
      return;
    }
    if (!emailLogin.includes("@") || !emailLogin.includes(".")) {
      toast.error("Email нодуруст аст");
      return;
    }

    setLoading(true);
    const result = await loginUser(user);
    setLoading(false);

    if (result.success) {
      router.push(result.role === "doctor" ? "/dashboard" : "/");
      setPassLogin("");
      setEmailLogin("");
    } else {
      toast.error("Email ё рамз нодуруст аст");
    }
  }

  return (
    <div className="min-h-screen w-full flex">
      {/* Left - Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 sm:px-16 xl:px-24 py-12 bg-white">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-lg bg-md-primary flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-md-on-surface font-headline">D A R M O N</span>
        </div>

        <div className="max-w-sm w-full">
          <h1 className="text-3xl font-bold text-md-on-surface mb-2 text-balance font-headline">Хуш омадед</h1>
          <p className="text-md-on-surface-variant mb-8 leading-relaxed">
            Барои идома додан ба аккаунти худ ворид шавед.
          </p>

          <form onSubmit={login} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email-login" className="text-sm font-medium text-md-on-surface-variant">Email</label>
              <input
                id="email-login"
                type="email"
                value={emailLogin}
                onChange={(e) => setEmailLogin(e.target.value)}
                placeholder="example@mail.com"
                className="w-full border border-md-outline-variant/30 text-md-on-surface px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-md-primary focus:border-transparent placeholder-md-outline transition-all bg-md-surface-container-low"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="pass-login" className="text-sm font-medium text-md-on-surface-variant">Рамз</label>
              <input
                id="pass-login"
                type="password"
                value={passLogin}
                onChange={(e) => setPassLogin(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-md-outline-variant/30 text-md-on-surface px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-md-primary focus:border-transparent placeholder-md-outline transition-all bg-md-surface-container-low"
              />
            </div>

            <div className="border border-md-outline-variant/30 rounded-xl p-4 bg-md-surface-container-low">
              <p className="text-sm font-medium text-md-on-surface-variant mb-3">Ман</p>
              <RadioGroup
                value={docLog ? "doctor" : "patient"}
                onValueChange={(value) => setDocLog(value === "doctor")}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value="doctor" id="login-doctor" />
                  <Label htmlFor="login-doctor" className="cursor-pointer flex items-center gap-1.5 text-md-on-surface-variant">
                    <Stethoscope className="w-4 h-4 text-md-primary" />
                    Табиб
                  </Label>
                </div>
                <div className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value="patient" id="login-patient" />
                  <Label htmlFor="login-patient" className="cursor-pointer flex items-center gap-1.5 text-md-on-surface-variant">
                    <Heart className="w-4 h-4 text-md-primary" />
                    Бемор
                  </Label>
                </div>
              </RadioGroup>
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
                  <LogIn className="w-4 h-4" />
                  Вуруд
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-md-on-surface-variant">
            Аккаунт надоред?{" "}
            <button
              onClick={() => router.push("/auth")}
              className="text-md-primary cursor-pointer font-semibold hover:underline"
            >
              Бақайдгирӣ
            </button>
          </p>
        </div>
      </div>

      {/* Right - Illustration */}
      <div className="hidden lg:flex w-1/2 relative signature-gradient items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-md-secondary-container/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center px-12 text-center">
          <div className="w-80 h-80 rounded-3xl overflow-hidden shadow-2xl mb-8 border-4 border-white/10">
            <Image
              src="/login.jpg"
              alt="Medical illustration"
              width={320}
              height={320}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3 text-balance font-headline">
            Саломатии шумо — авлавияти мост
          </h2>
          <p className="text-blue-100/80 leading-relaxed max-w-xs">
            Ба духтурони беҳтарин пайваст шавед ва саломатии худро идора кунед.
          </p>
          <div className="flex gap-6 mt-8">
            {[
              { icon: <Shield className="w-4 h-4" />, label: "Амниятнок" },
              { icon: <Heart className="w-4 h-4" />, label: "Боэтимод" },
              { icon: <Stethoscope className="w-4 h-4" />, label: "Касбӣ" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-white/70 text-sm bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
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
