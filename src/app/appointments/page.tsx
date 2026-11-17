"use client";

import React, { useEffect, useState } from "react";
import useStore, { type Appointment } from "@/store/store";
import StatusBadge from "@/components/StatusBadge/page";
import { Calendar, Clock, Stethoscope, FileText, AlertCircle, ArrowRight, CalendarClock, Ban, Star, X } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import TelegramConnect from "@/components/TelegramConnect/TelegramConnect";
import { ECG_WIDE, delay } from "@/lib/ui";
import { localDate } from "@/lib/schedule";
import { useEscape } from "@/lib/useEscape";
import SlotPicker from "@/components/SlotPicker/SlotPicker";

/* Цвет полосы слева кодирует статус записи, как и раньше */
const railColor = (status: string) =>
  status === "approved" || status === "completed"
    ? "bg-md-secondary"
    : status === "pending"
      ? "bg-amber-400"
      : "bg-md-error";

/** Clinic time (UTC+5) matches the visitor's in Tajikistan; the backend re-checks anyway. */
const isUpcoming = (a: Appointment) =>
  (a.status === "pending" || a.status === "approved") && new Date(`${a.date}T${a.time}`) > new Date();

const actionCls =
  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-md-primary";

/** Pick a new date and free time for a visit. A patient's change goes back to the doctor for approval. */
function RescheduleDialog({ appointment, onClose }: { appointment: Appointment; onClose: () => void }) {
  const { t } = useTranslation();
  const { updateAppointment, getAppointments } = useStore((s) => s);
  const [date, setDate] = useState(appointment.date);
  const [time, setTime] = useState("");
  const [saving, setSaving] = useState(false);
  useEscape(true, onClose);

  const save = async () => {
    if (!time) return;
    setSaving(true);
    const res = await updateAppointment(appointment.id!, { date, time }, t("appointments.rescheduled"));
    setSaving(false);
    if (res.success) {
      getAppointments();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reschedule-title"
        className="w-full max-w-md rounded-[2rem] bg-md-surface-container-lowest p-6 md:p-8 space-y-5 clinical-shadow"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="reschedule-title" className="font-headline font-bold text-xl text-md-on-surface">{t("appointments.reschedule")}</h2>
            <p className="text-sm text-md-on-surface-variant">{appointment.doctorName}</p>
          </div>
          <button onClick={onClose} aria-label={t("doctor.cancel")} className="p-2 rounded-full hover:bg-md-surface-container cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <input
          type="date"
          value={date}
          min={localDate()}
          onChange={(e) => { setDate(e.target.value); setTime(""); }}
          className="w-full h-12 rounded-2xl bg-md-surface-container-low px-4 text-md-on-surface outline-none focus:ring-2 ring-md-primary/20"
        />
        <SlotPicker doctorId={appointment.doctorId} date={date} value={time} onChange={setTime} />
        <p className="text-xs text-md-on-surface-variant">{t("appointments.rescheduleNote")}</p>
        <button
          onClick={save}
          disabled={!time || saving}
          className="w-full h-12 rounded-full bg-md-primary text-white font-headline font-bold disabled:opacity-50 cursor-pointer"
        >
          {saving ? t("doctor.sending") : t("doctor.save")}
        </button>
      </div>
    </div>
  );
}

const Appointments = () => {
  const { userById, getAppointments, appointments, appointmentsLoading, updateAppointment } = useStore((s) => s);
  const { t } = useTranslation();
  const [rescheduling, setRescheduling] = useState<Appointment | null>(null);

  const cancel = async (a: Appointment) => {
    if (!confirm(t("appointments.cancelConfirm"))) return;
    const res = await updateAppointment(a.id!, { status: "cancelled" }, t("appointments.cancelled"));
    if (res.success) getAppointments();
  };

  useEffect(() => {
    if (userById?.id) getAppointments();
  }, [userById?.id]);

  return (
    <div className="pt-20 pb-16">

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 mb-12 mt-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-md-banner px-8 py-14 md:px-16 md:py-20">
          <svg aria-hidden="true" viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-6 h-28 w-full text-white/25">
            <path d={ECG_WIDE} pathLength="1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" className="fx-draw" />
          </svg>
          <div className="relative max-w-2xl space-y-4">
            <p className="fx-rise inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white font-headline" style={delay("0.05s")}>
              <span className="fx-beat h-2 w-2 rounded-full bg-white" />
              {t("appointments.badge")}
            </p>
            <h1 className="fx-rise text-white font-headline font-extrabold tracking-tight leading-[1.05] text-4xl md:text-6xl" style={delay("0.2s")}>
              {t("appointments.title")}
            </h1>
            <p className="fx-rise text-md-on-banner-muted text-lg md:text-xl leading-relaxed" style={delay("0.4s")}>
              {t("appointments.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          {/* Sidebar */}
          <aside className="w-full lg:w-1/4 lg:sticky lg:top-28 space-y-5">
            <TelegramConnect compact />
            <div className="group relative overflow-hidden rounded-[2rem] bg-md-primary/10 p-7">
              <div className="relative z-10 space-y-3">
                <div className="h-11 w-11 rounded-full bg-md-primary text-white flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h4 className="font-headline font-bold text-md-primary text-lg">{t("appointments.emergency")}</h4>
                <p className="text-md-on-surface-variant text-sm leading-relaxed">{t("appointments.emergencyDesc")}</p>
              </div>
              <AlertCircle className="absolute -right-4 -bottom-4 text-md-primary/10 transition-transform duration-500 group-hover:rotate-12" size={120} />
            </div>
          </aside>

          {/* Appointment List */}
          <div className="w-full lg:w-3/4">
            {appointmentsLoading ? (
              <div className="grid gap-5" role="status" aria-label="Loading">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-40 rounded-[2rem] bg-md-surface-container-low animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            ) : appointments.length === 0 ? (
              <div className="rounded-[2rem] border-2 border-dashed border-md-surface-variant/40 px-8 py-16 text-center">
                <svg aria-hidden="true" viewBox="0 0 120 40" className="mx-auto mb-6 h-10 w-28 text-md-primary/40">
                  <path d="M0 20 H44 L52 20 L58 6 L67 34 L74 20 H120" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3 className="text-2xl font-bold text-md-on-surface mb-2 font-headline">{t("appointments.empty")}</h3>
                <p className="text-md-on-surface-variant mb-8 max-w-md mx-auto">{t("appointments.emptyDesc")}</p>
                <Link
                  href="/doctors"
                  className="group inline-flex items-center gap-2 px-8 py-3.5 bg-md-primary text-white rounded-full font-bold font-headline shadow-lg shadow-md-primary/25 transition-all hover:shadow-xl active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-md-primary"
                >
                  {t("appointments.viewDoctors")}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {appointments.map((apt, i) => (
                  <article
                    key={apt.id}
                    className={`fx-rise group relative overflow-hidden rounded-[2rem] bg-md-surface-container-lowest clinical-shadow p-6 md:p-8 pl-8 md:pl-10 flex flex-col md:flex-row gap-6 md:gap-8 transition-transform duration-500 hover:-translate-y-1 ${
                      apt.status === "approved" || apt.status === "pending" ? "" : "opacity-75"
                    }`}
                    style={delay(`${Math.min(i, 8) * 0.08}s`)}
                  >
                    <span className={`absolute left-0 inset-y-0 w-2 ${railColor(apt.status)}`} aria-hidden="true" />

                    <div className="h-16 w-16 rounded-full bg-md-primary/10 flex items-center justify-center shrink-0 text-md-primary transition-colors duration-300 group-hover:bg-md-primary group-hover:text-white">
                      <Stethoscope size={28} />
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-5">
                        <div>
                          <h2 className="text-xl md:text-2xl font-bold text-md-on-surface font-headline">{apt.doctorName || t("appointments.doctor")}</h2>
                          <p className="text-md-primary font-medium">{apt.specialty || ""}</p>
                        </div>
                        <StatusBadge status={apt.status} rejectReason={apt.rejectReason} />
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <span className="inline-flex items-center gap-2 rounded-full bg-md-surface-container px-4 py-2 text-sm text-md-on-surface">
                          <Calendar size={16} className="text-md-primary" />
                          {apt.date}
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-md-surface-container px-4 py-2 text-sm text-md-on-surface">
                          <Clock size={16} className="text-md-primary" />
                          {apt.time}
                        </span>
                      </div>

                      {apt.symptoms && (
                        <div className="mt-5 flex items-start gap-3 rounded-2xl bg-md-surface-container-low px-5 py-4 text-md-on-surface-variant">
                          <FileText size={18} className="mt-0.5 shrink-0 text-md-primary" />
                          <span className="text-sm leading-relaxed">{apt.symptoms}</span>
                        </div>
                      )}

                      {(isUpcoming(apt) || apt.status === "completed") && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {isUpcoming(apt) && (
                            <>
                              <button onClick={() => setRescheduling(apt)} className={`${actionCls} bg-md-primary/10 text-md-primary hover:bg-md-primary/20`}>
                                <CalendarClock size={16} />
                                {t("appointments.reschedule")}
                              </button>
                              <button onClick={() => cancel(apt)} className={`${actionCls} text-md-error hover:bg-md-error/10`}>
                                <Ban size={16} />
                                {t("appointments.cancel")}
                              </button>
                            </>
                          )}
                          {apt.status === "completed" && (
                            <Link href={`/doctors/${apt.doctorId}#reviews`} className={`${actionCls} bg-amber-400/15 text-amber-700 dark:text-amber-300 hover:bg-amber-400/25`}>
                              <Star size={16} />
                              {t("appointments.leaveReview")}
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      {rescheduling && <RescheduleDialog appointment={rescheduling} onClose={() => setRescheduling(null)} />}
    </div>
  );
};

export default Appointments;