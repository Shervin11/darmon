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
  ChevronDown,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";

type Tab = "pending" | "approved" | "reviews";

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

  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("pending");
  const [rejectModal, setRejectModal] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loginMe();
  }, []);

  useEffect(() => {
    if (userById?.id && tab !== "reviews") {
      getDoctorAppointments(userById.id, tab);
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
  ];

  return (
    <div className="pt-20 pb-16 min-h-screen">
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

      <section className="max-w-7xl mx-auto px-6">
        {tab === "reviews" && (
          <div className="animate-fade-in-scale">
            {comments.length === 0 ? (
              <EmptyState icon={<MessageSquare />} text="У вас пока нет отзывов" />
            ) : (
              <>
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

        {tab !== "reviews" && (
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

                      {apt.symptoms && (
                        <div className="bg-md-surface-container-low rounded-xl p-3 border-l-2 border-md-primary/40">
                          <p className="text-[10px] font-black text-md-outline uppercase tracking-widest mb-1">
                            {t("dashboard.symptoms")}
                          </p>
                          <p className="text-sm text-md-on-surface leading-relaxed">{apt.symptoms}</p>
                        </div>
                      )}

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

