"use client";

import React, { useEffect, useState } from "react";
import useStore from "@/store/store";
import StatusBadge from "@/components/StatusBadge/page";
import {
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Stethoscope,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const [tab, setTab] = useState<"pending" | "approved">("pending");
  const [rejectModal, setRejectModal] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loginMe();
  }, []);

  useEffect(() => {
    if (userById?.id) getDoctorAppointments(userById.id, tab);
  }, [userById, tab]);

  const handleApprove = async (id: number) => {
    setActionLoading(true);
    const res = await approveAppointment(id);
    if (res.success) getDoctorAppointments(userById.id!, tab);
    setActionLoading(false);
  };

  const handleReject = async () => {
    if (!rejectModal.id || !rejectReason.trim()) return;
    setActionLoading(true);
    const res = await rejectAppointment(rejectModal.id, rejectReason);
    if (res.success) {
      getDoctorAppointments(userById.id!, tab);
      setRejectModal({ open: false, id: null });
      setRejectReason("");
    }
    setActionLoading(false);
  };

  return (
    <div className="pt-20 pb-12">
      {/* Hero Banner */}
      <section className="max-w-7xl mx-auto px-6 mb-12 mt-4">
        <div className="signature-gradient rounded-xl p-8 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                <Stethoscope className="w-5 h-5" />
              </span>
              <span className="text-blue-100 font-medium tracking-widest text-sm uppercase font-headline">Панели идоракунӣ</span>
            </div>
            <h1 className="font-headline font-extrabold text-4xl md:text-5xl leading-tight">
              Панели духтур
            </h1>
            <p className="text-blue-50/80 text-lg max-w-md">
              Хуш омадед, {userById?.fullName || "Духтур"}! Дархостҳои навро идора кунед.
            </p>
          </div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-md-secondary-fixed opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute -top-10 left-1/2 w-48 h-48 bg-md-primary-container opacity-20 rounded-full blur-2xl"></div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="max-w-7xl mx-auto px-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-10 p-1 bg-md-surface-container-low rounded-full w-fit">
          <button
            onClick={() => setTab("pending")}
            className={`px-8 py-3 rounded-full font-headline font-bold text-sm transition-all cursor-pointer ${
              tab === "pending"
                ? "bg-md-secondary text-white clinical-shadow"
                : "text-md-on-surface-variant hover:bg-md-surface-container-high"
            }`}
          >
            <ClipboardList className="w-4 h-4 inline mr-2" />
            Дархостҳои нав
          </button>
          <button
            onClick={() => setTab("approved")}
            className={`px-8 py-3 rounded-full font-headline font-bold text-sm transition-all cursor-pointer ${
              tab === "approved"
                ? "bg-md-secondary text-white clinical-shadow"
                : "text-md-on-surface-variant hover:bg-md-surface-container-high"
            }`}
          >
            <CheckCircle className="w-4 h-4 inline mr-2" />
            Рӯзномаи ман
          </button>
        </div>

        {/* Content */}
        {appointmentsLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-md-primary" />
          </div>
        ) : doctorAppointments.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-md-surface-container-low rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-md-on-surface-variant" />
            </div>
            <h3 className="text-xl font-semibold text-md-on-surface font-headline">
              {tab === "pending" ? "Дархости нав нест" : "Навбати тасдиқшуда нест"}
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctorAppointments.map((apt: any) => (
              <div
                key={apt.id}
                className="bg-md-surface-container-lowest p-6 rounded-lg clinical-shadow border border-md-outline-variant/10 hover:translate-y-[-4px] transition-transform duration-300"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-md-primary/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-md-primary" />
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-md-on-surface">{apt.clientName || "Бемор"}</h3>
                      <StatusBadge status={apt.status} />
                    </div>
                  </div>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-md-on-surface-variant">
                    <Calendar size={16} className="text-md-primary" />
                    <span className="text-sm font-medium">{apt.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-md-on-surface-variant">
                    <Clock size={16} className="text-md-primary" />
                    <span className="text-sm font-medium">{apt.time}</span>
                  </div>
                  {apt.symptoms && (
                    <div className="pt-4 border-t border-md-outline-variant/10">
                      <p className="text-xs text-md-outline mb-1 uppercase font-bold tracking-tighter">Аломатҳо</p>
                      <p className="text-sm text-md-on-surface leading-relaxed">{apt.symptoms}</p>
                    </div>
                  )}
                </div>

                {tab === "pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(apt.id as number)}
                      disabled={actionLoading}
                      className="flex-1 bg-md-secondary text-white py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      Тасдиқ кардан
                    </button>
                    <button
                      onClick={() => setRejectModal({ open: true, id: apt.id as number })}
                      disabled={actionLoading}
                      className="flex-1 border-2 border-md-error text-md-error py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-md-error-container/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      Рад кардан
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Reject Modal */}
        {rejectModal.open && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
              <h3 className="text-lg font-bold text-md-on-surface mb-4 font-headline">Сабаби рад кардан</h3>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Сабаби рад кардани навбатро нависед..."
                className="w-full border border-md-outline-variant rounded-lg p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-md-error mb-4"
                required
              />
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => { setRejectModal({ open: false, id: null }); setRejectReason(""); }}
                  className="cursor-pointer"
                >
                  Бекор кардан
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={actionLoading || !rejectReason.trim()}
                  className="bg-md-error hover:bg-md-error/90 text-white cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? "Дар ҳоли ирсол..." : "Рад кардан"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
