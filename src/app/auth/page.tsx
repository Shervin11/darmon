"use client";

import { useState } from "react";
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Stethoscope, UserPlus, Heart, Shield } from "lucide-react";
import useStore from "@/store/store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

export default function Auth() {
  const [nameReg, setNameReg] = useState("");
  const [passReg, setPassReg] = useState("");
  const [emailReg, setEmailReg] = useState("");
  const [docReg, setDocReg] = useState(false);
  const router = useRouter();

  const { registerUser, loginUser } = useStore((state) => state);

  async function register(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let user: object = {};
    if (docReg) {
      user = {
        name: nameReg.trim(),
        phone: "",
        email: emailReg.trim().toLowerCase(),
        city: "",
        specialty: "",
        experience: 0,
        recommendation: 0,
        rating: 0,
        price: {
          current: 0,
          old: null,
          currency: "см",
        },
        clinic: "",
        image: "",
        bio: "",
        availableSlots: [],
        comments: [],
        password: passReg.trim(),
        role: "doctor",
      };
    } else {
      user = {
        fullName: nameReg.trim(),
        phone: "",
        email: emailReg.trim().toLowerCase(),
        city: "",
        password: passReg.trim(),
        role: "client",
      };
    }
    if (nameReg && passReg && emailReg) {
      registerUser(user);
      router.push("/");
      setNameReg("");
      setPassReg("");
      setEmailReg("");
    } else {
      toast.error("Маълумоти худро дуруст пур кунед");
    }
  }

  return (
    <div className="min-h-screen w-full flex">
      <div className="hidden lg:flex w-1/2 relative bg-emerald-600 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-700" />
        <div className="relative z-10 flex flex-col items-center px-12 text-center">
          <div className="w-80 h-80 rounded-3xl overflow-hidden shadow-2xl mb-8">
            <Image
              src={"/medical-illustration.png"}
              alt="Medical illustration"
              width={320}
              height={320}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3 text-balance">
            Ба ҷомеаи мо ҳамроҳ шавед
          </h2>
          <p className="text-emerald-100 leading-relaxed max-w-xs">
            Ҳазорон беморон ва духтурон аллакай аз хидматҳои мо истифода
            мекунанд.
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

      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 sm:px-16 xl:px-24 py-12 bg-white">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">D A R M O N</span>
        </div>

        <div className="max-w-sm w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-balance">
            Аккаунт созед
          </h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Барои оғоз кардан маълумоти худро ворид кунед.
          </p>

          <form onSubmit={register} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name-reg"
                className="text-sm font-medium text-gray-700"
              >
                Ному насаб
              </label>
              <input
                id="name-reg"
                type="text"
                value={nameReg}
                onChange={(e) => setNameReg(e.target.value)}
                placeholder="Алӣ Рахимов"
                className="w-full border border-gray-200 text-gray-900 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-400 transition-all bg-gray-50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email-reg"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email-reg"
                type="email"
                value={emailReg}
                onChange={(e) => setEmailReg(e.target.value)}
                placeholder="example@mail.com"
                className="w-full border border-gray-200 text-gray-900 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-400 transition-all bg-gray-50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="pass-reg"
                className="text-sm font-medium text-gray-700"
              >
                Рамз
              </label>
              <input
                id="pass-reg"
                type="password"
                value={passReg}
                onChange={(e) => setPassReg(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 text-gray-900 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-400 transition-all bg-gray-50"
              />
            </div>

            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <p className="text-sm font-medium text-gray-700 mb-3">Ман</p>
              <RadioGroup
                value={docReg ? "doctor" : "patient"}
                onValueChange={(value) => setDocReg(value === "doctor")}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value="doctor" id="reg-doctor" />
                  <Label
                    htmlFor="reg-doctor"
                    className="cursor-pointer flex items-center gap-1.5 text-gray-700"
                  >
                    <Stethoscope className="w-4 h-4 text-emerald-600" />
                    Табиб
                  </Label>
                </div>
                <div className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value="patient" id="reg-patient" />
                  <Label
                    htmlFor="reg-patient"
                    className="cursor-pointer flex items-center gap-1.5 text-gray-700"
                  >
                    <Heart className="w-4 h-4 text-emerald-600" />
                    Бемор
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
            >
              <UserPlus className="w-4 h-4" />
              Бақайдгирӣ
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Аккаунт доред?{" "}
            <button
              onClick={() => router.push("/auth/login")}
              className="text-emerald-600 cursor-pointer font-semibold hover:underline"
            >
              Вуруд
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
