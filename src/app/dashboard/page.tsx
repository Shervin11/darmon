"use client";

import React, { useEffect, useState, useMemo } from "react";
import useStore from "@/store/store";
import StatusBadge from "@/components/StatusBadge/page";
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  ClipboardList,
  Star,
  MessageSquare,
  TrendingUp,
  Users,
  Activity,
  Stethoscope,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { ECG_WIDE, delay } from "@/lib/ui";
import { api } from "@/lib/api";
import { useEscape } from "@/lib/useEscape";

type Tab = "pending" | "approved" | "reviews" | "records";

/* Число плавно набирается, когда приходят данные */
const CountUp = ({ value }: { value: number }) => {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 900, 1);
      setShown(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <>{shown}</>;
};

/* Цвет полосы сверху кодирует статус записи */
const railColor = (status: string) =>
  status === "approved" ? "bg-md-secondary" : status === "rejected" ? "bg-md-error" : "bg-amber-400";

const Dashboard = () => {
  const {
    userById,
    getDoctorAppointments,
    doctorAppointments,
    appointmentsLoading,
    approveAppointment,
    rejectAppointment,
    updateAppointment,
  } = useStore((s) => s);

  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("pending");
  const [rejectModal, setRejectModal] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const closeRejectModal = () => {
    setRejectModal({ open: false, id: null });
    setRejectReason("");
  };
  useEscape(rejectModal.open, closeRejectModal);

  useEffect(() => {
    if (!userById?.id) return;
    if (tab === "pending" || tab === "approved") {
      getDoctorAppointments(tab);
    } else if (tab === "records") {
      setLoadingRecords(true);
      api.get("/medical-records")
        .then(({ data }) => setMedicalRecords(data))
        .catch(console.error)
        .finally(() => setLoadingRecords(false));
    }
  }, [userById?.id, tab]);

  const handleApprove = async (id: number) => {
    setActionLoading(true);
    const res = await approveAppointment(id);
    if (res.success) getDoctorAppointments(tab);
    setActionLoading(false);
  };

  // After the visit time the doctor records whether the patient came
  const handleOutcome = async (id: number, status: "completed" | "no_show") => {
    setActionLoading(true);
    const res = await updateAppointment(id, { status }, t(`status.${status}`));
    if (res.success) getDoctorAppointments(tab);
    setActionLoading(false);
  };

  const handleReject = async () => {
    if (!rejectModal.id || !rejectReason.trim()) return;
    setActionLoading(true);
    const res = await rejectAppointment(rejectModal.id, rejectReason);
    if (res.success) {
      getDoctorAppointments(tab);
      setRejectModal({ open: false, id: null });
      setRejectReason("");
    }
    setActionLoading(false);
  };

  const comments = userById?.comments || [];

  const avgRating = useMemo(() => {
    if (!comments.length) return 0;
    const sum = comments.reduce((acc: number, c: any) => acc + (c.rating || 0), 0);
    return (sum / comments.length).toFixed(1);
  }, [comments]);

  const rating5Count = comments.filter((c: any) => c.rating === 5).length;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "pending", label: t("dashboard.newRequests"), icon: <ClipboardList className="w-4 h-4" /> },
    { key: "approved", label: t("dashboard.mySchedule"), icon: <CheckCircle className="w-4 h-4" /> },
    { key: "reviews", label: t("dashboard.reviews"), icon: <MessageSquare className="w-4 h-4" /> },
    { key: "records", label: t("dashboard.records"), icon: <Activity className="w-4 h-4" /> },
  ];

  const heroStats = [
    { icon: <Users className="w-5 h-5" />, node: <CountUp value={doctorAppointments.filter((a: any) => a.status === "approved").length} />, label: t("dashboard.approvedCount") },
    { icon: <Star className="w-5 h-5" />, node: <>{avgRating}</>, label: t("dashboard.rating") },
    { icon: <MessageSquare className="w-5 h-5" />, node: <CountUp value={comments.length} />, label: t("dashboard.reviewsCount") },
  ];

  return (
    <div className="pt-20 pb-20 min-h-screen">

      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-6 mb-10 mt-4">
        <div className="relative overflow-hidden rounded-[2rem] bg-md-banner text-white px-8 py-12 md:px-14 md:py-16">
          <svg aria-hidden="true" viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-6 h-28 w-full text-white/25">
            <path d={ECG_WIDE} pathLength="1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" className="fx-draw" />
          </svg>

          <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="space-y-4 max-w-2xl">
              <p className="fx-rise inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold" style={delay("0.05s")}>
                <Stethoscope className="w-4 h-4" />
                {t("dashboard.badge")}
              </p>
              <h1 className="fx-rise font-headline font-black tracking-tight leading-[1.05] text-4xl md:text-6xl" style={delay("0.2s")}>
                {t("dashboard.title")}
              </h1>
              <p className="fx-rise text-md-on-banner-muted text-lg leading-relaxed" style={delay("0.4s")}>
                {t("dashboard.welcomeDoctor")},{" "}
                <span className="font-bold text-white">{userById?.fullName || t("auth.doctor")}</span>
                ! {t("dashboard.manageRequests")}
              </p>
            </div>

            <div className="fx-rise flex flex-wrap gap-x-10 gap-y-4 shrink-0" style={delay("0.6s")}>
              {heroStats.map((s, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2 text-white/75 mb-1">
                    {s.icon}
                    <span className="text-sm">{s.label}</span>
                  </div>
                  <div className="font-headline font-black text-5xl leading-none tabular-nums">{s.node}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Main ── */}
      <section className="max-w-7xl mx-auto px-6">
        {/* Tabs */}
        <div className="mb-10 -mx-6 px-6 overflow-x-auto">
          <div role="tablist" className="flex gap-1.5 p-1.5 bg-md-surface-container rounded-full w-fit">
            {tabs.map(({ key, label, icon }) => (
              <button
                key={key}
                role="tab"
                aria-selected={tab === key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-headline font-semibold text-sm whitespace-nowrap transition-all duration-300 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-md-primary ${
                  tab === key
                    ? "bg-md-primary text-white shadow-md shadow-md-primary/25"
                    : "text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container-high"
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── REVIEWS TAB ── */}
        {tab === "reviews" && (
          <div className="fx-fade">
            {comments.length === 0 ? (
              <EmptyState icon={<MessageSquare />} text={t("dashboard.noReviews")} />
            ) : (
              <>
                {/* Rating summary */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
                  <div className="lg:col-span-5 rounded-[2rem] bg-md-surface-container-low p-8 flex items-center gap-6">
                    <div className="h-16 w-16 shrink-0 rounded-3xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <Star className="w-8 h-8 text-amber-400" fill="currentColor" />
                    </div>
                    <div>
                      <div className="font-headline font-black text-6xl leading-none text-md-on-surface tabular-nums">{avgRating}</div>
                      <div className="mt-2 text-md-on-surface-variant">{t("dashboard.avgRating")}</div>
                      <div className="flex gap-0.5 mt-2">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            className={`w-4 h-4 ${n <= Math.round(Number(avgRating)) ? "text-amber-400" : "text-md-outline-variant"}`}
                            fill={n <= Math.round(Number(avgRating)) ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="rounded-[2rem] bg-md-surface-container-lowest clinical-shadow p-6 flex flex-col justify-between gap-6">
                      <div className="h-11 w-11 rounded-2xl bg-md-primary/10 text-md-primary flex items-center justify-center">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-headline font-black text-4xl text-md-on-surface tabular-nums">{comments.length}</div>
                        <div className="text-sm text-md-on-surface-variant">{t("dashboard.totalReviews")}</div>
                      </div>
                    </div>
                    <div className="rounded-[2rem] bg-md-surface-container-lowest clinical-shadow p-6 flex flex-col justify-between gap-6">
                      <div className="h-11 w-11 rounded-2xl bg-teal-100 dark:bg-teal-900/30 text-md-secondary flex items-center justify-center">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-headline font-black text-4xl text-md-on-surface tabular-nums">{rating5Count}</div>
                        <div className="text-sm text-md-on-surface-variant">{t("dashboard.fiveStarCount")}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating distribution */}
                <div className="rounded-[2rem] bg-md-surface-container-lowest clinical-shadow p-7 md:p-9 mb-10">
                  <h3 className="font-headline font-bold text-xl text-md-on-surface mb-6">
                    {t("dashboard.ratingDistribution")}
                  </h3>
                  <div className="space-y-4">
                    {[5, 4, 3, 2, 1].map((star, idx) => {
                      const count = comments.filter((c: any) => c.rating === star).length;
                      const pct = comments.length ? Math.round((count / comments.length) * 100) : 0;
                      return (
                        <div key={star} className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 shrink-0 w-12">
                            <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
                            <span className="text-sm font-semibold text-md-on-surface">{star}</span>
                          </div>
                          <div className="flex-1 bg-md-surface-container rounded-full h-3 overflow-hidden">
                            <div
                              className={`fx-grow h-full rounded-full ${star >= 4 ? "bg-md-primary" : star === 3 ? "bg-amber-400" : "bg-red-500"}`}
                              style={{ width: `${pct}%`, ...delay(`${0.1 + idx * 0.08}s`) }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-md-on-surface-variant w-8 text-right tabular-nums">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[...comments].reverse().map((c: any, i: number) => (
                    <article
                      key={c.id}
                      className="fx-rise rounded-[2rem] bg-md-surface-container-lowest clinical-shadow p-6 flex flex-col gap-4"
                      style={delay(`${Math.min(i, 8) * 0.06}s`)}
                    >
                      <div className="flex items-start gap-3">
                        {c.user?.image ? (
                          <img src={c.user.image} alt={c.user.fullName} className="w-11 h-11 rounded-full object-cover ring-4 ring-md-primary/10" />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-md-primary/10 flex items-center justify-center shrink-0">
                            <User className="w-5 h-5 text-md-primary" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-md-on-surface truncate">{c.user?.fullName || t("dashboard.anonymous")}</p>
                          <p className="text-xs text-md-on-surface-variant">{c.date}</p>
                        </div>
                        <div
                          className={`shrink-0 text-sm font-black px-3 py-1 rounded-full font-headline ${
                            c.rating >= 4
                              ? "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
                              : c.rating === 3
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                          }`}
                        >
                          ★ {c.rating}
                        </div>
                      </div>

                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star key={n} className={`w-4 h-4 ${n <= c.rating ? "text-amber-400" : "star-empty"}`} fill={n <= c.rating ? "currentColor" : "none"} />
                        ))}
                      </div>

                      {c.comment && <p className="text-md-on-surface leading-relaxed">{c.comment}</p>}
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── MEDICAL RECORDS TAB ── */}
        {tab === "records" && (
          <div className="fx-fade">
            <h3 className="font-headline text-3xl font-bold tracking-tight text-md-on-surface mb-8">
              {t("dashboard.medicalCardsTitle")}
            </h3>
            {loadingRecords ? (
              <div className="flex flex-col items-center justify-center py-24 rounded-[2rem] bg-md-surface-container-low">
                <Loader2 className="w-10 h-10 text-md-primary animate-spin mb-4" />
                <p className="text-md-on-surface-variant">{t("dashboard.loadingData")}</p>
              </div>
            ) : medicalRecords.length === 0 ? (
              <EmptyState icon={<ClipboardList />} text={t("dashboard.noRecords")} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {medicalRecords.map((record, i) => (
                  <article
                    key={record.id}
                    className="fx-rise rounded-[2rem] bg-md-surface-container-lowest clinical-shadow p-7 flex flex-col gap-5"
                    style={delay(`${Math.min(i, 8) * 0.07}s`)}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <p className="text-sm font-semibold text-md-primary mb-1">
                          {new Date(record.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                        <h4 className="font-headline font-bold text-lg text-md-on-surface flex items-center gap-2">
                          <User className="w-4 h-4 opacity-50" />
                          Пациент ID: {record.clientId}
                        </h4>
                      </div>
                      <span className="shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 text-xs font-bold">
                        {t("dashboard.recordBadge")}
                      </span>
                    </div>
                    <div className="grid gap-3">
                      <div className="rounded-2xl bg-md-surface-container-low px-5 py-4">
                        <p className="text-xs text-md-on-surface-variant mb-1">{t("dashboard.diagnosisLabel")}</p>
                        <p className="font-semibold text-md-on-surface leading-relaxed">{record.data.diagnosis || "—"}</p>
                      </div>
                      <div className="rounded-2xl bg-md-surface-container-low px-5 py-4">
                        <p className="text-xs text-md-on-surface-variant mb-1">{t("dashboard.treatmentLabel")}</p>
                        <p className="text-md-on-surface leading-relaxed">{record.data.treatment || "—"}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── APPOINTMENTS TABS ── */}
        {tab !== "reviews" && tab !== "records" && (
          <>
            {appointmentsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" role="status" aria-label={t("dashboard.loading")}>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-64 rounded-[2rem] bg-md-surface-container-low animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            ) : doctorAppointments.length === 0 ? (
              <EmptyState icon={<Calendar />} text={tab === "pending" ? t("dashboard.noNewRequests") : t("dashboard.noApproved")} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {doctorAppointments.map((apt: any, i: number) => (
                  <article
                    key={apt.id}
                    className="fx-rise relative overflow-hidden rounded-[2rem] bg-md-surface-container-lowest clinical-shadow p-6 pt-8 flex flex-col gap-5"
                    style={delay(`${Math.min(i, 8) * 0.07}s`)}
                  >
                    <span className={`absolute inset-x-0 top-0 h-2 ${railColor(apt.status)}`} aria-hidden="true" />

                    {/* Patient info */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-md-primary/10 text-md-primary flex items-center justify-center shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <h3 className="font-headline font-bold text-lg text-md-on-surface truncate">
                          {apt.clientName || t("dashboard.patient")}
                        </h3>
                        <StatusBadge status={apt.status} />
                      </div>
                    </div>

                    {/* Date / time */}
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full bg-md-surface-container px-4 py-2 text-sm font-medium text-md-on-surface">
                        <Calendar className="w-4 h-4 text-md-primary" />
                        {apt.date}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-md-surface-container px-4 py-2 text-sm font-medium text-md-on-surface">
                        <Clock className="w-4 h-4 text-md-primary" />
                        {apt.time}
                      </span>
                    </div>

                    {/* Symptoms */}
                    {apt.symptoms && (
                      <div className="rounded-2xl bg-md-surface-container-low px-5 py-4">
                        <p className="text-xs text-md-on-surface-variant mb-1">{t("dashboard.symptoms")}</p>
                        <p className="text-md-on-surface leading-relaxed">{apt.symptoms}</p>
                      </div>
                    )}

                    {/* Reject reason */}
                    {apt.status === "rejected" && apt.rejectReason && (
                      <div className="rounded-2xl bg-md-error-container/30 px-5 py-4">
                        <p className="text-xs font-semibold text-md-error mb-1">{t("dashboard.rejectReasonLabel")}</p>
                        <p className="text-md-on-surface">{apt.rejectReason}</p>
                      </div>
                    )}

                    {/* Actions */}
                    {tab === "pending" && (
                      <div className="flex gap-2 mt-auto pt-1">
                        <button
                          onClick={() => handleApprove(apt.id as number)}
                          disabled={actionLoading}
                          className="flex-1 bg-md-secondary text-white py-3 rounded-full text-sm font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-md-secondary"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {t("dashboard.approve")}
                        </button>
                        <button
                          onClick={() => setRejectModal({ open: true, id: apt.id as number })}
                          disabled={actionLoading}
                          className="flex-1 border-2 border-md-error/50 text-md-error py-3 rounded-full text-sm font-bold hover:bg-md-error-container/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-md-error"
                        >
                          {t("dashboard.reject")}
                        </button>
                      </div>
                    )}
                    {tab === "approved" && new Date(`${apt.date}T${apt.time}`) <= new Date() && (
                      <div className="flex gap-2 mt-auto pt-1">
                        <button
                          onClick={() => handleOutcome(apt.id as number, "completed")}
                          disabled={actionLoading}
                          className="flex-1 bg-md-secondary text-white py-3 rounded-full text-sm font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {t("desk.came")}
                        </button>
                        <button
                          onClick={() => handleOutcome(apt.id as number, "no_show")}
                          disabled={actionLoading}
                          className="flex-1 border-2 border-orange-400/60 text-orange-600 dark:text-orange-300 py-3 rounded-full text-sm font-bold hover:bg-orange-400/10 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {t("desk.noShow")}
                        </button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* ── Reject Modal ── */}
      {rejectModal.open && (
        <div className="fx-fade fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="reject-title" className="fx-modal rounded-[2rem] bg-md-surface-container-lowest p-8 w-full max-w-md shadow-2xl">
            <h3 id="reject-title" className="font-headline text-2xl font-bold text-md-on-surface mb-2">
              {t("dashboard.rejectReason")}
            </h3>
            <p className="text-md-on-surface-variant mb-6 leading-relaxed">{t("dashboard.rejectExplanation")}</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={t("dashboard.rejectPlaceholder")}
              className="w-full border border-md-outline-variant/50 rounded-2xl p-4 min-h-[120px] bg-md-surface-container text-md-on-surface resize-none mb-6 outline-none transition focus:border-md-error/50 focus:ring-2 ring-md-error/20"
              required
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={closeRejectModal}
                className="cursor-pointer rounded-full h-11 px-6"
              >
                {t("dashboard.cancel")}
              </Button>
              <Button
                onClick={handleReject}
                disabled={actionLoading || !rejectReason.trim()}
                className="bg-md-error hover:bg-md-error/90 text-white cursor-pointer disabled:opacity-50 rounded-full h-11 px-6"
              >
                {actionLoading ? t("dashboard.rejecting") : t("dashboard.reject")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const EmptyState = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="fx-fade rounded-[2rem] border-2 border-dashed border-md-surface-variant/40 px-8 py-16 flex flex-col items-center gap-5 text-center">
    <svg aria-hidden="true" viewBox="0 0 120 40" className="h-10 w-28 text-md-primary/40">
      <path d="M0 20 H44 L52 20 L58 6 L67 34 L74 20 H120" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div className="h-14 w-14 rounded-full bg-md-primary/10 text-md-primary flex items-center justify-center [&>svg]:w-6 [&>svg]:h-6">
      {icon}
    </div>
    <p className="text-md-on-surface-variant text-lg max-w-sm">{text}</p>
  </div>
);

export default Dashboard;