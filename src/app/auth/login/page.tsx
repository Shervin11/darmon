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
  const router = useRouter();

  const { loginUser } = useStore((state) => state);

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let user: object = {};
    if (docLog) {
      user = {
        email: emailLogin.trim().toLowerCase(),
        password: passLogin.trim(),
      };
    } else {
      user = {
        email: emailLogin.trim().toLowerCase(),
        password: passLogin.trim(),
      };
    }
    if (passLogin && emailLogin) {
      const result = await loginUser(user);
      if (result.success) {
        router.push("/");
        setPassLogin("");
        setEmailLogin("");
      } else {
        toast.error("Email ё рамз нодуруст аст");
      }
    } else {
      toast.error("Маълумоти худро дуруст пур кунед");
    }
  }

  return (
    <div className="min-h-screen w-full flex">
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 sm:px-16 xl:px-24 py-12 bg-white">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">D A R M O N</span>
        </div>

        <div className="max-w-sm w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-balance">
            Хуш омадед
          </h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Барои идома додан ба аккаунти худ ворид шавед.
          </p>

          <form onSubmit={login} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email-login"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email-login"
                type="email"
                value={emailLogin}
                onChange={(e) => setEmailLogin(e.target.value)}
                placeholder="example@mail.com"
                className="w-full border border-gray-200 text-gray-900 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400 transition-all bg-gray-50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="pass-login"
                className="text-sm font-medium text-gray-700"
              >
                Рамз
              </label>
              <input
                id="pass-login"
                type="password"
                value={passLogin}
                onChange={(e) => setPassLogin(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 text-gray-900 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400 transition-all bg-gray-50"
              />
            </div>

            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <p className="text-sm font-medium text-gray-700 mb-3">Ман</p>
              <RadioGroup
                value={docLog ? "doctor" : "patient"}
                onValueChange={(value) => setDocLog(value === "doctor")}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value="doctor" id="login-doctor" />
                  <Label
                    htmlFor="login-doctor"
                    className="cursor-pointer flex items-center gap-1.5 text-gray-700"
                  >
                    <Stethoscope className="w-4 h-4 text-teal-600" />
                    Табиб
                  </Label>
                </div>
                <div className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value="patient" id="login-patient" />
                  <Label
                    htmlFor="login-patient"
                    className="cursor-pointer flex items-center gap-1.5 text-gray-700"
                  >
                    <Heart className="w-4 h-4 text-teal-600" />
                    Бемор
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
            >
              <LogIn className="w-4 h-4" />
              Вуруд
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Аккаунт надоред?{" "}
            <button
              onClick={() => router.push("/auth")}
              className="text-teal-600 cursor-pointer font-semibold hover:underline"
            >
              Бақайдгирӣ
            </button>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 relative bg-teal-600 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-emerald-700" />
        <div className="relative z-10 flex flex-col items-center px-12 text-center">
          <div className="w-80 h-80 rounded-3xl overflow-hidden shadow-2xl mb-8">
            <Image
              src="/auth-illustration.jpg"
              alt="Medical illustration"
              width={320}
              height={320}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3 text-balance">
            Саломатии шумо — авлавияти мост
          </h2>
          <p className="text-teal-100 leading-relaxed max-w-xs">
            Ба духтурони беҳтарин пайваст шавед ва саломатии худро идора кунед.
          </p>
          <div className="flex gap-6 mt-8">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Shield className="w-4 h-4" />
              Амниятнок
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Heart className="w-4 h-4" />
              Боэтимод
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Stethoscope className="w-4 h-4" />
              Касбӣ
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
