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
import Link from "next/link";

type Tab = "pending" | "approved" | "reviews" | "records";

const Dashboard = () => {
  const {
    loginMe,
    userById,
    getDoctorAppointments,
    doctorAppointments,
    appointmentsLoading,
    approveAppointment,
    rejectAppointment,
  } = useStore((s) => s);

  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("pending");
  const [rejectModal, setRejectModal] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loginMe();
  }, []);

  useEffect(() => {
    if (userById?.id && tab !== "reviews" && tab !== "records") {
      getDoctorAppointments(userById.id, tab);
    }
    if (userById?.id && tab === "records") {
      setLoadingRecords(true);
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/medical-records?doctorId=${userById.id}`)
        .then(res => res.json())
        .then(data => setMedicalRecords(data))
        .finally(() => setLoadingRecords(false));
    }
  }, [userById, tab]);

  const handleApprove = async (id: number) => {
    setActionLoading(true);
    const res = await approveAppointment(id);
    if (res.success) getDoctorAppointments(userById.id!, tab as "pending" | "approved");
    setActionLoading(false);
  };

  const handleReject = async () => {
    if (!rejectModal.id || !rejectReason.trim()) return;
    setActionLoading(true);
    const res = await rejectAppointment(rejectModal.id, rejectReason);
    if (res.success) {
      getDoctorAppointments(userById.id!, tab as "pending" | "approved");
      setRejectModal({ open: false, id: null });
      setRejectReason("");
    }
    setActionLoading(false);
  };

  const comments = (userById as any)?.comments || [];

  const avgRating = useMemo(() => {
    if (!comments.length) return 0;
    const sum = comments.reduce((acc: number, c: any) => acc + (c.rating || 0), 0);
    return (sum / comments.length).toFixed(1);
  }, [comments]);

  const rating5Count = comments.filter((c: any) => c.rating === 5).length;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    {
      key: "pending",
      label: t("dashboard.newRequests"),
      icon: <ClipboardList className="w-4 h-4" />,
    },
    {
      key: "approved",
      label: t("dashboard.mySchedule"),
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      key: "reviews",
      label: "Мои отзывы",
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      key: "records",
      label: "Медкарты",
      icon: <Activity className="w-4 h-4" />,
    },
  ];

  return (
    <div className="pt-20 pb-16 min-h-screen">
      {/* ── Hero Banner ── */}
      <section className="max-w-7xl mx-auto px-6 mb-10 mt-4">
        <div className="relative overflow-hidden rounded-2xl bg-[#00A191] text-white p-8 md:p-12">
          {/* Glow effects for volume */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#00C4B0] rounded-full blur-[120px]"></div>
            <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-[#007D70] rounded-full blur-[120px]"></div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="bg-white/15 backdrop-blur-md p-2.5 rounded-xl border border-white/20">
                  <Stethoscope className="w-5 h-5" />
                </span>
                <span className="text-[#A7F3EB] font-semibold tracking-widest text-xs uppercase">
                  {t("dashboard.badge")}
                </span>
              </div>
              <h1 className="font-headline font-black text-3xl md:text-4xl lg:text-5xl leading-tight text-white">
                {t("dashboard.title")}
              </h1>
              <p className="text-[#A7F3EB]/80 text-base max-w-lg leading-relaxed font-light">
                {t("dashboard.welcomeDoctor")},{" "}
                <span className="font-bold text-white">
                  {userById?.fullName || t("auth.doctor")}
                </span>
                ! {t("dashboard.manageRequests")}
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex gap-4 shrink-0">
              {[
                {
                  icon: <Users className="w-5 h-5" />,
                  val: doctorAppointments.filter((a: any) => a.status === "approved").length,
                  label: "Принятых",
                },
                {
                  icon: <Star className="w-5 h-5" />,
                  val: avgRating,
                  label: "Рейтинг",
                },
                {
                  icon: <MessageSquare className="w-5 h-5" />,
                  val: comments.length,
                  label: "Отзывов",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-center min-w-[80px]"
                >
                  <div className="text-white/70 mb-1 flex justify-center">{s.icon}</div>
                  <div className="font-headline font-black text-xl text-white">{s.val}</div>
                  <div className="text-[#A7F3EB] text-[10px] font-medium mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Main ── */}
      <section className="max-w-7xl mx-auto px-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1.5 bg-md-surface-container rounded-2xl w-fit">
          {tabs.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-headline font-semibold text-sm transition-all duration-200 cursor-pointer ${
                tab === key
                  ? "tab-active text-white shadow-md"
                  : "text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container-high"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* ── REVIEWS TAB ── */}
        {tab === "reviews" && (
          <div className="animate-fade-in-scale">
            {comments.length === 0 ? (
              <EmptyState icon={<MessageSquare />} text="У вас пока нет отзывов" />
            ) : (
              <>
                {/* Rating summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="premium-card rounded-2xl p-6 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                      <Star className="w-7 h-7 text-amber-400" fill="currentColor" />
                    </div>
                    <div>
                      <div className="text-3xl font-headline font-black text-md-on-surface">
                        {avgRating}
                      </div>
                      <div className="text-md-on-surface-variant text-sm">Средний рейтинг</div>
                      <div className="flex gap-0.5 mt-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            className={`w-3.5 h-3.5 ${n <= Math.round(Number(avgRating)) ? "text-amber-400" : "text-md-outline-variant"}`}
                            fill={n <= Math.round(Number(avgRating)) ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="premium-card rounded-2xl p-6 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-[#0A2342]/40 flex items-center justify-center">
                      <MessageSquare className="w-7 h-7 text-md-primary" />
                    </div>
                    <div>
                      <div className="text-3xl font-headline font-black text-md-on-surface">
                        {comments.length}
                      </div>
                      <div className="text-md-on-surface-variant text-sm">Всего отзывов</div>
                    </div>
                  </div>

                  <div className="premium-card rounded-2xl p-6 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center">
                      <TrendingUp className="w-7 h-7 text-md-secondary" />
                    </div>
                    <div>
                      <div className="text-3xl font-headline font-black text-md-on-surface">
                        {rating5Count}
                      </div>
                      <div className="text-md-on-surface-variant text-sm">Оценок «5 звёзд»</div>
                    </div>
                  </div>
                </div>

                {/* Rating distribution */}
                <div className="premium-card rounded-2xl p-6 mb-8">
                  <h3 className="font-headline font-bold text-md-on-surface mb-5 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-md-primary" />
                    Распределение оценок
                  </h3>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = comments.filter((c: any) => c.rating === star).length;
                      const pct = comments.length ? Math.round((count / comments.length) * 100) : 0;
                      return (
                        <div key={star} className="flex items-center gap-3">
                          <div className="flex items-center gap-1 shrink-0 w-16">
                            <Star className="w-3.5 h-3.5 text-amber-400" fill="currentColor" />
                            <span className="text-sm font-medium text-md-on-surface">{star}</span>
                          </div>
                          <div className="flex-1 bg-md-surface-container rounded-full h-2.5 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700 ease-out"
                              style={{
                                width: `${pct}%`,
                                background:
                                  star >= 4
                                    ? "linear-gradient(90deg, #0D9488, #2DD4BF)"
                                    : star === 3
                                    ? "linear-gradient(90deg, #F59E0B, #FBBF24)"
                                    : "linear-gradient(90deg, #DC2626, #F87171)",
                              }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-md-on-surface-variant w-8 text-right">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[...comments].reverse().map((c: any) => (
                    <div key={c.id} className="premium-card rounded-2xl p-5 space-y-4">
                      <div className="flex items-start gap-3">
                        {c.user?.image ? (
                          <img
                            src={c.user.image}
                            alt={c.user.fullName}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-md-primary/20"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-md-primary/10 flex items-center justify-center shrink-0">
                            <User className="w-5 h-5 text-md-primary" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-md-on-surface text-sm truncate">
                            {c.user?.fullName || "Аноним"}
                          </p>
                          <p className="text-xs text-md-on-surface-variant">{c.date}</p>
                        </div>
                        <div
                          className={`shrink-0 text-xs font-black px-2.5 py-1 rounded-full font-headline ${
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
                          <Star
                            key={n}
                            className={`w-4 h-4 ${n <= c.rating ? "text-amber-400" : "star-empty"}`}
                            fill={n <= c.rating ? "currentColor" : "none"}
                          />
                        ))}
                      </div>

                      {c.comment && (
                        <p className="text-sm text-md-on-surface leading-relaxed border-l-2 border-md-primary/30 pl-3">
                          {c.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── MEDICAL CARDS TAB ── */}
        {tab === "records" && (
          <div className="animate-fade-in-scale">
            <h3 className="font-headline text-2xl font-bold text-md-on-surface mb-8 flex items-center gap-3">
              <Activity className="w-7 h-7 text-md-primary" />
              Медицинские карты
            </h3>
            {loadingRecords ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-md-surface-container-lowest rounded-3xl border border-md-outline/10">
                <Loader2 className="w-12 h-12 text-md-primary animate-spin mb-4" />
                <p className="text-md-on-surface-variant font-medium">Загрузка данных...</p>
              </div>
            ) : medicalRecords.length === 0 ? (
              <div className="text-center py-24 bg-white dark:bg-md-surface-container-lowest rounded-3xl border border-md-outline/10 border-dashed">
                <ClipboardList className="w-12 h-12 text-md-outline mx-auto mb-4 opacity-20" />
                <p className="text-md-on-surface-variant italic font-medium">У вас пока нет созданных медкарты</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {medicalRecords.map((record) => (
                  <div key={record.id} className="bg-white dark:bg-md-surface-container-lowest border border-md-outline/10 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-xs font-bold text-md-primary uppercase tracking-widest mb-1">
                          {new Date(record.createdAt).toLocaleDateString("ru-RU", { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        <h4 className="font-bold text-md-on-surface flex items-center gap-2">
                          <User className="w-4 h-4 opacity-50" />
                          Пациент ID: {record.clientId}
                        </h4>
                      </div>
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Медкарта
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-4 bg-md-surface-container-low rounded-2xl border border-md-outline/5">
                        <p className="text-[10px] font-bold text-md-on-surface-variant uppercase mb-1 tracking-widest">Диагноз</p>
                        <p className="text-sm font-semibold text-md-on-surface leading-relaxed">{record.data.diagnosis || "—"}</p>
                      </div>
                      <div className="p-4 bg-md-surface-container-low rounded-2xl border border-md-outline/5">
                        <p className="text-[10px] font-bold text-md-on-surface-variant uppercase mb-1 tracking-widest">Лечение</p>
                        <p className="text-sm text-md-on-surface leading-relaxed">{record.data.treatment || "—"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── APPOINTMENTS TABS ── */}
        {tab !== "reviews" && tab !== "records" && (
          <>
            {appointmentsLoading ? (
              <div className="flex justify-center py-24">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-md-primary/20 border-t-md-primary animate-spin" />
                  <span className="text-sm text-md-on-surface-variant">Загрузка...</span>
                </div>
              </div>
            ) : doctorAppointments.length === 0 ? (
              <EmptyState
                icon={<Calendar />}
                text={tab === "pending" ? t("dashboard.noNewRequests") : t("dashboard.noApproved")}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in-scale">
                {doctorAppointments.map((apt: any) => (
                  <div key={apt.id} className="premium-card rounded-2xl overflow-hidden">
                    {/* Card top accent */}
                    <div
                      className={`h-1 w-full ${
                        apt.status === "approved"
                          ? "bg-gradient-to-r from-md-secondary to-teal-400"
                          : apt.status === "rejected"
                          ? "bg-gradient-to-r from-md-error to-red-400"
                          : "bg-gradient-to-r from-amber-400 to-orange-400"
                      }`}
                    />

                    <div className="p-5 space-y-4">
                      {/* Patient info */}
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-md-primary/10 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-md-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-headline font-bold text-md-on-surface truncate">
                            {apt.clientName || t("dashboard.patient")}
                          </h3>
                          <StatusBadge status={apt.status} />
                        </div>
                      </div>

                      {/* Meta info */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-md-surface-container rounded-xl p-3 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-md-primary shrink-0" />
                          <span className="text-xs font-semibold text-md-on-surface">{apt.date}</span>
                        </div>
                        <div className="bg-md-surface-container rounded-xl p-3 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-md-secondary shrink-0" />
                          <span className="text-xs font-semibold text-md-on-surface">{apt.time}</span>
                        </div>
                      </div>

                      {/* Symptoms */}
                      {apt.symptoms && (
                        <div className="bg-md-surface-container-low rounded-xl p-3 border-l-2 border-md-primary/40">
                          <p className="text-[10px] font-black text-md-outline uppercase tracking-widest mb-1">
                            {t("dashboard.symptoms")}
                          </p>
                          <p className="text-sm text-md-on-surface leading-relaxed">{apt.symptoms}</p>
                        </div>
                      )}

                      {/* Reject reason */}
                      {apt.status === "rejected" && apt.rejectReason && (
                        <div className="bg-md-error-container/30 rounded-xl p-3 border-l-2 border-md-error/50">
                          <p className="text-[10px] font-black text-md-error uppercase tracking-widest mb-1">
                            Причина отказа
                          </p>
                          <p className="text-sm text-md-on-surface">{apt.rejectReason}</p>
                        </div>
                      )}

                      {/* Actions */}
                      {tab === "pending" && (
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => handleApprove(apt.id as number)}
                            disabled={actionLoading}
                            className="flex-1 bg-md-secondary text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            {t("dashboard.approve")}
                          </button>
                          <button
                            onClick={() => setRejectModal({ open: true, id: apt.id as number })}
                            disabled={actionLoading}
                            className="flex-1 border border-md-error/60 text-md-error py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-md-error-container/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                          >
                            {t("dashboard.reject")}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* ── Reject Modal ── */}
      {rejectModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-scale">
          <div className="premium-card rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-headline text-lg font-bold text-md-on-surface mb-1">
              {t("dashboard.rejectReason")}
            </h3>
            <p className="text-sm text-md-on-surface-variant mb-5">
              Объясните пациенту причину отказа
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={t("dashboard.rejectPlaceholder")}
              className="w-full border border-md-outline-variant/50 rounded-xl p-4 min-h-[110px] focus:outline-none bg-md-surface-container text-md-on-surface text-sm resize-none mb-4"
              required
            />
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => { setRejectModal({ open: false, id: null }); setRejectReason(""); }}
                className="cursor-pointer rounded-xl"
              >
                {t("dashboard.cancel")}
              </Button>
              <Button
                onClick={handleReject}
                disabled={actionLoading || !rejectReason.trim()}
                className="bg-md-error hover:bg-md-error/90 text-white cursor-pointer disabled:opacity-50 rounded-xl"
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
  <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-in-scale">
    <div className="w-20 h-20 rounded-2xl bg-md-surface-container flex items-center justify-center text-md-on-surface-variant [&>svg]:w-9 [&>svg]:h-9">
      {icon}
    </div>
    <p className="text-md-on-surface-variant font-medium text-center max-w-xs">{text}</p>
  </div>
);

export default Dashboard;
