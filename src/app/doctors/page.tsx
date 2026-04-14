"use client";

import React, { useEffect, useState } from "react";
import useStore from "@/store/store";
import { Heart, ChevronRight, Search, ChevronDown, ChevronUp, MapPin, Activity } from "lucide-react";
import Link from "next/link";
import FixedRating from "@/components/StarRating/page";
import toast from "react-hot-toast";
import { DefaultPhoto } from "@/config/config";
import { Doctor, Category } from "@/store/store";
import { useTranslation } from "@/lib/i18n";

const Doctors = () => {
  const category: Category[] = useStore((state) => state.category);
  const doctor: Doctor[] = useStore((state) => state.doctor);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const CATEGORY_LIMIT = 6;
  const { toggleWishlist, userById, loginMe, isLoading, wishlist, wishlistUser } = useStore((state) => state);
  const [doc, setDoc] = useState("");
  const [city, setCity] = useState("all");
  const [filterData, setFilterData] = useState(doctor);
  const getCategory = useStore.getState().getCategory;
  const getDoctor = useStore.getState().getDoctor;
  const { t } = useTranslation();

  function searchDoctor() {
    let filtered = doctor;
    if (doc) {
      filtered = filtered.filter(e =>
        e.fullName.toLowerCase().includes(doc.toLowerCase()) ||
        (e.clinic && e.clinic.toLowerCase().includes(doc.toLowerCase()))
      );
    }
    if (city !== "all") {
      filtered = filtered.filter(e => e.city === city);
    }
    setFilterData(filtered);
  }

  function searchDoctorByCategory(categoryName: string) {
    setFilterData(doctor.filter((e) => e.specialty === categoryName));
  }

  useEffect(() => {
    getCategory();
    getDoctor();
    loginMe();
  }, []);

  useEffect(() => {
    if (userById?.id) wishlistUser(userById.id);
  }, [userById]);

  useEffect(() => {
    setFilterData(doctor);
  }, [doctor]);

  const displayedCategories = showAllCategories
    ? category
    : category.slice(0, CATEGORY_LIMIT);

  return (
    <div className="bg-md-surface-container-low min-h-screen pt-20">
  <div className="absolute inset-0 opacity-20">
    <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-[#007D70] rounded-full blur-[120px]"></div>
  </div>

  <div className="max-w-7xl mx-auto relative z-10 text-center">
      <section className="max-w-5xl mx-auto px-6 -mt-12 relative z-20">
        <div className="bg-md-surface-container-lowest p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,78,159,0.12)] flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full flex items-center bg-md-surface-container-low rounded-xl px-4 py-3 gap-3">
            <Search className="w-5 h-5 text-md-outline" />
            <input
              value={doc}
              onChange={(e) => setDoc(e.target.value)}
              className="bg-transparent border-none focus:ring-0 w-full text-md-on-surface text-sm placeholder:text-md-outline outline-none"
              placeholder={t("doctors.searchPlaceholder")}
              type="text"
            />
          </div>
          <div className="w-full md:w-64 flex items-center bg-md-surface-container-low rounded-xl px-4 py-3 gap-3">
            <MapPin className="w-5 h-5 text-md-outline" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-transparent border-none focus:ring-0 w-full text-md-on-surface text-sm appearance-none outline-none"
            >
              <option value="all">{t("doctors.allCities")}</option>
              <option value="Душанбе">Душанбе</option>
              <option value="Хуҷанд">Хуҷанд</option>
              <option value="Бохтар">Бохтар</option>
              <option value="Кулоб">Кӯлоб</option>
              <option value="Истаравшан">Истаравшан</option>
            </select>
          </div>
          <button
            onClick={searchDoctor}
            className="w-full md:w-auto bg-md-primary text-white font-headline font-bold px-10 py-3.5 rounded-full hover:bg-md-primary-container transition-all active:scale-95 shadow-lg cursor-pointer"
          >
            {t("doctors.find")}
          </button>
        </div>
      </section>

        <div className="lg:col-span-8 space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-md-primary"></div>
            </div>
          ) : filterData.length > 0 ? (
            filterData.map((e) => (
              <div key={e.id} className="bg-md-surface-container-lowest p-6 rounded-[1.5rem] shadow-[0_12px_40px_rgba(0,78,159,0.06)] flex flex-col md:flex-row gap-6 hover:shadow-[0_20px_60px_rgba(0,78,159,0.1)] transition-shadow duration-300">
                <div className="relative w-full md:w-32 h-32 flex-shrink-0">
                  <Link href={`/doctors/${e.id}`}>
                    <img className="w-full h-full object-cover rounded-xl" src={e.image || DefaultPhoto} alt={e.fullName} />
                  </Link>
                  <button
                    onClick={() => userById?.id ? toggleWishlist(userById.id, e) : toast.error(t("doctor.loginToBook"))}
                    className="absolute top-2 right-2 bg-white/90 dark:bg-[#252540]/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Heart className={`w-4 h-4 ${wishlist?.favorites?.some(f => f.doctorId == e.id) ? "fill-red-500 text-red-500" : ""}`} />
                  </button>
                </div>
                <div className="flex-1 flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-headline font-bold text-md-primary tracking-widest uppercase py-1 px-3 bg-md-primary/5 rounded-full">{e.specialty}</span>
                    <Link href={`/doctors/${e.id}`} className="text-xl font-headline font-extrabold text-md-on-surface hover:text-md-primary cursor-pointer transition-colors block">{e.fullName}</Link>
                    <div className="flex items-center gap-2">
                      <FixedRating rating={e.rating || 0} />
                      <span className="text-md-outline text-xs font-medium">({e.comments?.length || 0} {t("doctors.reviews")})</span>
                    </div>
                    <p className="text-md-on-surface-variant text-sm line-clamp-2 leading-relaxed">{e.bio}</p>
                  </div>
                  <div className="flex flex-col items-start md:items-end justify-between min-w-[140px] border-t md:border-t-0 md:border-l border-md-outline-variant/20 pt-4 md:pt-0 md:pl-6">
                    <div className="md:text-right">
                      <p className="text-[10px] text-md-outline font-bold uppercase tracking-wider mb-1">{t("doctors.consultPrice")}</p>
                      <p className="text-xl font-black text-md-primary">{e.price?.current} {e.price?.currency}</p>
                    </div>
                    <Link href={`/doctors/${e.id}`} className="w-full md:w-auto bg-md-secondary-container text-md-on-secondary-container font-headline font-extrabold px-8 py-3 rounded-full hover:bg-md-secondary hover:text-white transition-all active:scale-95 shadow-sm mt-4 text-center">
                      {t("doctors.book")}
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-md-surface-container-lowest rounded-2xl p-20 text-center border border-dashed border-md-outline-variant">
              <p className="text-md-on-surface-variant">{t("doctors.notFound")}</p>
            </div>
          )}
        </div>

