"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Ban, Check, ChevronLeft, ChevronRight, PhoneCall, Plus, UserX, Wallet, X, BadgeCheck } from "lucide-react";
import useStore, { type Appointment, type AppointmentStatus, type Doctor } from "@/store/store";
import { api, apiError } from "@/lib/api";
import { useTranslation } from "@/lib/i18n";
import { addDays, localDate } from "@/lib/schedule";
import StatusBadge from "@/components/StatusBadge/page";
import SlotPicker from "@/components/SlotPicker/SlotPicker";
import { cardCls, fieldCls, labelCls, primaryBtn } from "@/components/clinic/styles";

const emptyBooking = { doctorId: "", time: "", clientName: "", clientPhone: "", source: "phone", symptoms: "" };

const hasStarted = (a: Appointment) => new Date(`${a.date}T${a.time}`) <= new Date();

const chip =
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-md-primary";

/** Front desk: the clinic's day, bookings by phone or walk-in, visit outcomes and payment marks. */
export default function DeskPage() {
  const { t } = useTranslation();
  const user = useStore((s) => s.userById);
  const updateAppointment = useStore((s) => s.updateAppointment);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState(() => localDate());
  const [visits, setVisits] = useState<Appointment[] | null>(null);
  const [booking, setBooking] = useState<typeof emptyBooking | null>(null);
  const [saving, setSaving] = useState(false);
  const [slotsReload, setSlotsReload] = useState(0);

  useEffect(() => {
    if (user?.id) api.get<Doctor[]>("/clinic/doctors").then(({ data }) => setDoctors(data)).catch(() => {});
  }, [user?.id]);

  const load = useCallback(() => {
    api
      .get<Appointment[]>("/appointments", { params: { date, doctorId: doctorId || undefined } })
      .then(({ data }) => setVisits(data))
      .catch(() => setVisits([]));
  }, [date, doctorId]);

  useEffect(() => {
    if (user?.id) load();
  }, [user?.id, load]);

  const change = async (a: Appointment, body: Partial<Appointment> & { reason?: string }, msg: string) => {
    const res = await updateAppointment(a.id!, body, msg);
    if (res.success) load();
  };

  const setStatus = (a: Appointment, status: AppointmentStatus) => {
    if (status === "rejected" || status === "cancelled") {
      const reason = prompt(t("desk.reason")) ?? null;
      if (reason === null) return;
      return change(a, { status, rejectReason: reason }, t(`status.${status}`));
    }
    return change(a, { status }, t(`status.${status}`));
  };

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    if (!booking.doctorId || !booking.time || !booking.clientName.trim() || !booking.clientPhone.trim()) {
      toast.error(t("auth.error.fillData"));
      return;
    }
    setSaving(true);
    try {
      await api.post("/appointments", { ...booking, doctorId: Number(booking.doctorId), date });
      toast.success(t("desk.booked"));
      setBooking(null);
      load();
    } catch (err) {
      toast.error(apiError(err, t("common.error")));
      setBooking({ ...booking, time: "" });
      setSlotsReload((n) => n + 1);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-6 space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-headline font-extrabold text-3xl md:text-5xl tracking-tight text-md-on-surface">{t("desk.title")}</h1>
          <p className="mt-2 text-md-on-surface-variant">{user?.clinicName || user?.fullName}</p>
        </div>
        <button onClick={() => setBooking(booking ? null : { ...emptyBooking, doctorId })} className={primaryBtn}>
          {booking ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {booking ? t("doctor.cancel") : t("desk.newBooking")}
        </button>
      </header>

      {/* Day and doctor */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex items-center gap-1">
          <button onClick={() => setDate(addDays(date, -1))} aria-label={t("desk.prevDay")} className="h-11 w-11 rounded-full bg-md-surface-container-low flex items-center justify-center hover:bg-md-primary/10 cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <input type="date" value={date} onChange={(e) => e.target.value && setDate(e.target.value)} aria-label={t("desk.date")} className={`${fieldCls} !w-auto`} />
          <button onClick={() => setDate(addDays(date, 1))} aria-label={t("desk.nextDay")} className="h-11 w-11 rounded-full bg-md-surface-container-low flex items-center justify-center hover:bg-md-primary/10 cursor-pointer">
            <ChevronRight className="w-5 h-5" />
          </button>
          {date !== localDate() && (
            <button onClick={() => setDate(localDate())} className="ml-2 text-sm font-semibold text-md-primary hover:underline cursor-pointer">{t("desk.today")}</button>
          )}
        </div>
        <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} aria-label={t("desk.doctor")} className={`${fieldCls} !w-auto min-w-56`}>
          <option value="">{t("desk.allDoctors")}</option>
          {doctors.map((d) => <option key={d.id} value={d.id}>{d.fullName}</option>)}
        </select>
      </div>

      {/* New booking */}
      {booking && (
        <form onSubmit={submitBooking} className={`${cardCls} grid gap-5 md:grid-cols-2`}>
          <label className="space-y-1.5">
            <span className={labelCls}>{t("desk.doctor")} *</span>
            <select value={booking.doctorId} onChange={(e) => setBooking({ ...booking, doctorId: e.target.value, time: "" })} className={fieldCls}>
              <option value="">—</option>
              {doctors.map((d) => <option key={d.id} value={d.id}>{d.fullName} · {d.specialty}</option>)}
            </select>
          </label>
          <label className="space-y-1.5">
            <span className={labelCls}>{t("desk.source")}</span>
            <select value={booking.source} onChange={(e) => setBooking({ ...booking, source: e.target.value })} className={fieldCls}>
              <option value="phone">{t("source.phone")}</option>
              <option value="walkin">{t("source.walkin")}</option>
            </select>
          </label>
          <label className="space-y-1.5">
            <span className={labelCls}>{t("desk.patient")} *</span>
            <input value={booking.clientName} onChange={(e) => setBooking({ ...booking, clientName: e.target.value })} className={fieldCls} />
          </label>
          <label className="space-y-1.5">
            <span className={labelCls}>{t("auth.phone")} *</span>
            <input type="tel" value={booking.clientPhone} onChange={(e) => setBooking({ ...booking, clientPhone: e.target.value })} placeholder="+992 93 123 45 67" className={fieldCls} />
          </label>
          <div className="md:col-span-2 space-y-1.5">
            <p className={labelCls}>{t("doctor.selectTime")} · {date}</p>
            {booking.doctorId ? (
              <SlotPicker doctorId={booking.doctorId} date={date} value={booking.time} onChange={(time) => setBooking({ ...booking, time })} reloadKey={slotsReload} />
            ) : (
              <p className="text-sm text-md-on-surface-variant">{t("desk.pickDoctor")}</p>
            )}
          </div>
          <label className="md:col-span-2 space-y-1.5">
            <span className={labelCls}>{t("doctor.symptoms")}</span>
            <input value={booking.symptoms} onChange={(e) => setBooking({ ...booking, symptoms: e.target.value })} className={fieldCls} />
          </label>
          <div className="md:col-span-2 flex items-center justify-between gap-4">
            <p className="text-xs text-md-on-surface-variant">{t("desk.smsNote")}</p>
            <button type="submit" disabled={saving} className={primaryBtn}>
              <PhoneCall className="w-4 h-4" />
              {t("desk.book")}
            </button>
          </div>
        </form>
      )}

      {/* Day list */}
      {visits === null ? (
        <div className="h-40 rounded-[2rem] bg-md-surface-container-low animate-pulse" role="status" />
      ) : visits.length === 0 ? (
        <p className="rounded-[2rem] border-2 border-dashed border-md-surface-variant/40 px-8 py-12 text-center text-md-on-surface-variant">{t("desk.empty")}</p>
      ) : (
        <ul className="space-y-3">
          {visits.map((a) => (
            <li key={a.id} className="rounded-[1.5rem] bg-md-surface-container-lowest clinical-shadow p-5 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-4 md:w-40 shrink-0">
                <span className="font-headline font-black text-2xl tabular-nums text-md-on-surface">{a.time}</span>
                <span className="text-xs text-md-on-surface-variant">{a.durationMinutes} {t("schedule.minutes")}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-md-on-surface truncate">
                  {a.clientName}
                  {a.clientPhone && (
                    <a href={`tel:${a.clientPhone}`} className="ml-2 text-sm font-normal text-md-primary hover:underline">{a.clientPhone}</a>
                  )}
                </p>
                <p className="text-sm text-md-on-surface-variant truncate">
                  {a.doctorName} · {t(`source.${a.source || "online"}`)}
                  {a.symptoms ? ` · ${a.symptoms}` : ""}
                </p>
              </div>
              <StatusBadge status={a.status} rejectReason={a.rejectReason} />
              <div className="flex flex-wrap gap-2 md:justify-end md:w-72">
                {a.status === "pending" && (
                  <>
                    <button onClick={() => setStatus(a, "approved")} className={`${chip} bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25`}>
                      <Check className="w-3.5 h-3.5" />{t("desk.approve")}
                    </button>
                    <button onClick={() => setStatus(a, "rejected")} className={`${chip} text-md-error hover:bg-md-error/10`}>
                      <X className="w-3.5 h-3.5" />{t("desk.reject")}
                    </button>
                  </>
                )}
                {a.status === "approved" && hasStarted(a) && (
                  <>
                    <button onClick={() => setStatus(a, "completed")} className={`${chip} bg-sky-500/15 text-sky-700 dark:text-sky-300 hover:bg-sky-500/25`}>
                      <BadgeCheck className="w-3.5 h-3.5" />{t("desk.came")}
                    </button>
                    <button onClick={() => setStatus(a, "no_show")} className={`${chip} bg-orange-500/15 text-orange-700 dark:text-orange-300 hover:bg-orange-500/25`}>
                      <UserX className="w-3.5 h-3.5" />{t("desk.noShow")}
                    </button>
                  </>
                )}
                {a.status === "approved" && !hasStarted(a) && (
                  <button onClick={() => setStatus(a, "cancelled")} className={`${chip} text-md-error hover:bg-md-error/10`}>
                    <Ban className="w-3.5 h-3.5" />{t("appointments.cancel")}
                  </button>
                )}
                {(a.status === "approved" || a.status === "completed") && (
                  <button
                    onClick={() => change(a, { paid: !a.paid }, a.paid ? t("desk.unpaid") : t("desk.paid"))}
                    aria-pressed={!!a.paid}
                    className={`${chip} ${a.paid ? "bg-md-primary text-white" : "bg-md-surface-container text-md-on-surface hover:bg-md-primary/10"}`}
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    {a.paid ? t("desk.paid") : `${t("desk.markPaid")} · ${a.price ?? 0}`}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
