"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CalendarOff, Plus, Trash2 } from "lucide-react";
import { api, apiError } from "@/lib/api";
import { useTranslation } from "@/lib/i18n";
import { cardCls, fieldCls, primaryBtn } from "@/components/clinic/styles";

interface Holiday {
  date: string;
  name: string;
}

/** Public holidays: no doctor takes bookings on these dates. */
export default function HolidaysPanel() {
  const { t } = useTranslation();
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get<Holiday[]>("/holidays").then(({ data }) => setHolidays(data)).catch(() => {});
  }, []);

  const update = (index: number, patch: Partial<Holiday>) =>
    setHolidays(holidays.map((h, i) => (i === index ? { ...h, ...patch } : h)));

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await api.put<Holiday[]>("/admin/holidays", holidays.filter((h) => h.date));
      setHolidays(data);
      toast.success(t("profile.editSuccess"));
    } catch (err) {
      toast.error(apiError(err, t("common.error")));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={`${cardCls} space-y-5`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="inline-flex items-center gap-2 font-headline font-bold text-2xl text-md-on-surface">
            <CalendarOff className="w-6 h-6 text-md-primary" />
            {t("holidays.title")}
          </h2>
          <p className="mt-1 text-sm text-md-on-surface-variant">{t("holidays.desc")}</p>
        </div>
        <button
          type="button"
          onClick={() => setHolidays([...holidays, { date: "", name: "" }])}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-md-primary hover:underline cursor-pointer"
        >
          <Plus className="w-4 h-4" /> {t("holidays.add")}
        </button>
      </div>

      <div className="space-y-2">
        {holidays.map((h, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-2">
            <input type="date" aria-label={t("desk.date")} value={h.date} onChange={(e) => update(i, { date: e.target.value })} className={`${fieldCls} sm:!w-48`} />
            <input value={h.name} placeholder={t("holidays.name")} onChange={(e) => update(i, { name: e.target.value })} className={fieldCls} />
            <button
              type="button"
              onClick={() => setHolidays(holidays.filter((_, j) => j !== i))}
              aria-label={t("doctor.delete")}
              className="h-11 w-11 shrink-0 rounded-full text-md-error hover:bg-md-error/10 flex items-center justify-center cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button onClick={save} disabled={saving} className={primaryBtn}>
        {t("doctor.save")}
      </button>
    </section>
  );
}
