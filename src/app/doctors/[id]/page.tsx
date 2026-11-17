"use client";

import React, { use, useEffect, useState } from "react";
import { Phone, Stethoscope, MessageCircle, CalendarCheck, Star, Send, Clock, ShieldCheck, X } from "lucide-react";
import useStore from "@/store/store";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Comment } from "@/store/store";
import { useTranslation } from "@/lib/i18n";
import { api } from "@/lib/api";
import { useEscape } from "@/lib/useEscape";
import { WEEKDAYS_MON_FIRST, localDate } from "@/lib/schedule";
import SlotPicker from "@/components/SlotPicker/SlotPicker";
import { DefaultPhoto, ECG_WIDE, delay } from "@/lib/ui";

const Stars = ({ rating, className = "w-4 h-4" }: { rating: number; className?: string }) => (
  <div className="flex gap-0.5" aria-label={`${rating} / 5`}>
    {[...Array(5)].map((_, j) => (
      <Star key={j} className={`${className} ${j < rating ? "fill-amber-400 text-amber-400" : "text-md-outline-variant"}`} />
    ))}
  </div>
);

const labelCls = "block text-sm font-medium text-md-on-surface-variant mb-2 ml-1";
const fieldCls =
  "w-full bg-md-surface-container-low border border-transparent rounded-2xl px-4 py-3 text-md-on-surface outline-none transition focus:border-md-primary/50 focus:ring-2 ring-md-primary/20";

const DoctorById = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const {
    getDoctorById,
    doctorById,
    addComment,
    updateComment,
    deleteComment,
    userById,
    createAppointment,
  } = useStore((state) => state);

  const router = useRouter();
  const { t } = useTranslation();

  const [showFullNumber, setShowFullNumber] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [slotsReload, setSlotsReload] = useState(0);
  const [reviewable, setReviewable] = useState(false);
  const [symptoms, setSymptoms] = useState("");
  const [booking, setBooking] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [showDiplomaModal, setShowDiplomaModal] = useState(false);
  useEscape(showDiplomaModal, () => setShowDiplomaModal(false));

  // Older reviews have no userId and are matched by name
  const isOwnComment = (c: Comment) =>
    !!userById?.id && (c.userId != null ? c.userId === userById.id : c.user.fullName === userById.fullName);

  const handleUpdateComment = async (commentId: number) => {
    if (!editText.trim()) return;
    setSubmitting(true);
    const res = await updateComment(doctorById.id!, commentId, editText, editRating);
    if (res.success) setEditingCommentId(null);
    setSubmitting(false);
  };

  const handleDeleteComment = async (commentId: number) => {
    if (confirm(t("common.deleteConfirm"))) {
      await deleteComment(doctorById.id!, commentId);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userById?.id) {
      toast.error(t("doctor.loginToReview"));
      return;
    }
    if (!commentText.trim()) return;

    setSubmitting(true);
    const res = await addComment(doctorById.id!, rating, commentText);
    if (res.success) {
      setCommentText("");
      setRating(5);
    }
    setSubmitting(false);
  };

  const handleBook = async () => {
    if (!doctorById?.id) return;
    if (!userById?.id) { toast.error(t("doctor.loginToBook")); return; }
    if (!bookingDate || !bookingTime) { toast.error(t("doctor.selectDateTime")); return; }

    setBooking(true);
    // Slot availability is checked by the backend
    const res = await createAppointment({
      doctorId: doctorById.id,
      date: bookingDate,
      time: bookingTime,
      symptoms,
    });
    setBooking(false);

    if (res.success) router.push("/appointments");
    else {
      setBookingTime("");
      setSlotsReload((n) => n + 1);
    }
  };

  useEffect(() => {
    getDoctorById(id);
  }, [id]);

  useEffect(() => setBookingTime(""), [bookingDate]);

  // Reviews are accepted only after a completed visit that has no review yet
  useEffect(() => {
    setReviewable(false);
    if (userById?.role !== "client") return;
    api.get(`/doctors/${id}/reviewable`).then(({ data }) => setReviewable(data.length > 0)).catch(() => {});
  }, [id, userById?.role, doctorById.comments?.length]);

  const workDays = WEEKDAYS_MON_FIRST.filter((d) => doctorById.workingSchedule?.some((s) => s.day === d));

  return (
    <div className="bg-md-surface-container-low min-h-screen pt-20 pb-16">

      {/* Banner */}
      <header className="max-w-7xl mx-auto px-4 mt-4 mb-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-md-banner px-8 py-12 md:px-14 md:py-16">
          <svg aria-hidden="true" viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-4 h-24 w-full text-white/20">
            <path d={ECG_WIDE} pathLength="1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" className="fx-draw" />
          </svg>
          <div className="relative space-y-4">
            <p className="fx-rise inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white font-headline" style={delay("0.05s")}>
              <span className="fx-beat h-2 w-2 rounded-full bg-white" />
              {t("doctor.specialist")}
            </p>
            <h1 className="fx-rise text-white font-headline font-extrabold text-4xl md:text-6xl tracking-tight leading-[1.05]" style={delay("0.2s")}>
              {t("doctor.profile")}
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8 min-w-0">
          {doctorById && (
            <>
              {/* Doctor Info */}
              <section className="bg-md-surface-container-lowest rounded-[2rem] p-6 md:p-10 clinical-shadow">
                <div className="flex flex-col md:flex-row gap-10 items-start">
                  <div className="relative w-full max-w-xs mx-auto md:mx-0 md:w-56 shrink-0 pb-5">
                    <div className="fx-arch relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[1.5rem] shadow-xl">
                      <img className="absolute inset-0 w-full h-full object-cover" src={doctorById.image || DefaultPhoto} alt={doctorById.fullName || ""} />
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-md-surface-container-lowest px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg whitespace-nowrap">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-md-on-surface font-bold">{doctorById.rating}</span>
                      <span className="text-md-on-surface-variant text-xs">({doctorById.comments?.length || 0} {t("doctors.reviews")})</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-3">
                        <h2 className="text-3xl md:text-4xl font-headline font-extrabold tracking-tight text-md-on-surface leading-tight">{doctorById.fullName}</h2>
                        <p className="text-md-primary font-semibold flex items-center gap-2 text-lg">
                          <Stethoscope className="w-5 h-5" />
                          {doctorById.specialty ? t(doctorById.specialty) : ""}
                        </p>
                        {doctorById.diplomaVerified && (
                          <button
                            onClick={() => setShowDiplomaModal(true)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3.5 py-1.5 text-sm font-semibold cursor-pointer hover:scale-105 transition-transform"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            {t("doctor.verifiedDiploma")}
                          </button>
                        )}
                      </div>

                      {userById?.role === "client" && (
                        <button
                          onClick={() => router.push(`/chat?partnerId=${doctorById.id}`)}
                          className="flex items-center justify-center gap-2 bg-md-primary/10 text-md-primary hover:bg-md-primary hover:text-white px-6 py-3 rounded-full font-bold transition-all cursor-pointer hover:shadow-lg hover:shadow-md-primary/30 active:scale-95 shrink-0"
                        >
                          <MessageCircle className="w-5 h-5" />
                          {t("common.message")}
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="rounded-2xl bg-md-surface-container-low px-5 py-4">
                        <p className="text-sm text-md-on-surface-variant mb-1">{t("doctor.experience")}</p>
                        <p className="text-md-on-surface font-headline font-bold text-xl">{doctorById.experience} {t("doctor.years")}</p>
                      </div>
                      <div className="rounded-2xl bg-md-surface-container-low px-5 py-4">
                        <p className="text-sm text-md-on-surface-variant mb-1">{t("doctor.recommendation")}</p>
                        <p className="text-md-secondary font-headline font-bold text-xl">{doctorById.recommendation}%</p>
                      </div>
                      <div className="rounded-2xl bg-md-surface-container-low px-5 py-4 col-span-2 sm:col-span-1">
                        <p className="text-sm text-md-on-surface-variant mb-1">{t("doctor.clinic")}</p>
                        {doctorById.clinicId ? (
                          <Link href={`/clinics/${doctorById.clinicId}`} className="text-md-primary font-headline font-bold text-xl hover:underline">{doctorById.clinic}</Link>
                        ) : (
                          <p className="text-md-primary font-headline font-bold text-xl">{doctorById.clinic}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-headline font-bold text-xl text-md-on-surface">{t("doctor.aboutSpecialist")}</h3>
                      <p className="text-md-on-surface-variant leading-relaxed max-w-prose">{doctorById.bio}</p>
                    </div>

                    {doctorById.workingSchedule && doctorById.workingSchedule.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-md-primary/10 text-md-primary flex items-center justify-center">
                            <Clock className="w-4 h-4" />
                          </div>
                          <h3 className="font-headline font-bold text-xl text-md-on-surface">{t("profile.schedule")}</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {doctorById.workingSchedule.map((schedule: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center bg-md-surface-container-low px-5 py-3.5 rounded-full gap-3 transition-colors hover:bg-md-primary/10">
                              <span className="font-semibold text-md-on-surface">{schedule.day}</span>
                              <span className="text-sm font-bold text-md-primary tabular-nums">{schedule.startTime} {schedule.endTime}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Reviews */}
              <section id="reviews" className="scroll-mt-24 bg-md-surface-container-lowest rounded-[2rem] p-6 md:p-10 clinical-shadow">
                <h2 className="text-2xl md:text-3xl font-headline font-bold tracking-tight text-md-on-surface mb-8">{t("doctor.patientReviews")}</h2>

                <div className="space-y-4 mb-10">
                  {doctorById.comments?.map((c: Comment) => (
                    <article key={c.id} className="rounded-[1.5rem] bg-md-surface-container-low p-6 space-y-4">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex gap-4 items-center min-w-0">
                          <div className="w-12 h-12 shrink-0 rounded-full bg-md-primary/10 overflow-hidden">
                            <img src={c.user.image || DefaultPhoto} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-md-on-surface truncate">{c.user.fullName}</p>
                            <p className="text-md-on-surface-variant text-sm">{c.date}{c.edited && " (тағйир ёфт)"}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          {editingCommentId !== c.id && <Stars rating={c.rating} />}
                          {isOwnComment(c) && editingCommentId !== c.id && (
                            <div className="flex gap-3">
                              <button onClick={() => { setEditingCommentId(c.id); setEditText(c.comment); setEditRating(c.rating); }} className="text-sm font-semibold text-md-primary hover:underline cursor-pointer">{t("doctor.edit")}</button>
                              <button onClick={() => handleDeleteComment(c.id)} className="text-sm font-semibold text-red-500 hover:underline cursor-pointer">{t("doctor.delete")}</button>
                            </div>
                          )}
                        </div>
                      </div>

                      {editingCommentId === c.id ? (
                        <div className="space-y-3">
                          <select value={editRating} onChange={(e) => setEditRating(Number(e.target.value))} className={`${fieldCls} !w-auto !py-2 bg-md-surface-container-lowest`}>
                            {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} {t("doctor.stars")}</option>)}
                          </select>
                          <textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={3} className={`${fieldCls} bg-md-surface-container-lowest`} />
                          <div className="flex gap-2 justify-end">
                            <Button onClick={() => setEditingCommentId(null)} variant="ghost" className="h-10 rounded-full px-5 cursor-pointer">{t("doctor.cancel")}</Button>
                            <Button onClick={() => handleUpdateComment(c.id)} className="bg-md-primary hover:bg-md-primary/90 text-white h-10 rounded-full px-6 cursor-pointer">{t("doctor.save")}</Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-md-on-surface leading-relaxed">{c.comment}</p>
                      )}
                    </article>
                  ))}
                </div>

                {/* Write Review */}
                {userById?.role === "client" && !editingCommentId && !reviewable && (
                  <p className="rounded-[1.5rem] bg-md-surface-container-low px-6 py-4 text-sm text-md-on-surface-variant">{t("doctor.reviewAfterVisit")}</p>
                )}
                {reviewable && !editingCommentId && (
                  <div className="rounded-[1.5rem] border-2 border-dashed border-md-outline-variant/40 p-6 md:p-8">
                    <h3 className="font-headline font-bold text-xl mb-5 text-md-on-surface">{t("doctor.writeReview")}</h3>
                    <form onSubmit={handleSubmitComment} className="space-y-5">
                      <div className="md:max-w-xs">
                        <label className={labelCls}>{t("doctor.rating")}</label>
                        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className={fieldCls}>
                          <option value={5}>{t("doctor.star5")}</option>
                          <option value={4}>{t("doctor.star4")}</option>
                          <option value={3}>{t("doctor.star3")}</option>
                          <option value={2}>{t("doctor.star2")}</option>
                          <option value={1}>{t("doctor.star1")}</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>{t("doctor.yourComment")}</label>
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className={fieldCls}
                          placeholder={t("doctor.commentPlaceholder")}
                          rows={3}
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="group bg-md-primary text-white px-8 py-3.5 rounded-full font-headline font-bold shadow-lg shadow-md-primary/25 transition-all hover:shadow-xl active:scale-95 inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {submitting ? t("doctor.sending") : t("doctor.send")}
                        <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </form>
                  </div>
                )}
              </section>
            </>
          )}
        </div>

        {/* Booking Sidebar */}
        {doctorById && (
          <aside>
            <section className="bg-md-surface-container-lowest rounded-[2rem] shadow-[0_20px_60px_rgba(0,78,159,0.12)] lg:sticky lg:top-28 overflow-hidden">
              <div className="bg-md-primary text-white p-6 flex items-center gap-3">
                <CalendarCheck className="w-6 h-6" />
                <h2 className="text-xl font-headline font-bold">{t("doctor.bookAppointment")}</h2>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex justify-between items-end">
                  <p className="text-md-on-surface-variant font-medium">{t("doctor.consultCost")}</p>
                  <p className="text-3xl font-headline font-black text-md-on-surface">
                    {doctorById.price?.current} <span className="text-base font-bold opacity-70">{doctorById.price?.currency}</span>
                  </p>
                </div>

                <button
                  onClick={() => setShowFullNumber(true)}
                  className="w-full py-3.5 px-4 rounded-full border-2 border-md-primary/25 text-md-primary font-bold flex items-center justify-center gap-3 hover:bg-md-primary/5 transition-colors cursor-pointer"
                >
                  <Phone className="w-5 h-5" />
                  {showFullNumber ? doctorById.phone : t("doctor.showNumber")}
                </button>

                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>{t("doctor.selectDay")}</label>
                    <Input type="date" value={bookingDate} min={localDate()} onChange={(e) => setBookingDate(e.target.value)} className="rounded-2xl h-12" />
                    {workDays.length > 0 && (
                      <p className="text-xs text-md-on-surface-variant mt-2 ml-1">
                        {t("doctor.workDays")}: {workDays.map((d) => t(`day.${d}`)).join(", ")}
                      </p>
                    )}
                  </div>
                  {bookingDate && (
                    <div>
                      <p className={labelCls}>{t("doctor.selectTime")}</p>
                      <SlotPicker doctorId={id} date={bookingDate} value={bookingTime} onChange={setBookingTime} reloadKey={slotsReload} />
                    </div>
                  )}
                  <div>
                    <label className={labelCls}>{t("doctor.symptoms")}</label>
                    <textarea
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      className={fieldCls}
                      placeholder={t("doctor.symptomsPlaceholder")}
                      rows={2}
                    />
                  </div>
                  <button
                    disabled={booking}
                    onClick={handleBook}
                    className="w-full bg-md-primary text-white py-4 rounded-full font-headline font-extrabold shadow-lg shadow-md-primary/25 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {booking ? t("doctor.booking") : t("doctor.confirmBook")}
                  </button>
                </div>
              </div>

              <div className="bg-md-surface-container-low px-6 py-4 text-center">
                <p className="text-xs text-md-on-surface-variant/70 leading-relaxed">{t("doctor.consent")}</p>
              </div>
            </section>
          </aside>
        )}
      </div>

      {/* Diploma Modal */}
      {showDiplomaModal && doctorById?.diploma && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowDiplomaModal(false)}>
          <div
            role="dialog"
            aria-modal="true"
            className="fx-modal relative bg-md-surface-container-lowest rounded-[2rem] p-6 max-w-lg w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h3 className="font-headline font-bold text-lg text-md-on-surface">{t("doctor.verifiedDiploma")}</h3>
              </div>
              <button
                onClick={() => setShowDiplomaModal(false)}
                aria-label="Закрыть"
                className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-md-surface-container transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-md-on-surface-variant" />
              </button>
            </div>
            <img src={doctorById.diploma} alt="Diploma" className="w-full rounded-2xl object-contain max-h-[60vh]" />
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorById;