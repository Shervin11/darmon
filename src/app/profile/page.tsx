"use client";
import useStore from "@/store/store";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Trash2,
  Camera,
  User,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  Briefcase,
  Building2,
  Wallet,
  Clock,
  ChevronRight,
  GraduationCap,
  Upload,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { WorkingSchedule, type TimeOff } from "@/store/store";
import { useTranslation } from "@/lib/i18n";
import TelegramConnect from "@/components/TelegramConnect/TelegramConnect";
import { WEEKDAYS_MON_FIRST } from "@/lib/schedule";
import { DefaultPhoto, ECG_WIDE, delay } from "@/lib/ui";

const labelCls = "text-sm font-medium text-md-on-surface-variant";
const inputCls = "pl-11 h-12 rounded-2xl bg-md-surface-container-low border-transparent focus:border-md-primary/50 focus:bg-md-surface-container-lowest";
const selectCls =
  "w-full pl-11 pr-4 h-12 bg-md-surface-container-low border border-transparent rounded-2xl text-md-on-surface outline-none transition focus:border-md-primary/50 focus:ring-2 ring-md-primary/20 disabled:opacity-60 disabled:cursor-not-allowed";

/* Поле с иконкой слева */
const Field = ({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <Label className={labelCls}>{label}</Label>
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-md-outline pointer-events-none [&>svg]:w-4 [&>svg]:h-4">{icon}</span>
      {children}
    </div>
  </div>
);

const SectionTitle = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="flex items-center gap-3 mb-8">
    <span className="h-10 w-10 rounded-full bg-md-primary/10 text-md-primary flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5">{icon}</span>
    <h3 className="font-headline font-bold text-xl md:text-2xl tracking-tight text-md-on-surface">{children}</h3>
  </div>
);

const Profile = () => {
  const { userById, edit, uploadImage, uploadDiploma, getSubcategories, subcategories } = useStore((state) => state);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const diplomaInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPhotoRemoved, setIsPhotoRemoved] = useState(false);
  const [diplomaUploading, setDiplomaUploading] = useState(false);
  const { t } = useTranslation();

  // Doctor-specific states
  const [specialty, setSpecialty] = useState("");
  const [experience, setExperience] = useState<number | "">("");
  const [clinic, setClinic] = useState("");
  const [bio, setBio] = useState("");
  const [priceCurrent, setPriceCurrent] = useState("");
  const [priceCurrency, setPriceCurrency] = useState("сом.");
  const [schedule, setSchedule] = useState<WorkingSchedule[]>([]);
  const [slotMinutes, setSlotMinutes] = useState(60);
  const [timeOff, setTimeOff] = useState<TimeOff[]>([]);

  const handleAddSchedule = () => {
    setSchedule([...schedule, { day: "Душанбе", startTime: "08:00", endTime: "17:00" }]);
  };

  const handleRemoveSchedule = (index: number) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  const handleScheduleChange = (index: number, field: keyof WorkingSchedule, value: string) => {
    setSchedule(schedule.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsPhotoRemoved(false);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewUrl(null);
    setIsPhotoRemoved(true);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDiplomaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setDiplomaUploading(true);
    await uploadDiploma(file);
    setDiplomaUploading(false);

    if (diplomaInputRef.current) diplomaInputRef.current.value = "";
  };

  async function editUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let finalPhoto = userById.image || "";
    if (isPhotoRemoved) finalPhoto = "";
    else if (selectedFile) {
      const uploadedUrl = await uploadImage(selectedFile);
      if (uploadedUrl) finalPhoto = uploadedUrl;
      else return;
    }

    // Price is set by the clinic, so the doctor does not send it
    const updatedUser = {
      id: userById.id,
      fullName: name,
      email: email.toLowerCase(),
      phone,
      city,
      image: finalPhoto,
      ...(userById.role === "doctor" && {
        specialty,
        experience: Number(experience),
        clinic,
        bio,
        workingSchedule: schedule,
        slotMinutes,
        timeOff: timeOff.filter((t) => t.from && t.to),
      }),
    };

    const res = await edit(updatedUser);
    if (res.success) {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }

  useEffect(() => {
    setCity(userById.city || "");
    setName(userById.fullName || "");
    setEmail(userById.email || "");
    setPhone(userById.phone || "");
    if (userById.role === "doctor") {
      setSpecialty(userById.specialty || "");
      setExperience(userById.experience || "");
      setClinic(userById.clinic || "");
      setBio(userById.bio || "");
      setPriceCurrent(userById.price?.current || "");
      setPriceCurrency(userById.price?.currency || "сом.");
      setSchedule(userById.workingSchedule || []);
      setSlotMinutes(userById.slotMinutes || 60);
      setTimeOff(userById.timeOff || []);
    }
  }, [userById]);

  useEffect(() => {
    getSubcategories();
  }, []);

  const isDoctor = userById.role === "doctor";

  return (
    <div className="bg-md-surface-container-low min-h-screen pb-20 pt-20">

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 mb-10 mt-4">
        <div className="relative overflow-hidden rounded-[2rem] bg-md-banner px-8 py-12 md:px-14 md:py-16">
          <svg aria-hidden="true" viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-4 h-24 w-full text-white/20">
            <path d={ECG_WIDE} pathLength="1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" className="fx-draw" />
          </svg>
          <div className="relative space-y-4">
            <p className="fx-rise inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white font-headline" style={delay("0.05s")}>
              <span className="fx-beat h-2 w-2 rounded-full bg-white" />
              {t("profile.badge")}
            </p>
            <h1 className="fx-rise text-white font-headline font-extrabold text-4xl md:text-6xl tracking-tight leading-[1.05]" style={delay("0.2s")}>
              {t("profile.title")}
            </h1>
          </div>
        </div>
      </section>

      <form onSubmit={editUser} className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: identity card */}
        <aside className="lg:col-span-4 lg:sticky lg:top-28">
          <div className="bg-md-surface-container-lowest rounded-[2rem] clinical-shadow p-8 flex flex-col items-center text-center gap-6">
            <div className="relative w-44">
              <div className="aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[1.5rem] shadow-xl">
                <img
                  src={isPhotoRemoved ? DefaultPhoto : (previewUrl || userById.image || DefaultPhoto)}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute -bottom-2 -right-2 h-12 w-12 flex items-center justify-center bg-md-primary hover:bg-md-primary-container text-white rounded-full shadow-lg cursor-pointer transition-all active:scale-90 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-md-primary"
              >
                <Camera className="w-5 h-5" />
                <span className="sr-only">{t("profile.title")}</span>
                <input id="avatar-upload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} ref={fileInputRef} />
              </label>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-headline font-extrabold tracking-tight text-md-on-surface leading-tight">{name || t("profile.user")}</h2>
              <span className="inline-block bg-md-primary/10 text-md-primary px-4 py-1.5 rounded-full text-sm font-semibold font-headline">
                {isDoctor ? t("profile.doctorRole") : t("profile.patientRole")}
              </span>
              <p className="text-md-on-surface-variant text-sm break-all">{email}</p>
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={handleRemovePhoto}
              className="text-md-error hover:text-md-error hover:bg-md-error-container rounded-full h-10 px-5 text-sm cursor-pointer"
            >
              <Trash2 className="w-4 h-4 mr-2" /> {t("profile.removePhoto")}
            </Button>
          </div>
        </aside>

        {/* Right: sections */}
        <div className="lg:col-span-8 space-y-6 min-w-0">
          {/* General Info */}
          <section className="bg-md-surface-container-lowest rounded-[2rem] clinical-shadow p-6 md:p-10">
            <SectionTitle icon={<User />}>{t("profile.generalInfo")}</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field icon={<User />} label={t("profile.fullName")}>
                <Input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
              </Field>
              <Field icon={<Phone />} label={t("profile.phone")}>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
              </Field>
              <Field icon={<Mail />} label={t("profile.email")}>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
              </Field>
              <Field icon={<MapPin />} label={t("profile.city")}>
                <select value={city} onChange={(e) => setCity(e.target.value)} className={selectCls}>
                  <option value="">{t("profile.selectCity")}</option>
                  <option value="Душанбе">Душанбе</option>
                  <option value="Бохтар">Бохтар</option>
                  <option value="Хуҷанд">Хуҷанд</option>
                  <option value="Кӯлоб">Кӯлоб</option>
                  <option value="Истаравшан">Истаравшан</option>
                </select>
              </Field>
            </div>
          </section>

          <TelegramConnect />

          {isDoctor && (
            <>
              {/* Professional Info */}
              <section className="bg-md-surface-container-lowest rounded-[2rem] clinical-shadow p-6 md:p-10">
                <SectionTitle icon={<Stethoscope />}>{t("profile.professionalInfo")}</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field icon={<Briefcase />} label={t("profile.specialty")}>
                    <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className={selectCls}>
                      <option value="">{t("profile.selectSpecialty")}</option>
                      {subcategories.map((sub, idx) => (
                        <option key={idx} value={sub}>{t(sub)}</option>
                      ))}
                    </select>
                  </Field>

                  <Field icon={<Clock />} label={t("profile.experience")}>
                    <Input type="number" value={experience} onChange={(e) => setExperience(e.target.value === "" ? "" : Number(e.target.value))} className={inputCls} />
                  </Field>

                  <Field icon={<Building2 />} label={t("profile.clinic")}>
                    <Input value={clinic} onChange={(e) => setClinic(e.target.value)} className={inputCls} />
                  </Field>

                  <div className="space-y-2">
                    <Label className={labelCls}>{t("profile.price")}</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-md-outline pointer-events-none"><Wallet className="w-4 h-4" /></span>
                        <Input value={priceCurrent} onChange={(e) => setPriceCurrent(e.target.value)} className={`${inputCls} disabled:opacity-60 disabled:cursor-not-allowed`} disabled={isDoctor} />
                      </div>
                      <select value={priceCurrency} onChange={(e) => setPriceCurrency(e.target.value)} className={`${selectCls} !w-24 !pl-4`} disabled={isDoctor}>
                        <option value="сом.">сом.</option>
                        <option value="$">$</option>
                      </select>
                    </div>
                    <p className="text-xs text-md-on-surface-variant leading-relaxed">
                      {t("profile.price")} — устанавливается клиникой / нархро клиника муайян мекунад
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mt-5">
                  <Label className={labelCls}>{t("profile.aboutMe")}</Label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full rounded-2xl p-4 min-h-[140px] bg-md-surface-container-low border border-transparent text-md-on-surface outline-none transition focus:border-md-primary/50 focus:ring-2 ring-md-primary/20"
                    placeholder={t("profile.aboutPlaceholder")}
                  />
                </div>
              </section>

              {/* Diploma */}
              <section className="bg-md-surface-container-lowest rounded-[2rem] clinical-shadow p-6 md:p-10">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-8">
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-full bg-md-primary/10 text-md-primary flex items-center justify-center">
                      <GraduationCap className="w-5 h-5" />
                    </span>
                    <h3 className="font-headline font-bold text-xl md:text-2xl tracking-tight text-md-on-surface">{t("profile.diploma")}</h3>
                  </div>
                  {userById.diploma && (
                    <span
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold ${
                        userById.diplomaVerified
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                      }`}
                    >
                      {userById.diplomaVerified ? (
                        <><ShieldCheck className="w-4 h-4" /> {t("profile.diplomaVerified")}</>
                      ) : (
                        <><AlertCircle className="w-4 h-4" /> {t("profile.diplomaNotVerified")}</>
                      )}
                    </span>
                  )}
                </div>

                <div className="rounded-[1.5rem] border-2 border-dashed border-md-outline-variant/50 bg-md-surface-container-low/50 p-6 flex flex-col items-center gap-5 text-center">
                  {userById.diploma ? (
                    <img src={userById.diploma} alt="Diploma" className="max-h-52 rounded-2xl object-contain shadow-md" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-md-primary/10 text-md-primary flex items-center justify-center">
                      <Upload className="w-7 h-7" />
                    </div>
                  )}
                  <p className="text-sm text-md-on-surface-variant max-w-sm leading-relaxed">{t("profile.diplomaHint")}</p>

                  <label
                    className={`inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-sm transition-all focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-md-primary ${
                      diplomaUploading
                        ? "bg-md-outline/20 text-md-outline cursor-wait"
                        : "bg-md-primary text-white shadow-md shadow-md-primary/25 hover:shadow-lg active:scale-95 cursor-pointer"
                    }`}
                  >
                    {diplomaUploading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> {t("profile.diplomaPending")}</>
                    ) : (
                      <><Upload className="w-4 h-4" /> {t("profile.uploadDiploma")}</>
                    )}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="sr-only"
                      onChange={handleDiplomaUpload}
                      disabled={diplomaUploading}
                      ref={diplomaInputRef}
                    />
                  </label>
                </div>
              </section>

              {/* Schedule */}
              <section className="bg-md-surface-container-lowest rounded-[2rem] clinical-shadow p-6 md:p-10">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-full bg-md-primary/10 text-md-primary flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </span>
                    <h3 className="font-headline font-bold text-xl md:text-2xl tracking-tight text-md-on-surface">{t("profile.schedule")}</h3>
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddSchedule}
                    className="bg-md-primary/10 text-md-primary hover:bg-md-primary hover:text-white rounded-full h-11 px-5 cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-1.5" /> {t("profile.addSchedule")}
                  </Button>
                </div>

                <div className="space-y-3">
                  {schedule.map((slot, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-md-surface-container-low p-2 pl-4 rounded-[1.5rem] sm:rounded-full">
                      <select
                        value={slot.day}
                        onChange={(e) => handleScheduleChange(index, "day", e.target.value)}
                        aria-label={t("profile.schedule")}
                        className="sm:w-1/3 h-10 bg-transparent font-semibold text-md-on-surface outline-none cursor-pointer"
                      >
                        {WEEKDAYS_MON_FIRST.map((d) => (
                          <option key={d} value={d}>{t(`day.${d}`)}</option>
                        ))}
                      </select>
                      <div className="flex items-center gap-2 flex-1 bg-md-surface-container-lowest px-4 py-1 rounded-full">
                        <Input type="time" value={slot.startTime} onChange={(e) => handleScheduleChange(index, "startTime", e.target.value)} className="border-none bg-transparent h-9 p-0 focus-visible:ring-0" />
                        <ChevronRight className="w-4 h-4 text-md-outline shrink-0" />
                        <Input type="time" value={slot.endTime} onChange={(e) => handleScheduleChange(index, "endTime", e.target.value)} className="border-none bg-transparent h-9 p-0 focus-visible:ring-0" />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleRemoveSchedule(index)}
                        aria-label="Удалить"
                        className="text-md-error/70 hover:text-md-error hover:bg-md-error-container/40 rounded-full h-10 w-10 p-0 self-end sm:self-auto cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-[14rem_1fr]">
                  <label className="space-y-2">
                    <span className="block text-sm font-medium text-md-on-surface-variant">{t("schedule.slotLength")}</span>
                    <select
                      value={slotMinutes}
                      onChange={(e) => setSlotMinutes(Number(e.target.value))}
                      className="w-full h-11 rounded-full bg-md-surface-container-low px-4 font-semibold text-md-on-surface outline-none cursor-pointer"
                    >
                      {[15, 20, 30, 40, 45, 60, 90].map((m) => (
                        <option key={m} value={m}>{m} {t("schedule.minutes")}</option>
                      ))}
                    </select>
                  </label>

                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-medium text-md-on-surface-variant">{t("schedule.timeOff")}</span>
                      <button
                        type="button"
                        onClick={() => setTimeOff([...timeOff, { from: "", to: "", reason: "" }])}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-md-primary hover:underline cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> {t("schedule.addTimeOff")}
                      </button>
                    </div>
                    {timeOff.length === 0 && <p className="text-sm text-md-on-surface-variant">{t("schedule.noTimeOff")}</p>}
                    {timeOff.map((off, index) => {
                      const update = (patch: Partial<TimeOff>) => setTimeOff(timeOff.map((o, i) => (i === index ? { ...o, ...patch } : o)));
                      return (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 bg-md-surface-container-low p-2 pl-4 rounded-[1.5rem] sm:rounded-full">
                          <Input type="date" aria-label={t("report.from")} value={off.from} onChange={(e) => update({ from: e.target.value })} className="border-none bg-transparent h-9 sm:w-40 focus-visible:ring-0" />
                          <ChevronRight className="hidden sm:block w-4 h-4 text-md-outline shrink-0" />
                          <Input type="date" aria-label={t("report.to")} value={off.to} min={off.from} onChange={(e) => update({ to: e.target.value })} className="border-none bg-transparent h-9 sm:w-40 focus-visible:ring-0" />
                          <Input placeholder={t("schedule.reason")} value={off.reason || ""} onChange={(e) => update({ reason: e.target.value })} className="border-none bg-md-surface-container-lowest rounded-full h-9 flex-1 focus-visible:ring-0" />
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setTimeOff(timeOff.filter((_, i) => i !== index))}
                            aria-label={t("doctor.delete")}
                            className="text-md-error/70 hover:text-md-error hover:bg-md-error-container/40 rounded-full h-10 w-10 p-0 self-end sm:self-auto cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Save */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              className="bg-md-primary hover:bg-md-primary/90 text-white px-14 h-14 rounded-full text-base font-bold shadow-lg shadow-md-primary/25 hover:shadow-xl transition-all active:scale-95 cursor-pointer font-headline"
            >
              {t("profile.save")}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;