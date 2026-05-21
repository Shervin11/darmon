"use client";
import React, { useEffect, useState } from "react";
import useStore from "@/store/store";
import axios from "axios";
import { Stethoscope, Plus, Users, X, Mail, Lock, Phone, UserPlus, Building2, Award, Edit3, Trash2, Wallet, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useTranslation } from "@/lib/i18n";

const API = process.env.NEXT_PUBLIC_BASE_URL;

const ClinicDashboard = () => {
  const { loginMe, userById, getSubcategories, subcategories } = useStore((s) => s);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any | null>(null);
  const { t } = useTranslation();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    specialty: "",
    bio: "",
    priceCurrent: "",
    priceCurrency: "см",
  });

  useEffect(() => {
    loginMe();
    getSubcategories();
  }, []);

  useEffect(() => {
    if (userById?.id) fetchDoctors();
  }, [userById]);

  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get(API + "/clinic/doctors?clinicId=" + userById?.id);
      setDoctors(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || (!editingDoctor && !form.password) || !form.specialty) {
      toast.error(t("auth.error.fillData") || "Заполните обязательные поля");
      return;
    }
    setLoading(true);

    const payload = {
      ...form,
      price: {
        current: Number(form.priceCurrent) || 0,
        old: null,
        currency: form.priceCurrency,
      },
    };

    try {
      if (editingDoctor) {
        await axios.patch(`${API}/users/${editingDoctor.id}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        toast.success(t("profile.editSuccess") || "Маълумот иваз шуд!");
      } else {
        await axios.post(API + "/clinic/create-doctor", payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        toast.success(t("auth.success.welcome") || "Духтур илова шуд!");
      }
      setShowForm(false);
      setEditingDoctor(null);
      setForm({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        specialty: "",
        bio: "",
        priceCurrent: "",
        priceCurrency: "см",
      });
      fetchDoctors();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || t("common.error"));
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
    });
    setShowForm(true);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  return (
    <div className="pt-20 pb-16 min-h-screen">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 mb-10 mt-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-8 md:p-12">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-white rounded-full blur-[120px]"></div>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="bg-white/15 backdrop-blur-md p-2.5 rounded-xl border border-white/20">
                  <Building2 className="w-5 h-5" />
                </span>
                <span className="text-emerald-200 font-semibold tracking-widest text-xs uppercase">{t("clinic.title")}</span>
              </div>
              <h1 className="font-headline font-black text-3xl md:text-4xl">
                {(userById as any)?.clinicName || userById?.fullName}
              </h1>
              <p className="text-emerald-200/80 max-w-lg">
                {t("hero.desc")}
              </p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-3 text-center">
                <div className="font-headline font-black text-2xl">{doctors.length}</div>
                <div className="text-emerald-200 text-xs">{t("nav.doctors")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-headline font-bold text-xl text-md-on-surface flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-md-primary" /> {t("clinic.doctors")}
          </h2>
          <Button
            onClick={() => {
              setShowForm(!showForm);
              if (editingDoctor) {
                setEditingDoctor(null);
                setForm({
                  fullName: "",
                  email: "",
                  password: "",
                  phone: "",
                  specialty: "",
                  bio: "",
                  priceCurrent: "",
                  priceCurrency: "см",
                });
              }
            }}
            className="bg-md-primary hover:bg-md-primary/90 text-white rounded-xl gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> {t("clinic.addDoctor")}
          </Button>
        </div>

        {/* Create/Edit form */}
        {showForm && (
          <form onSubmit={handleCreate} className="premium-card rounded-2xl p-6 mb-6 space-y-4 animate-fade-in-scale border-2 border-md-primary/20">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-md-on-surface">
                {editingDoctor ? t("clinic.editDoctor") : t("clinic.addDoctor")}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingDoctor(null);
                  setForm({
                    fullName: "",
                    email: "",
                    password: "",
                    phone: "",
                    specialty: "",
                    bio: "",
                    priceCurrent: "",
                    priceCurrency: "см",
                  });
                }}
                className="text-md-on-surface-variant hover:text-md-on-surface cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-md-on-surface-variant uppercase tracking-wider">{t("auth.fullName")} *</label>
                <Input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Фирдавс Ҳасанов"
                  className="rounded-xl h-11"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-md-on-surface-variant uppercase tracking-wider">{t("auth.specialty")} *</label>
                <select
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  className="w-full border border-md-outline-variant/30 text-md-on-surface px-4 py-2.5 rounded-xl bg-md-surface-container-low appearance-none h-11"
                  required
                >
                  <option value="">{t("auth.selectSpecialty")}</option>
                  {subcategories.map((s, i) => (
                    <option key={i} value={s}>{t(s)}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-md-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {t("auth.email")} *
                </label>
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
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-md-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> {t("auth.password")} *
                  </label>
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
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-md-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> {t("profile.phone")}
                </label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+992 ..."
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-md-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                  <Wallet className="w-3.5 h-3.5" /> {t("clinic.price")}
                </label>
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
                    className="w-24 border border-md-outline-variant/30 text-md-on-surface px-4 py-2.5 rounded-xl bg-md-surface-container-low h-11"
                  >
                    <option value="см">см</option>
                    <option value="$">$</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-md-on-surface-variant uppercase tracking-wider">{t("profile.aboutMe")}</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder={t("profile.aboutPlaceholder")}
                className="w-full border border-md-outline-variant/30 text-md-on-surface px-4 py-3 rounded-xl bg-md-surface-container-low min-h-[100px] outline-none focus:ring-2 ring-md-primary/20"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="bg-md-primary hover:bg-md-primary/90 text-white rounded-xl gap-2 cursor-pointer h-12 w-full md:w-auto px-10"
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
          {doctors.map((d: any) => (
            <div key={d.id} className="premium-card rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300 border border-md-outline/5">
              <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 to-emerald-500" />
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {d.image ? (
                      <img src={d.image} alt={d.fullName} className="w-12 h-12 rounded-xl object-cover ring-2 ring-md-primary/10" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-md-primary/10 flex items-center justify-center">
                        <Stethoscope className="w-6 h-6 text-md-primary" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-headline font-bold text-md-on-surface leading-tight">{d.fullName}</h3>
                      <p className="text-[11px] font-bold text-md-primary uppercase tracking-wider">{d.specialty}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit(d)}
                    className="p-2 rounded-lg bg-md-surface-container-high text-md-on-surface-variant hover:bg-md-primary hover:text-white transition-all cursor-pointer"
                    title={t("doctor.edit")}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 py-1">
                  <div className="bg-md-surface-container-low rounded-xl p-2.5 text-center">
                    <p className="text-[9px] font-bold text-md-on-surface-variant uppercase mb-0.5">{t("clinic.experience")}</p>
                    <p className="text-sm font-bold text-md-on-surface">{d.experience || 0} {t("doctor.years")}</p>
                  </div>
                  <div className="bg-md-surface-container-low rounded-xl p-2.5 text-center">
                    <p className="text-[9px] font-bold text-md-on-surface-variant uppercase mb-0.5">{t("clinic.price")}</p>
                    <p className="text-sm font-bold text-md-primary">{d.price?.current || 0} {d.price?.currency || "см"}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${d.diplomaVerified ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20" : "bg-amber-100 text-amber-700 dark:bg-amber-900/20"}`}>
                    {d.diplomaVerified ? "✓ " + t("doctor.verifiedDiploma") : "⏳ " + t("profile.diplomaPending")}
                  </span>
                  <p className="text-[10px] text-md-on-surface-variant font-medium">{d.email}</p>
                </div>
              </div>
            </div>
          ))}
          {doctors.length === 0 && (
            <div className="col-span-full flex flex-col items-center py-20 bg-md-surface-container-lowest rounded-3xl border-2 border-dashed border-md-outline/10">
              <div className="w-20 h-20 rounded-3xl bg-md-surface-container flex items-center justify-center mb-4">
                <Stethoscope className="w-10 h-10 text-md-on-surface-variant opacity-20" />
              </div>
              <p className="text-md-on-surface-variant font-medium">{t("doctors.notFound")}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ClinicDashboard;
