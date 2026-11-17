"use client";

import { useEffect, useState } from "react";
import { FileText, Printer, ShieldCheck, Stethoscope } from "lucide-react";
import useStore from "@/store/store";
import { api } from "@/lib/api";
import { useTranslation } from "@/lib/i18n";

interface MedicalRecord {
  id: number;
  doctorName: string;
  data: { complaints?: string; diagnosis?: string; treatment?: string; follow_up?: string };
  createdAt: string;
}

interface AccessEntry {
  id: number;
  action: "view" | "create" | "update" | "delete";
  fullName: string;
  role: string;
  createdAt: string;
}

const FIELDS = [
  ["complaints", "protocol.complaints"],
  ["diagnosis", "protocol.diagnosis"],
  ["treatment", "protocol.treatment"],
  ["follow_up", "protocol.followUp"],
] as const;

const formatDate = (iso: string) => new Date(iso).toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" });

/** The patient's own medical card: every visit record, printable, plus who opened it. */
export default function RecordsPage() {
  const { t } = useTranslation();
  const user = useStore((s) => s.userById);
  const [records, setRecords] = useState<MedicalRecord[] | null>(null);
  const [log, setLog] = useState<AccessEntry[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    api.get<MedicalRecord[]>("/medical-records").then(({ data }) => setRecords(data)).catch(() => setRecords([]));
    api.get<AccessEntry[]>("/users/me/access-log").then(({ data }) => setLog(data)).catch(() => {});
  }, [user?.id]);

  return (
    <div className="pt-24 pb-16 max-w-5xl mx-auto px-6 space-y-10 print:pt-0">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-headline font-extrabold text-3xl md:text-5xl tracking-tight text-md-on-surface">{t("records.title")}</h1>
          <p className="mt-2 text-md-on-surface-variant">
            {user?.fullName}
            {user?.phone ? ` · ${user.phone}` : ""}
          </p>
        </div>
        {!!records?.length && (
          <button
            onClick={() => window.print()}
            className="print:hidden inline-flex items-center gap-2 rounded-full bg-md-primary px-6 py-3 font-headline font-bold text-white shadow-lg shadow-md-primary/25 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            {t("records.print")}
          </button>
        )}
      </header>

      {records === null ? (
        <div className="h-48 rounded-[2rem] bg-md-surface-container-low animate-pulse" role="status" />
      ) : records.length === 0 ? (
        <p className="rounded-[2rem] border-2 border-dashed border-md-surface-variant/40 px-8 py-12 text-center text-md-on-surface-variant">
          {t("records.empty")}
        </p>
      ) : (
        <div className="space-y-5">
          {records.map((r) => (
            <article key={r.id} className="rounded-[2rem] bg-md-surface-container-lowest clinical-shadow p-6 md:p-8 space-y-4 break-inside-avoid print:shadow-none print:border print:border-black/20">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="inline-flex items-center gap-2 font-headline font-bold text-md-on-surface">
                  <Stethoscope className="w-5 h-5 text-md-primary" />
                  {r.doctorName}
                </p>
                <p className="text-sm text-md-on-surface-variant tabular-nums">{formatDate(r.createdAt)}</p>
              </div>
              <dl className="grid gap-4 md:grid-cols-2">
                {FIELDS.filter(([key]) => r.data[key]).map(([key, label]) => (
                  <div key={key} className="rounded-2xl bg-md-surface-container-low px-5 py-4 print:bg-transparent print:px-0">
                    <dt className="text-xs font-bold uppercase tracking-wide text-md-primary">{t(label)}</dt>
                    <dd className="mt-1 whitespace-pre-wrap text-md-on-surface">{r.data[key]}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      )}

      <section className="print:hidden rounded-[2rem] bg-md-surface-container-low p-6 md:p-8 space-y-4">
        <h2 className="inline-flex items-center gap-2 font-headline font-bold text-xl text-md-on-surface">
          <ShieldCheck className="w-5 h-5 text-md-primary" />
          {t("records.accessLog")}
        </h2>
        <p className="text-sm text-md-on-surface-variant">{t("records.accessLogDesc")}</p>
        {log.length === 0 ? (
          <p className="text-sm text-md-on-surface-variant">{t("records.noAccess")}</p>
        ) : (
          <ul className="divide-y divide-md-outline-variant/20">
            {log.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <span className="inline-flex items-center gap-2 text-md-on-surface">
                  <FileText className="w-4 h-4 text-md-primary" />
                  {e.fullName} — {t(`records.action.${e.action}`)}
                </span>
                <span className="text-md-on-surface-variant tabular-nums">{formatDate(e.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
