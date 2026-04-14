"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Stethoscope,
  ArrowRight,
  Activity,
  Microscope,
  ShieldCheck,
  Mail,
  User,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen overflow-hidden pt-20">
      {/* ── HERO SECTION ── */}
      <section className="bg-md-surface-container-low min-h-[700px] flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center w-full">
          <div className="space-y-8 py-12 animate-fade-in-up">
            <span className="inline-block px-4 py-1.5 bg-md-secondary-container text-md-on-secondary-container font-bold text-xs rounded-full uppercase tracking-wider font-headline">
              {t("hero.badge")}
            </span>
            <h1 className="font-headline text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-md-on-surface">
              <span className="text-md-primary block">{t("hero.title1")}</span>
              {t("hero.title2")}
            </h1>
            <div className="w-[50px] h-[3px] bg-md-primary"></div>
            <p className="text-md-on-surface-variant text-lg max-w-md leading-relaxed">
              {t("hero.desc")}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/doctors" className="bg-md-primary text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-md-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group font-headline">
                {t("hero.more")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/about" className="bg-md-secondary-container text-md-on-secondary-container px-8 py-4 rounded-full font-bold hover:scale-105 active:scale-95 transition-all font-headline">
                {t("hero.services")}
              </Link>
            </div>
          </div>
          <div className="relative hidden md:flex justify-end self-end">
            <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-md-primary/5 rounded-full blur-3xl"></div>
            <Image
              src="/healthcare-smile-and-portrait-of-doctor-man-in-h-2023-11-27-05-17-56-FQW3ASA-819x1024.png"
              alt="Professional doctor"
              width={500}
              height={600}
              className="relative z-10 w-auto h-auto max-h-[580px] object-contain"
              priority
              style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}
            />
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="bg-md-primary-container py-12 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { num: "15+", label: t("stats.years") },
              { num: "35+", label: t("stats.specialties") },
              { num: "20+", label: t("stats.doctors") },
              { num: "1000+", label: t("stats.patients") },
            ].map((stat, i) => (
              <div key={i} className="text-center md:text-left">
                <div className="text-4xl md:text-5xl font-black text-md-secondary-container mb-2 tracking-tighter font-headline">
                  {stat.num}
                </div>
                <div className="text-blue-100 font-medium text-sm md:text-base opacity-90 uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECHNOLOGY SECTION ── */}
      <section className="bg-md-surface-container-lowest py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <span className="text-md-secondary font-bold text-sm uppercase tracking-[0.2em] font-headline">{t("tech.badge")}</span>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-md-on-surface">
              {t("tech.title")} <span className="relative inline-block">{t("tech.titleHighlight")}<span className="absolute bottom-1 left-0 w-full h-3 bg-md-secondary-container/30 -z-10"></span></span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                img: "/uzi.png",
                tag: t("tech.uzi.tag"),
                title: t("tech.uzi.title"),
                desc: t("tech.uzi.desc"),
                icon: <Stethoscope className="w-6 h-6" />,
              },
              {
                img: "/sim.png",
                tag: t("tech.olympus.tag"),
                title: t("tech.olympus.title"),
                desc: t("tech.olympus.desc"),
                icon: <Activity className="w-6 h-6" />,
              },
              {
                img: "/rengen.png",
                tag: t("tech.xray.tag"),
                title: t("tech.xray.title"),
                desc: t("tech.xray.desc"),
                icon: <Microscope className="w-6 h-6" />,
              },
            ].map((item, i) => (
              <div key={i} className="group bg-md-surface-container-low rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-md-primary/10 transition-all duration-500">
                <div className="relative overflow-hidden h-64">
                  <Image
                    src={item.img}
                    alt={item.title}
                    width={400}
                    height={256}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-md-primary p-3 rounded-full text-white shadow-lg">
                    {item.icon}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-md-secondary-container text-md-on-secondary-container text-[10px] font-black px-3 py-1 rounded-full uppercase font-headline">
                    {item.tag}
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <h3 className="text-xl font-bold text-md-on-surface font-headline">{item.title}</h3>
                  <div className="w-12 h-1 bg-md-primary"></div>
                  <p className="text-md-on-surface-variant text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT SECTION ── */}
      <section className="bg-md-surface-container-low py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-md-on-surface leading-tight">
                {t("about.title1")} <span className="text-md-primary underline decoration-md-secondary-container decoration-4 underline-offset-8">{t("about.titleHighlight")}</span>
              </h2>
              <p className="text-md-on-surface-variant leading-relaxed text-lg">
                {t("about.desc")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: t("about.care247"), icon: <Mail className="w-6 h-6" /> },
                { label: t("about.safety"), icon: <ShieldCheck className="w-6 h-6" /> },
                { label: t("about.experts"), icon: <User className="w-6 h-6" /> },
                { label: t("about.equipment"), icon: <Activity className="w-6 h-6" /> },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-md-primary/10 rounded-full flex items-center justify-center text-md-primary group-hover:bg-md-primary group-hover:text-white transition-colors duration-300">
                    {item.icon}
                  </div>
                  <span className="font-bold text-sm text-md-on-surface">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-md-secondary-container rounded-2xl -z-10 rotate-12"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-md-primary rounded-full -z-10 opacity-10"></div>
            <Image
              src="/hero2.png"
              alt="Medical center"
              width={500}
              height={400}
              className="rounded-xl shadow-2xl w-full aspect-[4/3] object-cover border-8 border-white dark:border-[#1F1F28]"
            />
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="bg-md-primary-container relative overflow-hidden py-20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-md-secondary-container/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-8">
          <h2 className="font-headline text-4xl md:text-5xl font-black text-white leading-tight">
            {t("cta.title1")} <span className="text-md-secondary-container italic">{t("cta.title2")}</span>
          </h2>
          <p className="text-blue-100 text-lg opacity-90 max-w-2xl mx-auto">
            {t("cta.desc")}
          </p>
          <Link href="/doctors" className="bg-md-secondary-container text-md-on-secondary-container px-12 py-5 rounded-full font-black text-lg shadow-xl shadow-black/10 hover:scale-105 active:scale-95 transition-all inline-block font-headline">
            {t("cta.register")}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
