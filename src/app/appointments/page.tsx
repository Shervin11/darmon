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
      {/* Hero Banner */}
      <section className="max-w-7xl mx-auto px-6 mb-12 mt-8">
        <div className="relative bg-[#00A191] rounded-xl pt-16 pb-20 px-10 md:px-16 overflow-hidden flex flex-col items-center justify-center text-center">
          {/* Glow effects */}
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

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="w-full lg:w-1/4 space-y-6">
            <div className="bg-md-primary/10 p-6 rounded-lg relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="font-headline font-bold text-md-primary text-base">{t("appointments.emergency")}</h4>
                <p className="text-md-on-surface-variant text-xs mt-2 leading-relaxed">{t("appointments.emergencyDesc")}</p>
              </div>
              <AlertCircle className="absolute right-[-10px] bottom-[-10px] text-md-primary/5 group-hover:rotate-12 transition-transform" size={96} />
            </div>
          </aside>

          {/* Appointment List */}
          <div className="w-full lg:w-3/4">
            {appointmentsLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-md-primary" />
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-md-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-10 h-10 text-md-primary" />
                </div>
                <h3 className="text-xl font-semibold text-md-on-surface mb-2 font-headline">{t("appointments.empty")}</h3>
                <p className="text-md-on-surface-variant mb-6">{t("appointments.emptyDesc")}</p>
                <Link href="/doctors" className="inline-block px-8 py-3 bg-md-secondary-container text-md-on-secondary-container rounded-full font-bold uppercase tracking-wider font-headline hover:scale-105 transition-transform">
                  {t("appointments.viewDoctors")}
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {appointments.map((apt: any) => (
                  <div
                    key={apt.id}
                    className={`bg-md-surface-container-lowest p-6 md:p-8 rounded-lg clinical-shadow flex flex-col md:flex-row gap-8 items-start relative border-l-4 transition-all hover:translate-x-1 ${
                      apt.status === "approved" ? "border-md-secondary" :
                      apt.status === "pending" ? "border-amber-400" : "border-md-error opacity-75"
                    }`}
                  >
                    <div className="w-16 h-16 rounded-full bg-md-surface-container-low flex items-center justify-center shrink-0 text-md-primary">
                      <Stethoscope size={28} />
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                        <div>
                          <h2 className="text-xl font-bold text-md-on-surface font-headline">{apt.doctorName || t("appointments.doctor")}</h2>
                          <p className="text-md-primary font-medium text-sm">{apt.specialty || ""}</p>
                        </div>
                        <StatusBadge status={apt.status} rejectReason={apt.rejectReason} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-3 text-md-on-surface-variant">
                          <Calendar size={18} className="text-md-primary" />
                          <span className="text-sm">{apt.date}</span>
                        </div>
                        <div className="flex items-center gap-3 text-md-on-surface-variant">
                          <Clock size={18} className="text-md-primary" />
                          <span className="text-sm">{apt.time}</span>
                        </div>
                        {apt.symptoms && (
                          <div className="flex items-start gap-3 text-md-on-surface-variant md:col-span-2">
                            <FileText size={18} className="text-md-primary" />
                            <span className="text-sm italic">{apt.symptoms}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Appointments;
