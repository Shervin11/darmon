"use client";
import React, { useEffect, useState } from "react";
import useStore from "@/store/store";
import { api, apiError } from "@/lib/api";
import { Building2, Plus, Users, Stethoscope, Activity, UserPlus, MapPin, Mail, Lock, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { ECG_WIDE, delay } from "@/lib/ui";
import HolidaysPanel from "@/components/admin/HolidaysPanel";

interface Clinic {
  id: number;
  fullName: string;
  clinicName: string;
  email: string;
  city: string;
  phone: string;
  address: string;
}

interface AppUser {
  id?: number;
  role: string;
  clinicId?: number | string | null;
  [key: string]: unknown;
}

/* Число плавно набирается, когда приходят данные с сервера */
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
const inputCls = "rounded-xl h-11";

const AdminPanel = () => {
  const userById = useStore((s) => s.userById);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [clinicsLoaded, setClinicsLoaded] = useState(false);
  const [allUsers, setAllUsers] = useState<AppUser[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    clinicName: "", email: "", password: "", phone: "", city: "", address: "",
  });

  useEffect(() => {
    if (userById?.id) {
      fetchClinics();
      fetchUsers();
    }
  }, [userById?.id]);

  const fetchClinics = async () => {
    try {
      const { data } = await api.get("/admin/clinics");
      setClinics(data);
    } catch (e) { console.error(e); }
    finally { setClinicsLoaded(true); }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users");
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
      await api.post("/admin/create-clinic", form);
      toast.success("Клиника создана!");
      setShowForm(false);
      setForm({ clinicName: "", email: "", password: "", phone: "", city: "", address: "" });
      fetchClinics();
      fetchUsers();
    } catch (err) {
      toast.error(apiError(err, "Ошибка"));
    } finally {
      setLoading(false);
    }
  };

  const count = (role: string) => allUsers.filter((u) => u.role === role).length;

  const roleStats = [
    { icon: Building2, val: count("clinic"), label: "Клиник", color: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300" },
    { icon: Stethoscope, val: count("doctor"), label: "Врачей", color: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-300" },
    { icon: Users, val: count("client"), label: "Пациентов", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300" },
  ];

  return (
    <div className="pt-20 pb-20 min-h-screen">

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 mt-4 mb-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-md-primary text-white px-8 py-12 md:px-14 md:py-16">
          <svg aria-hidden="true" viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-6 h-28 w-full text-white/25">
            <path d={ECG_WIDE} pathLength="1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" className="fx-draw" />
          </svg>
          <div className="relative space-y-4 max-w-2xl">
            <p className="fx-rise inline-flex items-center gap-2 text-white/85 font-semibold text-sm" style={delay("0.05s")}>
              <span className="fx-beat h-2.5 w-2.5 rounded-full bg-white" />
              Панели администратор
            </p>
            <h1 className="fx-rise font-headline font-black tracking-tight leading-[1.05] text-4xl md:text-6xl" style={delay("0.2s")}>
              Админ-панель DARMON
            </h1>
            <p className="fx-rise text-white/85 text-lg leading-relaxed" style={delay("0.4s")}>
              Идоракунии клиникаҳо, духтурон ва беморон. Хуш омадед, <span className="font-bold text-white">{userById?.fullName}</span>!
            </p>
          </div>
        </div>
      </section>

      {/* Stats: одна главная цифра и три по ролям */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="grid lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 rounded-[2rem] bg-md-surface-container-low p-8 flex items-center gap-6">
            <div className="h-16 w-16 shrink-0 rounded-3xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300 flex items-center justify-center">
              <Activity className="w-8 h-8" />
            </div>
            <div>
              <div className="font-headline font-black text-6xl leading-none text-md-on-surface tabular-nums">
                <CountUp value={allUsers.length} />
              </div>
              <div className="mt-2 text-md-on-surface-variant">Всего</div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {roleStats.map((s, i) => (
              <div key={i} className="rounded-[2rem] bg-md-surface-container-lowest clinical-shadow p-6 flex flex-col justify-between gap-6">
                <div className={`h-11 w-11 rounded-2xl flex items-center justify-center ${s.color}`}>
                  {React.createElement(s.icon, { className: "w-5 h-5" })}
                </div>
                <div>
                  <div className="font-headline font-black text-4xl text-md-on-surface tabular-nums">
                    <CountUp value={s.val} />
                  </div>
                  <div className="text-sm text-md-on-surface-variant">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clinics */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-headline font-bold text-3xl md:text-4xl tracking-tight text-md-on-surface">Клиникаҳо</h2>
            <p className="mt-1 text-md-on-surface-variant">{clinics.length} дар система</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            aria-expanded={showForm}
            className="bg-md-primary hover:bg-md-primary/90 text-white rounded-full h-12 px-6 gap-2 cursor-pointer shadow-lg shadow-md-primary/25"
          >
            <Plus className={`w-4 h-4 transition-transform duration-300 ${showForm ? "rotate-45" : ""}`} />
            Клиникаи нав
          </Button>
        </div>

        {/* Create form */}
        {showForm && (
          <form onSubmit={handleCreate} className="fx-open rounded-[2rem] bg-md-surface-container-low p-6 md:p-10 mb-10 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-xl text-md-on-surface">Сохтани клиникаи нав</h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Закрыть"
                className="h-10 w-10 rounded-full flex items-center justify-center text-md-on-surface-variant hover:bg-md-surface-container hover:text-md-on-surface transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className={labelCls}><Building2 className="w-3.5 h-3.5" /> Номи клиника *</label>
                <Input value={form.clinicName} onChange={(e) => setForm({ ...form, clinicName: e.target.value })} placeholder="Клиникаи Сино" className={inputCls} required />
              </div>
              <div className="space-y-2">
                <label className={labelCls}><Mail className="w-3.5 h-3.5" /> Email *</label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="clinic@darmon.tj" className={inputCls} required />
              </div>
              <div className="space-y-2">
                <label className={labelCls}><Lock className="w-3.5 h-3.5" /> Парол *</label>
                <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••" className={inputCls} required />
              </div>
              <div className="space-y-2">
                <label className={labelCls}><Phone className="w-3.5 h-3.5" /> Телефон</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+992 44 ..." className={inputCls} />
              </div>
              <div className="space-y-2">
                <label className={labelCls}><MapPin className="w-3.5 h-3.5" /> Шаҳр</label>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Душанбе" className={inputCls} />
              </div>
              <div className="space-y-2">
                <label className={labelCls}><MapPin className="w-3.5 h-3.5" /> Суроға</label>
                <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="к. Рудакӣ 100" className={inputCls} />
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="bg-md-primary hover:bg-md-primary/90 text-white rounded-full h-12 px-8 gap-2 cursor-pointer w-full sm:w-auto"
            >
              {loading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" /> : <><UserPlus className="w-4 h-4" /> Сохтан</>}
            </Button>
          </form>
        )}

        {/* Пустое состояние */}
        {clinicsLoaded && clinics.length === 0 && (
          <div className="rounded-[2rem] border-2 border-dashed border-md-surface-variant/40 p-12 text-center space-y-4">
            <div className="mx-auto h-14 w-14 rounded-full bg-md-primary/10 text-md-primary flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <p className="text-md-on-surface-variant">Ҳоло ягон клиника нест. Аввалин клиникаро илова кунед.</p>
          </div>
        )}

        {/* Clinic cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {clinics.map((c, i) => {
            const doctors = allUsers.filter((u) => u.role === "doctor" && String(u.clinicId) === String(c.id));
            const name = c.clinicName || c.fullName;
            return (
              <article
                key={c.id}
                className="fx-rise group rounded-[2rem] bg-md-surface-container-lowest clinical-shadow p-7 flex flex-col gap-6 transition-transform duration-500 hover:-translate-y-1"
                style={delay(`${Math.min(i, 8) * 0.07}s`)}
              >
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 shrink-0 rounded-2xl bg-md-primary/10 text-md-primary flex items-center justify-center font-headline font-black text-xl transition-colors duration-300 group-hover:bg-md-primary group-hover:text-white">
                    {name?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-headline font-bold text-lg text-md-on-surface truncate">{name}</h3>
                    <p className="text-sm text-md-on-surface-variant truncate">{c.email}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-auto text-sm">
                  <span className="bg-md-surface-container px-4 py-2 rounded-full flex items-center gap-1.5 text-md-on-surface-variant">
                    <MapPin className="w-3.5 h-3.5" /> {c.city || "—"}
                  </span>
                  <span className="bg-md-surface-container px-4 py-2 rounded-full flex items-center gap-1.5 text-md-on-surface-variant">
                    <Stethoscope className="w-3.5 h-3.5" /> {doctors.length} духтур
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        <HolidaysPanel />
      </div>
    </div>
  );
};

export default AdminPanel;