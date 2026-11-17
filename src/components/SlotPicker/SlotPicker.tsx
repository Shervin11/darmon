"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useTranslation } from "@/lib/i18n";

interface DaySlots {
  slotMinutes: number;
  closed: "holiday" | "time_off" | "not_working" | null;
  slots: { time: string; free: boolean }[];
}

interface Props {
  doctorId: number | string;
  date: string;
  value: string;
  onChange: (time: string) => void;
  /** Change it to refetch (e.g. after a failed booking). */
  reloadKey?: number;
}

/** Start times of a doctor's day from the backend, which knows the schedule, visit length, days off and bookings. */
export default function SlotPicker({ doctorId, date, value, onChange, reloadKey = 0 }: Props) {
  const { t } = useTranslation();
  const [day, setDay] = useState<DaySlots | null>(null);

  useEffect(() => {
    setDay(null);
    if (!date) return;
    let cancelled = false;
    api
      .get<DaySlots>(`/doctors/${doctorId}/slots`, { params: { date } })
      .then(({ data }) => !cancelled && setDay(data))
      .catch(() => !cancelled && setDay({ slotMinutes: 60, closed: null, slots: [] }));
    return () => {
      cancelled = true;
    };
  }, [doctorId, date, reloadKey]);

  if (!date) return null;
  if (!day) return <div className="h-11 rounded-full bg-md-surface-container-low animate-pulse" role="status" />;

  const free = day.slots.filter((s) => s.free);
  if (day.closed || free.length === 0) {
    return (
      <p className="rounded-2xl bg-md-surface-container-low px-4 py-3 text-sm text-md-on-surface-variant">
        {day.closed ? t(`slots.closed.${day.closed}`) : t("doctor.noSlots")}
      </p>
    );
  }

  return (
    <div>
      <div role="radiogroup" aria-label={t("doctor.selectTime")} className="grid grid-cols-3 gap-2">
        {day.slots.map(({ time, free }) => {
          const active = value === time;
          return (
            <button
              key={time}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={!free}
              title={free ? undefined : t("doctor.slotBusy")}
              aria-label={free ? time : `${time} — ${t("doctor.slotBusy")}`}
              onClick={() => onChange(time)}
              className={`h-11 rounded-full text-sm font-bold tabular-nums transition-all cursor-pointer disabled:cursor-not-allowed disabled:line-through disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-md-primary ${
                active
                  ? "bg-md-primary text-white shadow-md shadow-md-primary/25"
                  : "bg-md-surface-container-low text-md-on-surface hover:bg-md-primary/10"
              }`}
            >
              {time}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-md-on-surface-variant mt-2 ml-1">
        {t("slots.duration").replace("{n}", String(day.slotMinutes))}
      </p>
    </div>
  );
}
