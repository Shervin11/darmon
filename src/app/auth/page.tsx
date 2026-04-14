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
  const [passReg, setPassReg] = useState("");
  const [emailReg, setEmailReg] = useState("");
  const [docReg, setDocReg] = useState(false);
  const [specialtyReg, setSpecialtyReg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const { registerUser, getSubcategories, subcategories } = useStore((state) => state);

  useEffect(() => {
    getSubcategories();
  }, []);

  async function register(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let user: object = {};
    if (docReg) {
      user = {
        fullName: nameReg.trim(),
        phone: "",
        email: emailReg.trim().toLowerCase(),
        city: "",
        specialty: specialtyReg,
        experience: 0,
        recommendation: 0,
        rating: 0,
        price: { current: 0, old: null, currency: "сом." },
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
        image: "",
      };
    }
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
      router.push("/");
      setNameReg("");
      setPassReg("");
      setEmailReg("");
      setSpecialtyReg("");
    }
  }

  return (
    <div className="min-h-screen w-full flex">
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

            <div className="border border-md-outline-variant/30 rounded-xl p-4 bg-md-surface-container-low">
              <p className="text-sm font-medium text-md-on-surface-variant mb-3">{t("auth.iAm")}</p>
              <RadioGroup
                value={docReg ? "doctor" : "patient"}
                onValueChange={(value) => setDocReg(value === "doctor")}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value="doctor" id="reg-doctor" />
                  <Label htmlFor="reg-doctor" className="cursor-pointer flex items-center gap-1.5 text-md-on-surface-variant">
                    <Stethoscope className="w-4 h-4 text-md-primary" />
                    {t("auth.doctor")}
                  </Label>
                </div>
                <div className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value="patient" id="reg-patient" />
                  <Label htmlFor="reg-patient" className="cursor-pointer flex items-center gap-1.5 text-md-on-surface-variant">
                    <Heart className="w-4 h-4 text-md-primary" />
                    {t("auth.patient")}
                  </Label>
                </div>
              </RadioGroup>
            </div>

