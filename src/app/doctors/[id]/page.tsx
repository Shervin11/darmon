"use client";

import React, { use, useEffect, useState } from "react";
import { Phone, Stethoscope, MessageCircle, CalendarCheck, Star, Send, Clock } from "lucide-react";
import useStore from "@/store/store";
import FixedRating from "@/components/StarRating/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { DefaultPhoto } from "@/config/config";
import { Comment } from "@/store/store";
import { useTranslation } from "@/lib/i18n";

const DoctorById = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const {
    getDoctorById,
    doctorById,
    addComment,
    updateComment,
    deleteComment,
    userById,
    loginMe,
    createAppointment,
    checkSlotAvailability,
  } = useStore((state) => state);

  const router = useRouter();
  const { t } = useTranslation();

  const [showFullNumber, setShowFullNumber] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [booking, setBooking] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(5);

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
    const newComment = {
      id: Date.now(),
      user: {
        fullName: userById.fullName || "",
        image: userById.image || "/logo1.png",
      },
      rating,
      comment: commentText,
      date: new Date().toLocaleDateString("ru-RU"),
    };

    const res = await addComment(doctorById.id!, newComment, doctorById.comments);
    if (res.success) {
      setCommentText("");
      setRating(5);
    }
    setSubmitting(false);
  };

  const handleShowNumber = () => {
    setShowFullNumber(true);
  };

  useEffect(() => {
    getDoctorById(id);
    loginMe();
  }, [id]);

  return (
    <div className="bg-md-surface-container-low min-h-screen pt-20 pb-12">
      {/* Banner */}
      <header className="relative bg-[#00A191] pt-20 pb-28 px-6 overflow-hidden mb-8 mt-4 md:rounded-xl md:mx-auto md:max-w-7xl">
        {/* Glow effects for volume */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#00C4B0] rounded-full blur-[120px]"></div>
          <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-[#007D70] rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="text-[#A7F3EB] font-headline font-semibold tracking-widest uppercase text-sm mb-2 block">{t("doctor.specialist")}</span>
          <h1 className="text-white font-headline font-extrabold text-4xl md:text-5xl tracking-tight">{t("doctor.profile")}</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {doctorById && (
            <>
              {/* Doctor Info */}
              <section className="bg-md-surface-container-lowest rounded-xl p-6 md:p-8 clinical-shadow">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="relative w-full md:w-56 shrink-0">
                    <img className="w-full h-64 object-cover rounded-xl shadow-lg" src={doctorById.image || DefaultPhoto} alt={doctorById.fullName || ""} />
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-md-secondary-container px-4 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Star className="w-4 h-4 fill-md-secondary text-md-on-secondary-container" />
                      <span className="text-md-on-secondary-container font-bold">{doctorById.rating}</span>
                      <span className="text-md-on-secondary-container/70 text-xs font-medium ml-1">({doctorById.comments?.length || 0} {t("doctors.reviews")})</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-6">
                    <div>
                      <h2 className="text-3xl font-headline font-bold text-md-on-surface mb-2">{doctorById.fullName}</h2>
                      <p className="text-md-primary font-semibold tracking-wide flex items-center gap-2">
                        <Stethoscope className="w-5 h-5" />
                        {doctorById.specialty}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-y border-md-surface-variant/30 py-6">
                      <div className="space-y-1">
                        <p className="text-md-on-surface-variant text-xs uppercase tracking-wider font-bold">{t("doctor.experience")}</p>
                        <p className="text-md-on-surface font-semibold text-lg">{doctorById.experience} {t("doctor.years")}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-md-on-surface-variant text-xs uppercase tracking-wider font-bold">{t("doctor.recommendation")}</p>
                        <p className="text-md-secondary font-bold text-lg">{doctorById.recommendation}%</p>
                      </div>
                      <div className="space-y-1 col-span-2 sm:col-span-1">
                        <p className="text-md-on-surface-variant text-xs uppercase tracking-wider font-bold">{t("doctor.clinic")}</p>
                        <p className="text-md-primary-container font-semibold">{doctorById.clinic}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-headline font-bold text-lg text-md-on-surface">{t("doctor.aboutSpecialist")}</h3>
                      <p className="text-md-on-surface-variant leading-relaxed">{doctorById.bio}</p>
                    </div>

                    {doctorById.workingSchedule && doctorById.workingSchedule.length > 0 && (
                      <div className="pt-6 border-t border-md-surface-variant/30 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-[#0A2342]/50 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-[#00A896]" />
                          </div>
                          <h3 className="font-headline font-bold text-lg text-md-on-surface">{t("profile.schedule")}</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {doctorById.workingSchedule.map((schedule: any, idx: number) => (
                            <div key={idx} className="flex justify-between flex-row items-center bg-md-surface-container-low p-3 rounded-xl border gap-3 border-md-outline-variant/30 hover:border-[#00A896]/30 transition-colors">
                              <span className="font-bold text-md-on-surface">{schedule.day}</span>
                              <div className="bg-[#00A896]/10 px-2 py-1 rounded-lg">
                                <span className="text-xs font-bold text-[#00A896]">{schedule.startTime} {schedule.endTime}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Reviews */}
              <section className="bg-md-surface-container-lowest rounded-xl p-6 md:p-8 clinical-shadow">
                <div className="flex items-center gap-3 mb-8">
                  <MessageCircle className="w-8 h-8 text-md-primary" />
                  <h2 className="text-2xl font-headline font-bold text-md-on-surface">{t("doctor.patientReviews")}</h2>
                </div>
                <div className="space-y-8 mb-12">
                  {doctorById.comments?.map((c: Comment) => (
                    <div key={c.id} className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4 items-center">
                          <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-[#0A2342]/50 flex items-center justify-center overflow-hidden">
                            <img src={c.user.image || DefaultPhoto} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-md-on-surface">{c.user.fullName}</p>
                            <p className="text-md-on-surface-variant text-xs">{c.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {userById?.fullName === c.user.fullName && editingCommentId !== c.id && (
                            <div className="flex gap-2">
                              <button onClick={() => { setEditingCommentId(c.id); setEditText(c.comment); setEditRating(c.rating); }} className="text-[10px] font-bold text-[#00A896] hover:underline cursor-pointer">{t("doctor.edit")}</button>
                              <button onClick={() => handleDeleteComment(c.id)} className="text-[10px] font-bold text-red-500 hover:underline cursor-pointer">{t("doctor.delete")}</button>
                            </div>
                          )}
                          {editingCommentId !== c.id && (
                            <div className="flex text-md-secondary-container">
                              {[...Array(5)].map((_, j) => <Star key={j} className={`w-4 h-4 ${j < c.rating ? "fill-md-secondary" : ""}`} />)}
                            </div>
                          )}
                        </div>
                      </div>
                      {editingCommentId === c.id ? (
                        <div className="space-y-3">
                          <select value={editRating} onChange={(e) => setEditRating(Number(e.target.value))} className="text-xs border rounded p-1 bg-md-surface-container-low text-md-on-surface">
                            {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} {t("doctor.stars")}</option>)}
                          </select>
                          <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full p-3 border rounded-xl text-sm focus:ring-2 ring-md-primary outline-none bg-md-surface-container-low text-md-on-surface" />
                          <div className="flex gap-2 justify-end">
                            <Button onClick={() => setEditingCommentId(null)} variant="ghost" className="h-8 text-xs cursor-pointer">{t("doctor.cancel")}</Button>
                            <Button onClick={() => handleUpdateComment(c.id)} className="bg-md-secondary-container text-md-on-secondary-container h-8 text-xs cursor-pointer">{t("doctor.save")}</Button>
                          </div>
                        </div>
                      ) : (
                        <blockquote className="text-md-on-surface-variant italic pl-4 border-l-4 border-md-secondary/20">
                          &ldquo;{c.comment}&rdquo;
                        </blockquote>
                      )}
                    </div>
                  ))}
                </div>

                {/* Write Review */}
                {userById?.id && !editingCommentId && (
                  <div className="bg-md-surface-container-low rounded-xl p-6">
                    <h3 className="font-headline font-bold text-lg mb-4 text-md-on-surface">{t("doctor.writeReview")}</h3>
                    <form onSubmit={handleSubmitComment} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-md-on-surface-variant uppercase tracking-wider mb-1 ml-2">{t("doctor.rating")}</label>
                          <select
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            className="w-full bg-md-surface-container-lowest border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-md-primary text-md-on-surface"
                          >
                            <option value={5}>{t("doctor.star5")}</option>
                            <option value={4}>{t("doctor.star4")}</option>
                            <option value={3}>{t("doctor.star3")}</option>
                            <option value={2}>{t("doctor.star2")}</option>
                            <option value={1}>{t("doctor.star1")}</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-md-on-surface-variant uppercase tracking-wider mb-1 ml-2">{t("doctor.yourComment")}</label>
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="w-full bg-md-surface-container-lowest border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-md-primary text-md-on-surface"
                          placeholder={t("doctor.commentPlaceholder")}
                          rows={3}
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="bg-md-secondary-container text-md-on-secondary-container px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:translate-x-1 transition-transform inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {submitting ? t("doctor.sending") : t("doctor.send")}
                        <Send className="w-4 h-4" />
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
          <aside className="space-y-6">
            <section className="bg-md-surface-container-lowest rounded-xl shadow-[0_20px_60px_rgba(0,78,159,0.12)] sticky top-28 overflow-hidden border-2 border-md-primary/5">
              <div className="bg-md-primary/5 p-6 flex items-center gap-3 border-b border-md-surface-variant/20">
                <CalendarCheck className="w-6 h-6 text-md-primary" />
                <h2 className="text-xl font-headline font-bold text-md-primary">{t("doctor.bookAppointment")}</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-end">
                  <p className="text-md-on-surface-variant text-sm font-medium">{t("doctor.consultCost")}</p>
                  <p className="text-2xl font-black text-md-on-surface">{doctorById.price?.current} <span className="text-sm font-bold opacity-70">{doctorById.price?.currency}</span></p>
                </div>
                <button
                  onClick={handleShowNumber}
                  className="w-full py-3 px-4 rounded-xl border-2 border-md-primary/20 text-md-primary font-bold flex items-center justify-center gap-3 hover:bg-md-primary/5 transition-colors cursor-pointer"
                >
                  <Phone className="w-5 h-5" />
                  {showFullNumber ? doctorById.phone : t("doctor.showNumber")}
                </button>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-md-on-surface-variant uppercase tracking-wider mb-2 ml-1">{t("doctor.selectDay")}</label>
                    <Input type="date" value={bookingDate} min={new Date().toISOString().split("T")[0]} onChange={(e) => setBookingDate(e.target.value)} className="rounded-xl h-12" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-md-on-surface-variant uppercase tracking-wider mb-2 ml-1">{t("doctor.selectTime")}</label>
                    <div className="space-y-2">
                      <Input type="time" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} className="rounded-xl h-12" />
                      <p className="text-[10px] text-md-on-surface-variant/60">⏱️ Один сеанс длится 1 час</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-md-on-surface-variant uppercase tracking-wider mb-2 ml-1">{t("doctor.symptoms")}</label>
                    <textarea
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      className="w-full bg-md-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-md-primary outline-none text-md-on-surface"
                      placeholder={t("doctor.symptomsPlaceholder")}
                      rows={2}
                    />
                  </div>
                  <button
                    disabled={booking}
                    onClick={async () => {
                      if (!doctorById?.id) return;
                      if (!userById?.id) { toast.error(t("doctor.loginToBook")); return; }
                      if (!bookingDate || !bookingTime) { toast.error(t("doctor.selectDateTime")); return; }

                      setBooking(true);

                      // Финальная проверка доступности слота перед отправкой
                      const isAvailable = await checkSlotAvailability(doctorById.id!, bookingDate, bookingTime);

                      if (!isAvailable) {
                        toast.error("Ин вақт аллақачон забронирован шудаест. Лутфан вақти дигарро интихоб кунед.");
                        setBooking(false);
                        return;
                      }

                      const res = await createAppointment({
                        doctorId: doctorById.id!,
                        clientId: userById.id!,
                        doctorName: doctorById.fullName,
                        clientName: userById.fullName,
                        specialty: doctorById.specialty,
                        date: bookingDate,
                        time: bookingTime,
                        symptoms: symptoms,
                      });

                      setBooking(false);

                      if (res.success) {
                        // Ждём немного перед редиректом, чтобы бэк успел обработать
                        setTimeout(() => {
                          router.push("/appointments");
                        }, 500);
                      }
                    }}
                    className="w-full signature-gradient text-white py-4 rounded-full font-headline font-extrabold tracking-wide shadow-lg shadow-md-primary/20 hover:scale-[1.02] transition-transform active:scale-95 uppercase text-sm cursor-pointer disabled:opacity-50"
                  >
                    {booking ? t("doctor.booking") : t("doctor.confirmBook")}
                  </button>
                </div>
              </div>
              <div className="bg-md-surface-container-low p-4 text-center">
                <p className="text-[10px] text-md-on-surface-variant/60 leading-tight">
                  {t("doctor.consent")}
                </p>
              </div>
            </section>
          </aside>
        )}
      </div>
    </div>
  );
};

export default DoctorById;