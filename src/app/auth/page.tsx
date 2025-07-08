"use client";
import { useState } from "react";
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Stethoscope, UserPlus, LogIn, Heart, Shield } from "lucide-react";
import useStore from "@/store/store";

export default function Auth() {
  const [showLogin, setShowLogin] = useState(false);
  const [emailLogin, setEmailLogin] = useState("");
  const [passLogin, setPassLogin] = useState("");
  const [nameReg, setNameReg] = useState("");
  const [passReg, setPassReg] = useState("");
  const [emailReg, setEmailReg] = useState("");
  const [docReg, setDocReg] = useState(false);
  const [docLog, setDocLog] = useState(false);

  const { registerClient, registerDoctor } = useStore((state) => state);

  function reg(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (docReg) {
      registerDoctor({
        name: nameReg,
        phone: "",
        email: emailReg,
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
        password: passReg,
        role: 'doctor'
      });
    } else {
      registerClient({
        fullName: nameReg,
        phone: "",
        email: emailReg,
        city: "",
        password: passReg,
        role: 'client'
      });
    }
    setShowLogin(true);
    setNameReg("");
    setPassReg("");
    setEmailReg("");
  }

  return (
    <div className="relative md:w-full h-[600px] w-[90%] max-w-[420px] my-[50px] mx-auto">
      <div className="absolute -top-4 -left-4 w-24 h-24 bg-emerald-100 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-teal-100 rounded-full opacity-20 blur-xl"></div>
      <div
        className={`relative w-full h-full transition-transform duration-700 ease-in-out`}
        style={{
          transformStyle: "preserve-3d",
          transform: showLogin ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          className="absolute w-full h-full rounded-2xl shadow-2xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(0deg)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div className="absolute bottom-4 left-4">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
              <Shield className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="relative z-10 p-8 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/20 rounded-full">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Бақайдгирӣ</h2>
            </div>

            <button
              onClick={() => setShowLogin(true)}
              className="text-sm text-white bg-white/10 px-3 py-1 rounded-full hover:bg-white/20 underline decoration-dotted underline-offset-4 mb-6 self-start transition-all border border-white/30"
            >
              Аккаунт доред?
            </button>

            <form onSubmit={reg} className="flex flex-col space-y-4 flex-1">
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={nameReg}
                    onChange={(e) => setNameReg(e.target.value)}
                    placeholder="Ном"
                    className="w-full bg-white/15 backdrop-blur-sm border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent placeholder-white/70 transition-all"
                  />
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={emailReg}
                    onChange={(e) => setEmailReg(e.target.value)}
                    placeholder="Email"
                    className="w-full bg-white/15 backdrop-blur-sm border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent placeholder-white/70 transition-all"
                  />
                </div>

                <div className="relative">
                  <input
                    type="password"
                    value={passReg}
                    onChange={(e) => setPassReg(e.target.value)}
                    placeholder="Рамз"
                    className="w-full bg-white/15 backdrop-blur-sm border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent placeholder-white/70 transition-all"
                  />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-white font-medium mb-3">Ман</p>
                <RadioGroup
                  value={docReg ? "doctor" : "patient"}
                  onValueChange={(value) => setDocReg(value == "doctor")}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <RadioGroupItem
                      value="doctor"
                      id="r2"
                      className="border-white text-white"
                    />
                    <Label
                      htmlFor="r2"
                      className="text-white cursor-pointer flex items-center gap-2"
                    >
                      <Stethoscope className="w-4 h-4" />
                      Табиб
                    </Label>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <RadioGroupItem
                      value="patient"
                      id="r3"
                      className="border-white text-white"
                    />
                    <Label
                      htmlFor="r3"
                      className="text-white cursor-pointer flex items-center gap-2"
                    >
                      <Heart className="w-4 h-4" />
                      Бемор
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <button
                type="submit"
                className="bg-white text-emerald-600 px-6 py-3 rounded-xl hover:bg-emerald-50 hover:scale-105 transition-all duration-200 font-semibold shadow-lg mt-auto border-2 border-white"
              >
                Бақайдгирӣ
              </button>
            </form>
          </div>
        </div>

        <div
          className="absolute w-full h-full rounded-2xl shadow-2xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-emerald-600 to-green-700"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div className="absolute bottom-4 right-4">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="absolute top-1/2 left-8 transform -translate-y-1/2">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="relative z-10 p-8 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/20 rounded-full">
                <LogIn className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Вуруд</h2>
            </div>

            <button
              onClick={() => setShowLogin(false)}
              className="text-sm text-white bg-white/10 px-3 py-1 rounded-full hover:bg-white/20 underline decoration-dotted underline-offset-4 mb-6 self-start transition-all border border-white/30"
            >
              Аккаунт надоред?
            </button>

            <form className="flex flex-col space-y-4 flex-1">
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={emailLogin}
                    onChange={(e) => setEmailLogin(e.target.value)}
                    placeholder="Email"
                    className="w-full bg-white/15 backdrop-blur-sm border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent placeholder-white/70 transition-all"
                  />
                </div>

                <div className="relative">
                  <input
                    type="password"
                    value={passLogin}
                    onChange={(e) => setPassLogin(e.target.value)}
                    placeholder="Рамз"
                    className="w-full bg-white/15 backdrop-blur-sm border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent placeholder-white/70 transition-all"
                  />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-white font-medium mb-3">Ман</p>
                <RadioGroup
                  value={docLog ? "doctor" : "patient"}
                  onValueChange={(value) => setDocLog(value == "doctor")}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <RadioGroupItem
                      value="doctor"
                      id="r2"
                      className="border-white text-white"
                    />
                    <Label
                      htmlFor="r2"
                      className="text-white cursor-pointer flex items-center gap-2"
                    >
                      <Stethoscope className="w-4 h-4" />
                      Табиб
                    </Label>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <RadioGroupItem
                      value="patient"
                      id="r3"
                      className="border-white text-white"
                    />
                    <Label
                      htmlFor="r3"
                      className="text-white cursor-pointer flex items-center gap-2"
                    >
                      <Heart className="w-4 h-4" />
                      Бемор
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <button
                type="submit"
                className="bg-white text-teal-600 px-6 py-3 rounded-xl hover:bg-teal-50 hover:scale-105 transition-all duration-200 font-semibold shadow-lg mt-auto border-2 border-white"
              >
                Вуруд
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
