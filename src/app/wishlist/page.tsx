"use client";
import useStore from "@/store/store";
import React, { useEffect } from "react";
import { Heart, Stethoscope } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { DefaultPhoto } from "@/config/config";
import { FavoriteDoctor } from "@/store/store";
import { useTranslation } from "@/lib/i18n";

const Wishlist = () => {
  const { loginMe, wishlistUser, userById, wishlist, deleteWishlist } =
    useStore((state) => state);
  const { t } = useTranslation();

  function handleRemoveFromFavorites(doctor: FavoriteDoctor) {
    deleteWishlist(userById.id!, doctor.doctorId);
  }
  useEffect(() => {
    loginMe();
  }, []);

  useEffect(() => {
    if (userById?.id) {
      wishlistUser(userById.id);
    }
  }, [userById]);

  return (
    <div className="pt-20 pb-12">
      {/* Hero Banner */}
      <section className="max-w-7xl mx-auto px-6 mb-12 mt-4">
        <div className="relative bg-[#00A191] rounded-xl pt-16 pb-20 px-10 md:px-16 overflow-hidden flex flex-col items-center justify-center text-center">
          {/* Glow effects */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#00C4B0] rounded-full blur-[120px]"></div>
            <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-[#007D70] rounded-full blur-[120px]"></div>
          </div>
          
          <div className="relative z-10">
            <span className="text-[#A7F3EB] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 inline-block font-headline">{t("wishlist.badge")}</span>
            <h1 className="text-white font-headline font-extrabold text-4xl md:text-5xl tracking-tight">{t("wishlist.title")}</h1>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist?.favorites?.length > 0 ? (
            wishlist?.favorites.map((doctor: FavoriteDoctor, i: number) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-xl bg-md-surface-container-lowest clinical-shadow hover:shadow-[0_20px_60px_rgba(0,78,159,0.12)] transition-all duration-500"
              >
                <div className="h-20 card-header-gradient relative">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-3 right-3 w-8 cursor-pointer h-8 rounded-full bg-white/90 dark:bg-[#252540]/90 backdrop-blur-sm hover:bg-white text-red-500 hover:text-red-600 transition-all duration-300 border border-white/20 shadow-sm"
                    onClick={() => handleRemoveFromFavorites(doctor)}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </Button>
                </div>

                <div className="px-6 -mt-12 relative z-10">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full border-4 border-white dark:border-[#1F1F28] shadow-lg overflow-hidden bg-white dark:bg-[#1F1F28]">
                        <img
                          className="w-full h-full object-cover"
                          src={doctor.photo || DefaultPhoto}
                          alt={doctor.name}
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-md-secondary rounded-full border-2 border-white dark:border-[#1F1F28] flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center space-y-4 py-4">
                    <div>
                      <h3 className="font-bold text-lg text-md-on-surface leading-tight mb-1 font-headline">
                        {doctor.name}
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <Badge
                        variant="secondary"
                        className="bg-md-primary/10 text-md-primary hover:bg-md-primary/20 font-medium px-3 py-1"
                      >
                        <Stethoscope className="w-3 h-3 mr-1" />
                        {doctor.specialty}
                      </Badge>
                    </div>

                    <Link
                      href={`/doctors/${doctor.doctorId}`}
                      className="block pb-4"
                    >
                      <button className="w-full cursor-pointer signature-gradient hover:opacity-90 text-white font-semibold py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 uppercase tracking-wider font-headline text-sm">
                        {t("wishlist.bookAppointment")}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <div className="text-center py-16 px-6">
                <div className="w-24 h-24 bg-md-surface-container-low rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-12 h-12 text-md-on-surface-variant" />
                </div>
                <h3 className="text-2xl font-bold text-md-on-surface mb-3 font-headline">
                  {t("wishlist.empty")}
                </h3>
                <p className="text-md-on-surface-variant mb-6 max-w-md mx-auto">
                  {t("wishlist.emptyDesc")}
                </p>
                <Link href={"/doctors"}>
                  <Button
                    variant="outline"
                    className="border-md-primary cursor-pointer text-md-primary hover:bg-md-primary/5 bg-transparent"
                  >
                    {t("wishlist.findDoctors")}
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Wishlist;
