"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Building2, MapPin, Search, Stethoscope, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { useTranslation } from "@/lib/i18n";
import { ECG_WIDE, delay } from "@/lib/ui";

interface ClinicCard {
  id: number;
  fullName: string;
  clinicName?: string | null;
  city: string;
  address: string;
  image: string;
  doctorsCount: number;
}

export default function ClinicsPage() {
  const { t } = useTranslation();
  const [clinics, setClinics] = useState<ClinicCard[] | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.get<ClinicCard[]>("/clinics").then(({ data }) => setClinics(data)).catch(() => setClinics([]));
  }, []);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (clinics ?? []).filter((c) =>
      [c.clinicName, c.fullName, c.city, c.address].some((v) => v?.toLowerCase().includes(q)),
    );
  }, [clinics, query]);

  return (
    <div className="pt-20 pb-16">
      <section className="max-w-7xl mx-auto px-6 mb-10 mt-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-md-banner px-8 py-14 md:px-16 md:py-20">
          <svg aria-hidden="true" viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-6 h-28 w-full text-white/25">
            <path d={ECG_WIDE} pathLength="1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" className="fx-draw" />
          </svg>
          <div className="relative max-w-2xl space-y-4">
            <h1 className="fx-rise text-white font-headline font-extrabold tracking-tight leading-[1.05] text-4xl md:text-6xl" style={delay("0.1s")}>
              {t("clinics.title")}
            </h1>
            <p className="fx-rise text-md-on-banner-muted text-lg md:text-xl leading-relaxed" style={delay("0.3s")}>
              {t("clinics.subtitle")}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 space-y-6">
        <label className="relative block max-w-md">
          <span className="sr-only">{t("clinics.search")}</span>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-md-on-surface-variant" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("clinics.search")}
            className="w-full h-12 rounded-full bg-md-surface-container-low pl-12 pr-5 text-md-on-surface outline-none focus:ring-2 ring-md-primary/20"
          />
        </label>

        {clinics === null ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" role="status">
            {[0, 1, 2].map((i) => <div key={i} className="h-44 rounded-[2rem] bg-md-surface-container-low animate-pulse" />)}
          </div>
        ) : shown.length === 0 ? (
          <p className="rounded-[2rem] border-2 border-dashed border-md-surface-variant/40 px-8 py-12 text-center text-md-on-surface-variant">
            {t("clinics.empty")}
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((c, i) => (
              <Link
                key={c.id}
                href={`/clinics/${c.id}`}
                className="fx-rise group rounded-[2rem] bg-md-surface-container-lowest clinical-shadow p-7 flex flex-col gap-4 transition-transform duration-500 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-md-primary"
                style={delay(`${Math.min(i, 8) * 0.06}s`)}
              >
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 shrink-0 rounded-2xl bg-md-primary/10 text-md-primary flex items-center justify-center overflow-hidden">
                    {c.image ? <img src={c.image} alt="" className="h-full w-full object-cover" /> : <Building2 className="w-6 h-6" />}
                  </div>
                  <h2 className="font-headline font-bold text-xl text-md-on-surface leading-tight">{c.clinicName || c.fullName}</h2>
                </div>
                {(c.city || c.address) && (
                  <p className="flex items-start gap-2 text-sm text-md-on-surface-variant">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-md-primary" />
                    {[c.city, c.address].filter(Boolean).join(", ")}
                  </p>
                )}
                <div className="mt-auto flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-2 rounded-full bg-md-surface-container px-4 py-2 text-md-on-surface">
                    <Stethoscope className="w-4 h-4 text-md-primary" />
                    {t("clinics.doctors")}: {c.doctorsCount}
                  </span>
                  <ArrowRight className="w-5 h-5 text-md-primary transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
