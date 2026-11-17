"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Building2, MapPin, Phone, Star, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { useTranslation } from "@/lib/i18n";
import { DefaultPhoto, ECG_WIDE } from "@/lib/ui";
import type { Doctor } from "@/store/store";

interface ClinicPage {
  id: number;
  fullName: string;
  clinicName?: string | null;
  city: string;
  address: string;
  phone: string;
  image: string;
  doctors: Doctor[];
}

export default function ClinicDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useTranslation();
  const [clinic, setClinic] = useState<ClinicPage | null | undefined>(undefined);

  useEffect(() => {
    api.get<ClinicPage>(`/clinics/${id}`).then(({ data }) => setClinic(data)).catch(() => setClinic(null));
  }, [id]);

  if (clinic === undefined) {
    return <div className="pt-28 max-w-7xl mx-auto px-6"><div className="h-60 rounded-[2rem] bg-md-surface-container-low animate-pulse" role="status" /></div>;
  }
  if (clinic === null) {
    return <p className="pt-32 pb-20 text-center text-md-on-surface-variant">{t("clinics.notFound")}</p>;
  }

  const name = clinic.clinicName || clinic.fullName;

  return (
    <div className="pt-20 pb-16">
      <header className="max-w-7xl mx-auto px-6 mt-6 mb-10">
        <div className="relative overflow-hidden rounded-[2rem] bg-md-banner px-8 py-12 md:px-14 md:py-16">
          <svg aria-hidden="true" viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-4 h-24 w-full text-white/20">
            <path d={ECG_WIDE} pathLength="1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" className="fx-draw" />
          </svg>
          <div className="relative flex flex-col md:flex-row md:items-center gap-6">
            <div className="h-20 w-20 shrink-0 rounded-3xl bg-white/15 text-white flex items-center justify-center overflow-hidden">
              {clinic.image ? <img src={clinic.image} alt="" className="h-full w-full object-cover" /> : <Building2 className="w-9 h-9" />}
            </div>
            <div className="space-y-3">
              <h1 className="text-white font-headline font-extrabold tracking-tight text-3xl md:text-5xl">{name}</h1>
              <div className="flex flex-wrap gap-3 text-sm text-white/90">
                {(clinic.city || clinic.address) && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2">
                    <MapPin className="w-4 h-4" />
                    {[clinic.city, clinic.address].filter(Boolean).join(", ")}
                  </span>
                )}
                {clinic.phone && (
                  <a href={`tel:${clinic.phone}`} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 hover:bg-white/25">
                    <Phone className="w-4 h-4" />
                    {clinic.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6">
        <h2 className="font-headline font-bold text-2xl md:text-3xl text-md-on-surface mb-6">{t("clinics.ourDoctors")}</h2>
        {clinic.doctors.length === 0 ? (
          <p className="text-md-on-surface-variant">{t("clinics.noDoctors")}</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {clinic.doctors.map((d) => (
              <Link
                key={d.id}
                href={`/doctors/${d.id}`}
                className="group rounded-[2rem] bg-md-surface-container-lowest clinical-shadow p-6 flex items-center gap-4 transition-transform duration-500 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-md-primary"
              >
                <img src={d.image || DefaultPhoto} alt="" className="h-16 w-16 rounded-full object-cover bg-md-primary/10" />
                <div className="min-w-0 flex-1">
                  <p className="font-headline font-bold text-md-on-surface truncate">{d.fullName}</p>
                  <p className="text-sm text-md-primary">{d.specialty ? t(d.specialty) : ""}</p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-md-on-surface-variant">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    {d.rating || "—"}
                    {d.price?.current ? <span className="ml-2">· {d.price.current} {d.price.currency}</span> : null}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-md-primary transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
