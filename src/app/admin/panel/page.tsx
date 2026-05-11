"use client";
import React, { useEffect, useState } from "react";
import useStore from "@/store/store";
import axios from "axios";
import { Building2, Plus, Users, Stethoscope, Activity, UserPlus, MapPin, Mail, Lock, Phone, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_BASE_URL;

interface Clinic {
  id: number;
  fullName: string;
  clinicName: string;
  email: string;
  city: string;
  phone: string;
  address: string;
}

const AdminPanel = () => {
  const { loginMe, userById } = useStore((s) => s);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    clinicName: "", email: "", password: "", phone: "", city: "", address: "",
  });

  useEffect(() => { loginMe(); }, []);

  useEffect(() => {
    if (userById?.id) {
      fetchClinics();
      fetchUsers();
    }
  }, [userById]);

  const fetchClinics = async () => {
    try {
      const { data } = await axios.get(API + "/admin/clinics");
      setClinics(data);
    } catch (e) { console.error(e); }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(API + "/users");
      setAllUsers(data);
    } catch (e) { console.error(e); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clinicName || !form.email || !form.password) {
      toast.error("Заполните обязательные поля");
      return;
    }
    setLoading(true);
    try {
      await axios.post(API + "/admin/create-clinic", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      toast.success("Клиника создана!");
      setShowForm(false);
      setForm({ clinicName: "", email: "", password: "", phone: "", city: "", address: "" });
      fetchClinics();
      fetchUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { icon: <Building2 className="w-6 h-6" />, val: allUsers.filter((u) => u.role === "clinic").length, label: "Клиник", color: "bg-violet-50 dark:bg-violet-900/20 text-violet-600" },
    { icon: <Stethoscope className="w-6 h-6" />, val: allUsers.filter((u) => u.role === "doctor").length, label: "Врачей", color: "bg-teal-50 dark:bg-teal-900/20 text-teal-600" },
    { icon: <Users className="w-6 h-6" />, val: allUsers.filter((u) => u.role === "client").length, label: "Пациентов", color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600" },
    { icon: <Activity className="w-6 h-6" />, val: allUsers.length, label: "Всего", color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600" },
  ];

  return (
    <div className="pt-20 pb-16 min-h-screen">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 mb-10 mt-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-8 md:p-12">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-white rounded-full blur-[120px]"></div>
          </div>
          <div className="relative z-10 space-y-3">
            <p className="text-violet-200 font-semibold tracking-widest text-xs uppercase">Панели администратор</p>
            <h1 className="font-headline font-black text-3xl md:text-4xl">Админ-панель DARMON</h1>
            <p className="text-violet-200/80 max-w-lg">
              Идоракунии клиникаҳо, духтурон ва беморон. Хуш омадед, <span className="font-bold text-white">{userById?.fullName}</span>!
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="premium-card rounded-2xl p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>{s.icon}</div>
              <div>
                <div className="text-2xl font-headline font-black text-md-on-surface">{s.val}</div>
                <div className="text-sm text-md-on-surface-variant">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Clinics */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-headline font-bold text-xl text-md-on-surface flex items-center gap-2">
            <Building2 className="w-5 h-5 text-md-primary" /> Клиникаҳо
          </h2>
          <Button onClick={() => setShowForm(!showForm)} className="bg-md-primary hover:bg-md-primary/90 text-white rounded-xl gap-2 cursor-pointer">
            <Plus className="w-4 h-4" /> Клиникаи нав
          </Button>
        </div>

        {/* Create form */}
        {showForm && (
          <form onSubmit={handleCreate} className="premium-card rounded-2xl p-6 mb-6 space-y-4 animate-fade-in-scale">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-md-on-surface">Сохтани клиникаи нав</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-md-on-surface-variant hover:text-md-on-surface cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-md-on-surface-variant flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> Номи клиника *</label>
                <Input value={form.clinicName} onChange={(e) => setForm({ ...form, clinicName: e.target.value })} placeholder="Клиникаи Сино" className="rounded-xl" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-md-on-surface-variant flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Email *</label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="clinic@darmon.tj" className="rounded-xl" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-md-on-surface-variant flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Парол *</label>
                <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••" className="rounded-xl" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-md-on-surface-variant flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Телефон</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+992 44 ..." className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-md-on-surface-variant flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Шаҳр</label>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Душанбе" className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-md-on-surface-variant flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Суроға</label>
                <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="к. Рудакӣ 100" className="rounded-xl" />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="bg-md-primary hover:bg-md-primary/90 text-white rounded-xl gap-2 cursor-pointer w-full sm:w-auto">
              {loading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" /> : <><UserPlus className="w-4 h-4" /> Сохтан</>}
            </Button>
          </form>
        )}

        {/* Clinic cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {clinics.map((c) => {
            const doctors = allUsers.filter((u: any) => u.role === "doctor" && u.clinicId == c.id);
            return (
              <div key={c.id} className="premium-card rounded-2xl overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 to-indigo-500" />
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-md-on-surface">{c.clinicName || c.fullName}</h3>
                      <p className="text-xs text-md-on-surface-variant">{c.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <span className="bg-md-surface-container px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {c.city || "—"}
                    </span>
                    <span className="bg-md-surface-container px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <Stethoscope className="w-3 h-3" /> {doctors.length} духтур
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
