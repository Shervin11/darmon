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
import { useTranslation } from "@/lib/i18n";

export default function Login() {
  const [emailLogin, setEmailLogin] = useState("");
  const [passLogin, setPassLogin] = useState("");
  const [docLog, setDocLog] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const { loginUser } = useStore((state) => state);

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const user = {
      email: emailLogin.trim().toLowerCase(),
      password: passLogin.trim(),
    };
    if (!emailLogin || !passLogin) {
      toast.error(t("auth.error.fillData"));
      return;
    }
    if (!emailLogin.includes("@") || !emailLogin.includes(".")) {
      toast.error(t("auth.error.invalidEmail"));
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
      toast.error(t("auth.error.wrongCredentials"));
    }
  }

  return (
    <div className="min-h-screen w-full flex">
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
            {t("auth.healthPriority")}
          </h2>
          <p className="text-teal-100/80 leading-relaxed max-w-xs">
            {t("auth.connectBest")}
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
    </div>
  );
}
