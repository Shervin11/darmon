"use client";
import React, { useEffect, useState } from "react";
import useStore from "@/store/store";
import { api, apiError } from "@/lib/api";
import { Stethoscope, Plus, X, Mail, Lock, Phone, UserPlus, Building2, Edit3, Wallet, Check, BadgeCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useTranslation } from "@/lib/i18n";
import { ECG_WIDE, delay } from "@/lib/ui";
import ReportPanel from "@/components/clinic/ReportPanel";
import StaffPanel from "@/components/clinic/StaffPanel";

const SLOT_OPTIONS = [15, 20, 30, 40, 45, 60, 90];

const emptyForm = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  specialty: "",
  bio: "",
  priceCurrent: "",
  priceCurrency: "см",
  slotMinutes: "60",
};

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

const labelCls = "text-sm font-medium text-md-on-surface-variant flex items-center gap-1.5";
const fieldCls =
  "w-full border border-md-outline-variant/30 text-md-on-surface px-4 rounded-xl bg-md-surface-container-lowest h-11 outline-none transition focus:border-md-primary/50 focus:ring-2 ring-md-primary/20";

const ClinicDashboard = () => {
  const { userById, getSubcategories, subcategories } = useStore((s) => s);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any | null>(null);
  const { t } = useTranslation();

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    getSubcategories();
  }, []);

  useEffect(() => {
    if (userById?.id) fetchDoctors();
  }, [userById?.id]);

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get("/clinic/doctors");
      setDoctors(data);
    } catch (e) {
      console.error(e);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingDoctor(null);
    setForm(emptyForm);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || (!editingDoctor && !form.password) || !form.specialty) {
      toast.error(t("auth.error.fillData") || "Заполните обязательные поля");
      return;
    }
    setLoading(true);

    const { priceCurrent, priceCurrency, slotMinutes, ...fields } = form;
    const payload = {
      ...fields,
      slotMinutes: Number(slotMinutes),
      price: {
        current: Number(priceCurrent) || 0,
        old: null,
        currency: priceCurrency,
      },
    };

    try {
      if (editingDoctor) {
        await api.patch(`/users/${editingDoctor.id}`, payload);
        toast.success(t("profile.editSuccess") || "Маълумот иваз шуд!");
      } else {
        await api.post("/clinic/create-doctor", payload);
        toast.success(t("auth.success.welcome") || "Духтур илова шуд!");
      }
      closeForm();
      fetchDoctors();
    } catch (err) {
      toast.error(apiError(err, t("common.error")));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (doctor: any) => {
    setEditingDoctor(doctor);
    setForm({
      fullName: doctor.fullName || "",
      email: doctor.email || "",
      password: "",
      phone: doctor.phone || "",
      specialty: doctor.specialty || "",
      bio: doctor.bio || "",
      priceCurrent: doctor.price?.current?.toString() || "",
      priceCurrency: doctor.price?.currency || "см",
      slotMinutes: String(doctor.slotMinutes || 60),
    });
    setShowForm(true);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  return (
    <div className="pt-20 pb-20 min-h-screen">

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 mt-4 mb-10">
        <div className="relative overflow-hidden rounded-[2rem] bg-md-primary text-white px-8 py-12 md:px-14 md:py-16">
          <svg aria-hidden="true" viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-6 h-28 w-full text-white/25">
            <path d={ECG_WIDE} pathLength="1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" className="fx-draw" />
          </svg>

          <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="space-y-4 max-w-2xl">
              <p className="fx-rise inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold" style={delay("0.05s")}>
                <Building2 className="w-4 h-4" />
                {t("clinic.title")}
              </p>
              <h1 className="fx-rise font-headline font-black tracking-tight leading-[1.05] text-4xl md:text-6xl" style={delay("0.2s")}>
                {(userById as any)?.clinicName || userById?.fullName}
              </h1>
              <p className="fx-rise text-white/85 text-lg leading-relaxed" style={delay("0.4s")}>
                {t("hero.desc")}
              </p>
            </div>

            <div className="fx-rise shrink-0 flex items-center gap-4" style={delay("0.6s")}>
              <span className="fx-beat h-3 w-3 rounded-full bg-white" />
              <div>
                <div className="font-headline font-black text-6xl leading-none tabular-nums">
                  <CountUp value={doctors.length} />
                </div>
                <div className="mt-1 text-white/85">{t("nav.doctors")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h2 className="font-headline font-bold text-3xl md:text-4xl tracking-tight text-md-on-surface">
            {t("clinic.doctors")}
          </h2>
          <Button
            onClick={() => {
              setShowForm(!showForm);
              if (editingDoctor) {
                setEditingDoctor(null);
                setForm(emptyForm);
              }
            }}
            aria-expanded={showForm}
            className="bg-md-primary hover:bg-md-primary/90 text-white rounded-full h-12 px-6 gap-2 cursor-pointer shadow-lg shadow-md-primary/25"
          >
            <Plus className={`w-4 h-4 transition-transform duration-300 ${showForm ? "rotate-45" : ""}`} />
            {t("clinic.addDoctor")}
          </Button>
        </div>

        {/* Create/Edit form */}
        {showForm && (
          <form
            onSubmit={handleCreate}
            className={`fx-open rounded-[2rem] bg-md-surface-container-low p-6 md:p-10 mb-10 space-y-6 border-2 ${
              editingDoctor ? "border-md-primary/40" : "border-transparent"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-xl text-md-on-surface">
                {editingDoctor ? t("clinic.editDoctor") : t("clinic.addDoctor")}
              </h3>
              <button
                type="button"
                onClick={closeForm}
                aria-label="Закрыть"
                className="h-10 w-10 rounded-full flex items-center justify-center text-md-on-surface-variant hover:bg-md-surface-container hover:text-md-on-surface transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className={labelCls}>{t("auth.fullName")} *</label>
                <Input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Фирдавс Ҳасанов"
                  className="rounded-xl h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className={labelCls}>{t("auth.specialty")} *</label>
                <select
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  className={fieldCls}
                  required
                >
                  <option value="">{t("auth.selectSpecialty")}</option>
                  {subcategories.map((s, i) => (
                    <option key={i} value={s}>{t(s)}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelCls}><Mail className="w-3.5 h-3.5" /> {t("auth.email")} *</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="doctor@clinic.tj"
                  className="rounded-xl h-11"
                  required
                />
              </div>
              {!editingDoctor && (
                <div className="space-y-2">
                  <label className={labelCls}><Lock className="w-3.5 h-3.5" /> {t("auth.password")} *</label>
                  <Input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••"
                    className="rounded-xl h-11"
                    required={!editingDoctor}
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className={labelCls}><Phone className="w-3.5 h-3.5" /> {t("profile.phone")}</label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+992 ..."
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <label className={labelCls}><Wallet className="w-3.5 h-3.5" /> {t("clinic.price")}</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={form.priceCurrent}
                    onChange={(e) => setForm({ ...form, priceCurrent: e.target.value })}
                    placeholder="200"
                    className="rounded-xl h-11 flex-1"
                  />
                  <select
                    value={form.priceCurrency}
                    onChange={(e) => setForm({ ...form, priceCurrency: e.target.value })}
                    className={`${fieldCls} w-24`}
                  >
                    <option value="см">см</option>
                    <option value="$">$</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="slot-minutes" className={labelCls}><Clock className="w-3.5 h-3.5" /> {t("schedule.slotLength")}</label>
                <select
                  id="slot-minutes"
                  value={form.slotMinutes}
                  onChange={(e) => setForm({ ...form, slotMinutes: e.target.value })}
                  className={fieldCls}
                >
                  {SLOT_OPTIONS.map((m) => <option key={m} value={m}>{m} {t("schedule.minutes")}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelCls}>{t("profile.aboutMe")}</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder={t("profile.aboutPlaceholder")}
                className="w-full border border-md-outline-variant/30 text-md-on-surface px-4 py-3 rounded-xl bg-md-surface-container-lowest min-h-[110px] outline-none transition focus:border-md-primary/50 focus:ring-2 ring-md-primary/20"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-md-primary hover:bg-md-primary/90 text-white rounded-full gap-2 cursor-pointer h-12 w-full md:w-auto px-10"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />
              ) : (
                <>
                  {editingDoctor ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  {editingDoctor ? t("clinic.save") : t("clinic.addDoctor")}
                </>
              )}
            </Button>
          </form>
        )}

        {/* Doctor cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {doctors.map((d: any, i: number) => (
            <article
              key={d.id}
              className="fx-rise group rounded-[2rem] bg-md-surface-container-lowest clinical-shadow p-6 flex flex-col gap-6 transition-transform duration-500 hover:-translate-y-1"
              style={delay(`${Math.min(i, 8) * 0.07}s`)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-4 min-w-0">
                  {d.image ? (
                    <img src={d.image} alt={d.fullName} className="w-14 h-14 shrink-0 rounded-full object-cover ring-4 ring-md-primary/10" />
                  ) : (
                    <div className="w-14 h-14 shrink-0 rounded-full bg-md-primary/10 text-md-primary flex items-center justify-center transition-colors duration-300 group-hover:bg-md-primary group-hover:text-white">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-headline font-bold text-lg text-md-on-surface leading-tight truncate">{d.fullName}</h3>
                    <p className="text-sm font-medium text-md-primary truncate">{d.specialty}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleEdit(d)}
                  aria-label={t("doctor.edit")}
                  title={t("doctor.edit")}
                  className="h-10 w-10 shrink-0 rounded-full bg-md-surface-container text-md-on-surface-variant flex items-center justify-center hover:bg-md-primary hover:text-white transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-md-primary"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-md-surface-container-low px-4 py-3">
                  <p className="text-xs text-md-on-surface-variant mb-0.5">{t("clinic.experience")}</p>
                  <p className="font-bold text-md-on-surface">{d.experience || 0} {t("doctor.years")}</p>
                </div>
                <div className="rounded-2xl bg-md-surface-container-low px-4 py-3">
                  <p className="text-xs text-md-on-surface-variant mb-0.5">{t("clinic.price")}</p>
                  <p className="font-bold text-md-primary">{d.price?.current || 0} {d.price?.currency || "см"}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 mt-auto">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                    d.diplomaVerified
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                  }`}
                >
                  {d.diplomaVerified ? <BadgeCheck className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  {d.diplomaVerified ? t("doctor.verifiedDiploma") : t("profile.diplomaPending")}
                </span>
                <p className="text-xs text-md-on-surface-variant truncate max-w-full">{d.email}</p>
              </div>
            </article>
          ))}

          {doctors.length === 0 && (
            <div className="col-span-full rounded-[2rem] border-2 border-dashed border-md-surface-variant/40 px-8 py-16 text-center">
              <svg aria-hidden="true" viewBox="0 0 120 40" className="mx-auto mb-5 h-10 w-28 text-md-primary/40">
                <path d="M0 20 H44 L52 20 L58 6 L67 34 L74 20 H120" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-md-on-surface-variant text-lg">{t("doctors.notFound")}</p>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 mt-12 space-y-8">
        <ReportPanel />
        <StaffPanel />
      </div>
    </div>
  );
};

export default ClinicDashboard;