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
  Search,
  Clock,
  PlayCircle,
  CalendarCheck
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen overflow-hidden">
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-[700px] md:min-h-[800px] flex items-center overflow-hidden bg-gradient-to-br from-[#0A2342] via-[#1a365d] to-[#0f172a] pb-20 pt-[80px]">
        {/* Background Gradients/Glows */}
        <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-r from-transparent to-[#00A896]/10 pointer-events-none z-0"></div>
        <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-[#00A896]/5 to-transparent pointer-events-none z-0"></div>

        {/* Decorative circles */}
        <div className="absolute w-[450px] h-[450px] -top-[100px] -right-[100px] rounded-full bg-[#00A896]/10 pointer-events-none z-0 blur-[2px]"></div>
        <div className="absolute w-[250px] h-[250px] bottom-[30px] left-[30px] rounded-full bg-[#00A896]/5 pointer-events-none z-0 blur-[1px]"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center w-full mt-8">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up md:pl-4">
            <h1 className="font-headline text-5xl md:text-[64px] font-extrabold text-white leading-[1.1] tracking-tight">
              <span className="text-[#00A896]">Darmon</span> — {t("hero.title2") || "Тибби оянда"}
            </h1>

            <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-lg font-light">
              {t("hero.desc") || "Экосистемае, ки табибон ва беморонро муттаҳид мекунад. Ҷустуҷӯи дақиқ, шаффофият ва эътимод."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 w-full">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-start gap-4 backdrop-blur-sm transition-transform hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-[#00A896]/20 flex items-center justify-center shrink-0">
                  <Search className="w-6 h-6 text-[#00A896]" />
                </div>
                <div>
                  <div className="font-headline font-semibold text-white text-[15px] mb-1">Ҷустуҷӯи дақиқ</div>
                  <div className="text-[13px] text-white/60 leading-tight">Пайдо кардани мутахассис бо чанд клик</div>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-start gap-4 backdrop-blur-sm transition-transform hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-[#00A896]/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[#00A896]" />
                </div>
                <div>
                  <div className="font-headline font-semibold text-white text-[15px] mb-1">Шаффофият</div>
                  <div className="text-[13px] text-white/60 leading-tight">Рейтинг дар асоси таҷрибаи воқеӣ</div>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-start gap-4 backdrop-blur-sm transition-transform hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-[#00A896]/20 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-[#00A896]" />
                </div>
                <div>
                  <div className="font-headline font-semibold text-white text-[15px] mb-1">Сарфаи вақт</div>
                  <div className="text-[13px] text-white/60 leading-tight">Фармоиши осон ва бехатар</div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link href="/doctors" className="inline-flex items-center gap-3 bg-gradient-to-br from-[#00A896] to-[#00BFA5] text-white px-8 py-4 rounded-xl font-headline font-semibold text-lg shadow-[0_8px_32px_rgba(0,168,150,0.3)] hover:scale-105 active:scale-95 transition-all">
                <PlayCircle className="w-6 h-6" />
                <span>{t("hero.more") || "Оғози кор"}</span>
              </Link>
            </div>
          </div>

          {/* Right Floating Elements */}
          <div className="relative hidden lg:flex justify-center items-center h-[600px] w-full">
            {/* Card 1: Doctor */}
            <div className="absolute top-[15%] right-[5%] w-[300px] bg-white/10 border border-white/15 rounded-[20px] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.3)] backdrop-blur-md z-20 animate-float" style={{ animationDelay: '0s' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#00A896] to-[#00BFA5] flex items-center justify-center text-white shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-white">Доктор Аҳмадов</div>
                  <div className="text-[13px] text-white/70">Кардиолог</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-white mb-4">
                <div className="w-2 h-2 rounded-full bg-[#00D1B2] shadow-[0_0_8px_#00D1B2]"></div>
                <span>Онлайн</span>
              </div>
              <div className="flex gap-5 border-t border-white/10 pt-4">
                <div className="flex-1">
                  <div className="text-xl font-bold text-white">4.9</div>
                  <div className="text-[11px] uppercase tracking-wider text-white/50 mt-1">Рейтинг</div>
                </div>
                <div className="flex-1">
                  <div className="text-xl font-bold text-white">150+</div>
                  <div className="text-[11px] uppercase tracking-wider text-white/50 mt-1">Шарҳҳо</div>
                </div>
              </div>
            </div>

            {/* Card 2: Diagnosis */}
            <div className="absolute top-[45%] right-[40%] w-[260px] bg-[#00A896]/15 border border-white/15 rounded-[20px] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.3)] backdrop-blur-md z-30 animate-float" style={{ animationDelay: '1.5s' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#00A896] to-[#00BFA5] flex items-center justify-center text-white shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-white">Ташхис</div>
                  <div className="text-[13px] text-white/70">AI ёвар</div>
                </div>
              </div>
              <div className="text-[13px] text-white/90 leading-relaxed">
                Системаи ҳушманди ташхиси аввалия
              </div>
            </div>

            {/* Card 3: Schedule */}
            <div className="absolute bottom-[20%] right-[15%] w-[220px] bg-white/5 border border-white/15 rounded-[20px] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.3)] backdrop-blur-md z-10 animate-float" style={{ animationDelay: '0.7s' }}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#00A896] to-[#00BFA5] flex items-center justify-center text-white shrink-0">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-white">Вақт</div>
                  <div className="text-[13px] text-white/70">Дастрас</div>
                </div>
              </div>
            </div>
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
