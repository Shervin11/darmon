"use client";
import useStore from "@/store/store";
import React, { useEffect } from "react";
import { Heart, Stethoscope, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FavoriteDoctor } from "@/store/store";
import { useTranslation } from "@/lib/i18n";
import { DefaultPhoto, ECG_WIDE, delay } from "@/lib/ui";

const Wishlist = () => {
  const { wishlistUser, userById, wishlist, deleteWishlist } = useStore((state) => state);
  const { t } = useTranslation();

  function handleRemoveFromFavorites(doctor: FavoriteDoctor) {
    deleteWishlist(doctor.doctorId);
  }

  useEffect(() => {
    if (userById?.id) wishlistUser();
  }, [userById?.id]);

  return (
    <div className="pt-20 pb-16">

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 mb-12 mt-4">
        <div className="relative overflow-hidden rounded-[2rem] bg-md-banner px-8 py-14 md:px-16 md:py-20">
          <svg aria-hidden="true" viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-6 h-28 w-full text-white/25">
            <path d={ECG_WIDE} pathLength="1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" className="fx-draw" />
          </svg>
          <div className="relative max-w-2xl space-y-4">
            <p className="fx-rise inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white font-headline" style={delay("0.05s")}>
              <span className="fx-beat h-2 w-2 rounded-full bg-white" />
              {t("wishlist.badge")}
            </p>
            <h1 className="fx-rise text-white font-headline font-extrabold text-4xl md:text-6xl tracking-tight leading-[1.05]" style={delay("0.2s")}>
              {t("wishlist.title")}
            </h1>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6">
        {wishlist?.favorites?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist?.favorites.map((doctor: FavoriteDoctor, i: number) => (
              <article
                key={doctor.doctorId ?? i}
                className="fx-rise group rounded-[2rem] bg-md-surface-container-lowest clinical-shadow p-4 flex flex-col gap-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,78,159,0.12)]"
                style={delay(`${Math.min(i, 8) * 0.07}s`)}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[1.5rem]">
                  <Link href={`/doctors/${doctor.doctorId}`} aria-label={doctor.name}>
                    <img
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={doctor.photo || DefaultPhoto}
                      alt={doctor.name}
                    />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleRemoveFromFavorites(doctor)}
                    aria-label="Убрать из избранного"
                    title="Убрать из избранного"
                    className="absolute bottom-3 right-3 h-11 w-11 flex items-center justify-center rounded-full bg-white/95 dark:bg-md-surface-container-high/95 backdrop-blur-sm text-red-500 shadow-lg transition-transform hover:scale-110 active:scale-90 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500"
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                </div>

                <div className="px-2 space-y-3">
                  <h3 className="font-headline font-bold text-xl text-md-on-surface leading-tight">{doctor.name}</h3>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-md-primary/10 text-md-primary px-3.5 py-1.5 text-sm font-semibold">
                    <Stethoscope className="w-3.5 h-3.5" />
                    {doctor.specialty}
                  </span>
                </div>

                <Link
                  href={`/doctors/${doctor.doctorId}`}
                  className="mt-auto inline-flex items-center justify-center gap-2 w-full bg-md-primary text-white font-headline font-bold py-3.5 rounded-full shadow-md shadow-md-primary/25 transition-all hover:shadow-lg active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-md-primary"
                >
                  {t("wishlist.bookAppointment")}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border-2 border-dashed border-md-surface-variant/40 px-8 py-20 text-center">
            <svg aria-hidden="true" viewBox="0 0 120 40" className="mx-auto mb-6 h-10 w-28 text-md-primary/40">
              <path d="M0 20 H44 L52 20 L58 6 L67 34 L74 20 H120" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h3 className="text-2xl md:text-3xl font-bold text-md-on-surface mb-3 font-headline">{t("wishlist.empty")}</h3>
            <p className="text-md-on-surface-variant mb-8 max-w-md mx-auto leading-relaxed">{t("wishlist.emptyDesc")}</p>
            <Link
              href="/doctors"
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-md-primary text-white rounded-full font-bold font-headline shadow-lg shadow-md-primary/25 transition-all hover:shadow-xl active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-md-primary"
            >
              {t("wishlist.findDoctors")}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Wishlist;