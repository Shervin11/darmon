"use client";

import React, { useEffect, useState, useMemo } from "react";
import useStore from "@/store/store";
import { Heart, ChevronRight, Search, ChevronDown, ChevronUp, MapPin, Activity, ChevronLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import FixedRating from "@/components/StarRating/page";
import { Doctor, Category } from "@/store/store";
import { useTranslation } from "@/lib/i18n";
import { DefaultPhoto, ECG_WIDE, delay } from "@/lib/ui";

const ITEMS_PER_PAGE = 6;
const CATEGORY_LIMIT = 6;

const Doctors = () => {
  const category: Category[] = useStore((state) => state.category);
  const doctor: Doctor[] = useStore((state) => state.doctor);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const { toggleWishlist, userById, isLoading, wishlist, wishlistUser, getCategory, getDoctor } = useStore((state) => state);
  const [doc, setDoc] = useState("");
  const [city, setCity] = useState("all");
  const [filterData, setFilterData] = useState(doctor);
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation();

  const verifiedDoctors = useMemo(() => {
    if (userById?.role === "doctor") return doctor;
    return doctor.filter(d => d.diplomaVerified === true);
  }, [doctor, userById?.role]);

  function searchDoctor() {
    let filtered = verifiedDoctors;
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
    setCurrentPage(1);
  }

  function searchDoctorByCategory(categoryName: string) {
    setFilterData(verifiedDoctors.filter((e) => e.specialty === categoryName));
    setCurrentPage(1);
  }

  useEffect(() => {
    getCategory();
    getDoctor();
  }, []);

  useEffect(() => {
    if (userById?.role === "client") wishlistUser();
  }, [userById?.id]);

  useEffect(() => {
    setFilterData(verifiedDoctors);
    setCurrentPage(1);
  }, [verifiedDoctors]);

  const displayedCategories = showAllCategories
    ? category
    : category.slice(0, CATEGORY_LIMIT);

  // Pagination
  const totalPages = Math.ceil(filterData.length / ITEMS_PER_PAGE);
  const paginatedDoctors = filterData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const pageBtn = "w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-md-primary";

  return (
    <div className="pt-20">

      {/* Banner */}
      <header className="relative bg-md-banner pt-16 pb-32 px-6 overflow-hidden">
        <svg aria-hidden="true" viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-16 h-28 w-full text-white/20">
          <path d={ECG_WIDE} pathLength="1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" className="fx-draw" />
        </svg>

        <div className="max-w-7xl mx-auto relative space-y-5">
          <p className="fx-rise inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white font-headline" style={delay("0.05s")}>
            <span className="fx-beat h-2 w-2 rounded-full bg-white" />
            {t("doctors.badge")}
          </p>
          <h1 className="fx-rise text-white font-headline font-extrabold text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] max-w-3xl" style={delay("0.2s")}>
            {t("doctors.title")}
          </h1>
        </div>
      </header>

      {/* Search bar */}
      <section className="max-w-6xl mx-auto px-6 -mt-12 relative z-20">
        <form
          onSubmit={(e) => { e.preventDefault(); searchDoctor(); }}
          className="bg-md-surface-container-lowest p-3 rounded-[2rem] md:rounded-full shadow-[0_20px_50px_rgba(0,78,159,0.12)] flex flex-col md:flex-row gap-3 items-stretch md:items-center"
        >
          <label className="flex-1 flex items-center bg-md-surface-container-low rounded-full px-5 py-3.5 gap-3 focus-within:ring-2 ring-md-primary/30 transition">
            <Search className="w-5 h-5 text-md-outline shrink-0" />
            <input
              value={doc}
              onChange={(e) => setDoc(e.target.value)}
              className="bg-transparent border-none focus:ring-0 w-full text-md-on-surface placeholder:text-md-outline outline-none"
              placeholder={t("doctors.searchPlaceholder")}
              type="text"
            />
          </label>
          <label className="md:w-64 flex items-center bg-md-surface-container-low rounded-full px-5 py-3.5 gap-3 focus-within:ring-2 ring-md-primary/30 transition">
            <MapPin className="w-5 h-5 text-md-outline shrink-0" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-transparent border-none focus:ring-0 w-full text-md-on-surface outline-none cursor-pointer"
            >
              <option value="all">{t("doctors.allCities")}</option>
              <option value="Душанбе">Душанбе</option>
              <option value="Хуҷанд">Хуҷанд</option>
              <option value="Бохтар">Бохтар</option>
              <option value="Кулоб">Кӯлоб</option>
              <option value="Истаравшан">Истаравшан</option>
            </select>
          </label>
          <button
            type="submit"
            className="bg-md-primary text-white font-headline font-bold px-10 py-3.5 rounded-full hover:bg-md-primary-container transition-all active:scale-95 shadow-lg shadow-md-primary/25 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-md-primary"
          >
            {t("doctors.find")}
          </button>
        </form>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Doctor List */}
        <div className="lg:col-span-8 space-y-5">
          {filterData.length > 0 && (
            <div className="flex items-center justify-between text-md-on-surface-variant px-2">
              <span className="font-headline font-bold text-lg text-md-on-surface">
                {filterData.length} {t("nav.doctors").toLowerCase()}
              </span>
              <span className="text-sm tabular-nums">{currentPage} / {totalPages}</span>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-5" role="status">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-52 rounded-[2rem] bg-md-surface-container-low animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          ) : paginatedDoctors.length > 0 ? (
            paginatedDoctors.map((e, i) => (
              <article
                key={e.id}
                className="fx-rise group bg-md-surface-container-lowest p-5 md:p-6 rounded-[2rem] shadow-[0_12px_40px_rgba(0,78,159,0.06)] flex flex-col md:flex-row gap-6 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,78,159,0.12)] hover:-translate-y-1"
                style={delay(`${i * 0.07}s`)}
              >
                <div className="relative w-full md:w-36 h-48 md:h-36 shrink-0">
                  <Link href={`/doctors/${e.id}`} aria-label={e.fullName}>
                    <img className="w-full h-full object-cover rounded-3xl" src={e.image || DefaultPhoto} alt={e.fullName} />
                  </Link>
                  {userById?.role === "client" && (
                    <button
                      onClick={() => toggleWishlist(e.id)}
                      aria-label="Wishlist"
                      className="absolute top-2 right-2 h-9 w-9 flex items-center justify-center bg-white/90 dark:bg-md-surface-container-high/90 backdrop-blur-sm rounded-full shadow-sm hover:text-red-500 hover:scale-110 transition-all cursor-pointer"
                    >
                      <Heart className={`w-4 h-4 ${wishlist?.favorites?.some(f => f.doctorId == e.id) ? "fill-red-500 text-red-500" : ""}`} />
                    </button>
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-2.5 min-w-0">
                    {e.specialty && (
                      <span className="inline-block text-sm font-headline font-semibold text-md-primary py-1 px-4 bg-md-primary/10 rounded-full">
                        {t(e.specialty)}
                      </span>
                    )}
                    <Link href={`/doctors/${e.id}`} className="text-2xl font-headline font-extrabold text-md-on-surface hover:text-md-primary transition-colors block leading-tight">
                      {e.fullName}
                    </Link>
                    <div className="flex items-center gap-2">
                      <FixedRating rating={e.rating || 0} />
                      <span className="text-md-outline text-sm">({e.comments?.length || 0} {t("doctors.reviews")})</span>
                    </div>
                    <p className="text-md-on-surface-variant line-clamp-2 leading-relaxed">{e.bio}</p>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between gap-4 md:min-w-[150px] border-t md:border-t-0 md:border-l border-md-outline-variant/20 pt-4 md:pt-0 md:pl-6">
                    <div className="md:text-right">
                      <p className="text-xs text-md-outline mb-1">{t("doctors.consultPrice")}</p>
                      <p className="text-2xl font-headline font-black text-md-primary">{e.price?.current} {e.price?.currency}</p>
                    </div>
                    <Link
                      href={`/doctors/${e.id}`}
                      className="inline-flex items-center gap-2 bg-md-primary text-white font-headline font-bold px-7 py-3 rounded-full shadow-md shadow-md-primary/20 transition-all hover:shadow-lg active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-md-primary"
                    >
                      {t("doctors.book")}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[2rem] border-2 border-dashed border-md-outline-variant/40 px-8 py-20 text-center">
              <svg aria-hidden="true" viewBox="0 0 120 40" className="mx-auto mb-5 h-10 w-28 text-md-primary/40">
                <path d="M0 20 H44 L52 20 L58 6 L67 34 L74 20 H120" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-md-on-surface-variant text-lg">{t("doctors.notFound")}</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Pagination" className="flex items-center justify-center gap-2 pt-8">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className={`${pageBtn} bg-md-surface-container-low hover:bg-md-primary/10 text-md-on-surface-variant disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  aria-current={currentPage === page ? "page" : undefined}
                  className={`${pageBtn} font-bold text-sm ${
                    currentPage === page
                      ? "bg-md-primary text-white shadow-md shadow-md-primary/25"
                      : "bg-md-surface-container-low hover:bg-md-primary/10 text-md-on-surface-variant"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className={`${pageBtn} bg-md-surface-container-low hover:bg-md-primary/10 text-md-on-surface-variant disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </nav>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4">
          <div className="bg-md-surface-container-low p-7 rounded-[2rem] lg:sticky lg:top-28">
            <h2 className="text-2xl font-headline font-extrabold tracking-tight text-md-on-surface mb-6">
              {t("doctors.categories")}
            </h2>
            <ul className="space-y-2.5">
              {displayedCategories.map((cat) => {
                const open = selectedCategory?.id === cat.id;
                return (
                  <li key={cat.id}>
                    <button
                      onClick={() => setSelectedCategory(open ? null : cat)}
                      aria-expanded={open}
                      className={`group w-full flex items-center justify-between p-3 pr-4 rounded-full text-left cursor-pointer transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-md-primary ${
                        open ? "bg-md-primary text-white shadow-md shadow-md-primary/25" : "bg-md-surface-container-lowest hover:translate-x-1 shadow-sm"
                      }`}
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <span className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center overflow-hidden ${open ? "bg-white/20 text-white" : "bg-md-primary/10 text-md-primary"}`}>
                          {cat.image ? (
                            <img src={cat.image} alt={cat.name} className="w-6 h-6 object-contain" />
                          ) : (
                            <Activity className="w-5 h-5" />
                          )}
                        </span>
                        <span className={`font-headline font-bold text-sm truncate ${open ? "text-white" : "text-md-on-surface"}`}>
                          {cat.name ? t(cat.name) : ""}
                        </span>
                      </span>
                      <ChevronRight className={`w-5 h-5 shrink-0 transition-transform duration-300 ${open ? "rotate-90 text-white" : "text-md-outline group-hover:text-md-primary"}`} />
                    </button>

                    {open && (
                      <div className="fx-open grid grid-cols-1 gap-1 mx-3 mt-2 mb-1 border-l-2 border-md-primary/30 pl-4 py-1">
                        {cat.subcategories?.map((sub, idx) => (
                          <button
                            key={idx}
                            onClick={() => searchDoctorByCategory(sub)}
                            className="text-left text-sm py-2 px-3 rounded-full hover:bg-md-primary/10 text-md-on-surface-variant hover:text-md-primary transition-colors cursor-pointer"
                          >
                            {t(sub)}
                          </button>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            {category.length > CATEGORY_LIMIT && (
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="w-full mt-6 py-3.5 border border-md-outline-variant/40 text-md-on-surface-variant font-headline font-bold text-sm rounded-full hover:bg-md-surface-container-lowest transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {showAllCategories ? (
                  <>{t("doctors.showLess")} <ChevronUp className="w-4 h-4" /></>
                ) : (
                  <>{t("doctors.showAll")} ({category.length}) <ChevronDown className="w-4 h-4" /></>
                )}
              </button>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
};

export default Doctors;