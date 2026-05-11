"use client";
import React, { useEffect, useState } from "react";
import useStore from "@/store/store";
import axios from "axios";
import { Stethoscope, Plus, Users, X, Mail, Lock, Phone, UserPlus, Building2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_BASE_URL;

const ClinicDashboard = () => {
  const { loginMe, userById, getSubcategories, subcategories } = useStore((s) => s);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "", email: "", password: "", phone: "", specialty: "", bio: "",
  });

  useEffect(() => { loginMe(); getSubcategories(); }, []);

  useEffect(() => {
    if (userById?.id) fetchDoctors();
  }, [userById]);

  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get(API + "/clinic/doctors?clinicId=" + userById?.id);
      setDoctors(data);
    } catch (e) { console.error(e); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.specialty) {
      toast.error("Заполните обязательные поля");
      return;
    }
    setLoading(true);
    try {
      await axios.post(API + "/clinic/create-doctor", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      toast.success("Духтур илова шуд!");
      setShowForm(false);
      setForm({ fullName: "", email: "", password: "", phone: "", specialty: "", bio: "" });
      fetchDoctors();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Ошибка");
    } finally {
      setLoading(false);
    }
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
                <span className="text-emerald-200 font-semibold tracking-widest text-xs uppercase">Панели клиника</span>
              </div>
              <h1 className="font-headline font-black text-3xl md:text-4xl">
                {(userById as any)?.clinicName || userById?.fullName}
              </h1>
              <p className="text-emerald-200/80 max-w-lg">
                Идоракунии духтурони клиника. Духтуронро илова кунед ва кори онҳоро назорат кунед.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-3 text-center">
                <div className="font-headline font-black text-2xl">{doctors.length}</div>
                <div className="text-emerald-200 text-xs">Духтурон</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-headline font-bold text-xl text-md-on-surface flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-md-primary" /> Духтурони клиника
          </h2>
          <Button onClick={() => setShowForm(!showForm)} className="bg-md-primary hover:bg-md-primary/90 text-white rounded-xl gap-2 cursor-pointer">
            <Plus className="w-4 h-4" /> Духтури нав
          </Button>
        </div>

        {/* Create form */}
        {showForm && (
          <form onSubmit={handleCreate} className="premium-card rounded-2xl p-6 mb-6 space-y-4 animate-fade-in-scale">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-md-on-surface">Илова кардани духтур</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-md-on-surface-variant hover:text-md-on-surface cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-md-on-surface-variant">Номи пурра *</label>
                <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Фирдавс Ҳасанов" className="rounded-xl" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-md-on-surface-variant">Тахассус *</label>
                <select value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} className="w-full border border-md-outline-variant/30 text-md-on-surface px-4 py-2.5 rounded-xl bg-md-surface-container-low appearance-none" required>
                  <option value="">Интихоб кунед</option>
                  {subcategories.map((s, i) => <option key={i} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-md-on-surface-variant flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Email *</label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="doctor@clinic.tj" className="rounded-xl" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-md-on-surface-variant flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Парол *</label>
                <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••" className="rounded-xl" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-md-on-surface-variant flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Телефон</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+992 ..." className="rounded-xl" />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="bg-md-primary hover:bg-md-primary/90 text-white rounded-xl gap-2 cursor-pointer">
              {loading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" /> : <><UserPlus className="w-4 h-4" /> Илова кардан</>}
            </Button>
          </form>
        )}

        {/* Doctor cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {doctors.map((d: any) => (
            <div key={d.id} className="premium-card rounded-2xl overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 to-emerald-500" />
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  {d.image ? (
                    <img src={d.image} alt={d.fullName} className="w-11 h-11 rounded-xl object-cover" />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-md-primary/10 flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 text-md-primary" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-headline font-bold text-md-on-surface">{d.fullName}</h3>
                    <p className="text-xs text-md-on-surface-variant">{d.specialty}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap text-xs">
                  <span className="bg-md-surface-container px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <Award className="w-3 h-3" /> {d.experience || 0} сол
                  </span>
                  <span className={`px-3 py-1.5 rounded-lg ${d.diplomaVerified ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20" : "bg-amber-100 text-amber-700 dark:bg-amber-900/20"}`}>
                    {d.diplomaVerified ? "✓ Тасдиқшуда" : "⏳ Тасдиқнашуда"}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {doctors.length === 0 && (
            <div className="col-span-full flex flex-col items-center py-16 gap-3 text-md-on-surface-variant">
              <Stethoscope className="w-12 h-12 opacity-30" />
              <p>Ҳоло духтуре нест. Духтури нав илова кунед.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ClinicDashboard;
