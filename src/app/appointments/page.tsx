"use client";

import React, { useEffect } from "react";
import useStore from "@/store/store";
import StatusBadge from "@/components/StatusBadge/page";
import { Calendar, Clock, Stethoscope, FileText, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

const Appointments = () => {
  const { loginMe, userById, getAppointments, appointments, appointmentsLoading } = useStore((s) => s);
  const { t } = useTranslation();

  useEffect(() => {
    loginMe();
  }, []);

  useEffect(() => {
    if (userById?.id) getAppointments(userById.id);
  }, [userById]);

  return (
    <div className="pt-20 pb-12">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#00C4B0] rounded-full blur-[120px]"></div>
            <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-[#007D70] rounded-full blur-[120px]"></div>
          </div>
          
          <div className="relative z-10">
            <span className="text-[#A7F3EB] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 inline-block font-headline">{t("appointments.badge")}</span>
            <h1 className="text-white text-4xl md:text-6xl font-extrabold tracking-tight mb-2 font-headline">{t("appointments.title")}</h1>
            <p className="text-[#A7F3EB]/90 text-lg md:text-xl font-medium max-w-xl mx-auto">{t("appointments.subtitle")}</p>
          </div>
        </div>
      </section>

          <aside className="w-full lg:w-1/4 space-y-6">
            <div className="bg-md-primary/10 p-6 rounded-lg relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="font-headline font-bold text-md-primary text-base">{t("appointments.emergency")}</h4>
                <p className="text-md-on-surface-variant text-xs mt-2 leading-relaxed">{t("appointments.emergencyDesc")}</p>
              </div>
              <AlertCircle className="absolute right-[-10px] bottom-[-10px] text-md-primary/5 group-hover:rotate-12 transition-transform" size={96} />
            </div>
          </aside>

