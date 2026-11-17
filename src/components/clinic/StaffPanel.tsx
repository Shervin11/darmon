"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, UserPlus, Users } from "lucide-react";
import { api, apiError } from "@/lib/api";
import { useTranslation } from "@/lib/i18n";
import { cardCls, fieldCls, labelCls, primaryBtn } from "./styles";

interface Registrar {
  id: number;
  fullName: string;
  email: string;
  phone: string;
}

const empty = { fullName: "", login: "", password: "" };

/** Front-desk accounts of the clinic: they book patients and manage visits, but cannot see medical records. */
export default function StaffPanel() {
  const { t } = useTranslation();
  const [staff, setStaff] = useState<Registrar[]>([]);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = () => api.get<Registrar[]>("/clinic/registrars").then(({ data }) => setStaff(data)).catch(() => {});
  useEffect(() => {
    load();
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.login || form.password.length < 6) {
      toast.error(t("auth.error.fillData"));
      return;
    }
    setSaving(true);
    const login = form.login.trim();
    try {
      await api.post("/clinic/registrars", {
        fullName: form.fullName,
        password: form.password,
        ...(login.includes("@") ? { email: login } : { phone: login }),
      });
      setForm(empty);
      toast.success(t("staff.added"));
      load();
    } catch (err) {
      toast.error(apiError(err, t("common.error")));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (r: Registrar) => {
    if (!confirm(t("common.deleteConfirm"))) return;
    try {
      await api.delete(`/clinic/registrars/${r.id}`);
      load();
    } catch (err) {
      toast.error(apiError(err, t("common.error")));
    }
  };

  return (
    <section className={`${cardCls} space-y-6`}>
      <div>
        <h2 className="inline-flex items-center gap-2 font-headline font-bold text-2xl text-md-on-surface">
          <Users className="w-6 h-6 text-md-primary" />
          {t("staff.title")}
        </h2>
        <p className="mt-1 text-sm text-md-on-surface-variant">{t("staff.desc")}</p>
      </div>

      {staff.length > 0 && (
        <ul className="divide-y divide-md-outline-variant/20">
          {staff.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="font-semibold text-md-on-surface truncate">{r.fullName}</p>
                <p className="text-sm text-md-on-surface-variant truncate">{r.email || r.phone}</p>
              </div>
              <button onClick={() => remove(r)} aria-label={t("doctor.delete")} className="p-2 rounded-full text-md-error hover:bg-md-error/10 cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={add} className="grid gap-4 md:grid-cols-4 md:items-end">
        <label className="space-y-1.5">
          <span className={labelCls}>{t("auth.fullName")}</span>
          <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={fieldCls} />
        </label>
        <label className="space-y-1.5">
          <span className={labelCls}>{t("auth.emailOrPhone")}</span>
          <input value={form.login} onChange={(e) => setForm({ ...form, login: e.target.value })} className={fieldCls} />
        </label>
        <label className="space-y-1.5">
          <span className={labelCls}>{t("auth.password")}</span>
          <input type="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={fieldCls} />
        </label>
        <button type="submit" disabled={saving} className={primaryBtn}>
          <UserPlus className="w-4 h-4" />
          {t("staff.add")}
        </button>
      </form>
    </section>
  );
}
