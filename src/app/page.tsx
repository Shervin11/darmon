"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Stethoscope,
  Activity,
  Microscope,
  ShieldCheck,
  Mail,
  User,
  Search,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { ECG_WIDE, delay } from "@/lib/ui";

const Home = () => {
  const { t } = useTranslation();

  const heroFeatures = [
    {
      icon: Search,
      title: t("hero.title1") || "Ҷустуҷӯи дақиқ",
      desc: t("hero.f1Desc") || "Пайдо кардани мутахассис бо чанд клик",
    },
    {
      icon: ShieldCheck,
      title: t("hero.title2") || "Шаффофият",
      desc: t("hero.f2Desc") || "Рейтинг дар асоси таҷрибаи воқеӣ",
    },
    {
      icon: Clock,
      title: t("hero.title3") || "Дар як платформа",
      desc: t("hero.f3Desc") || "Фармоиши осон ва бехатар",
    },
  ];

  const techItems = [
    {
      img: "/uzi.png",
      tag: t("tech.uzi.tag") || "УЗИ",
      title: t("tech.uzi.title") || "УЗИ-диагностика",
      desc:
        t("tech.uzi.desc") ||
        "Таҷҳизоти муосири ултрасадоӣ барои ташхиси дақиқи аъзои дохилӣ.",
      icon: Stethoscope,
    },
    {
      img: "/sim.png",
      tag: t("tech.olympus.tag") || "Olympus",
      title: t("tech.olympus.title") || "Эндоскопияи Olympus",
      desc:
        t("tech.olympus.desc") ||
        "Системаи пешрафтаи эндоскопӣ барои ташхиси бедард ва дақиқ.",
      icon: Activity,
    },
    {
      img: "/rengen.png",
      tag: t("tech.xray.tag") || "Рентген",
      title: t("tech.xray.title") || "Рентгенографияи рақамӣ",
      desc:
        t("tech.xray.desc") ||
        "Аксбардории рақамӣ бо миқдори ҳадди ақали нурафкакании радиоактивӣ.",
      icon: Microscope,
    },
  ];

  const stats = [
    { num: "15+", label: t("stats.years") || "Сол таҷриба" },
    { num: "35+", label: t("stats.specialties") || "Мутахассисон" },
    { num: "20+", label: t("stats.doctors") || "Духтурони пешсаф" },
    { num: "1000+", label: t("stats.patients") || "Беморони қаноатманд" },
  ];

  const aboutBadges = [
    { label: t("about.care247") || "Ғамхории 24/7", icon: Mail },
    { label: t("about.safety") || "Бехатарии пӯшида", icon: ShieldCheck },
    { label: t("about.experts") || "Мутахассисони ботаҷриба", icon: User },
    { label: t("about.equipment") || "Таҷҳизоти муосир", icon: Activity },
  ];

  return (
    <div className="pt-20 overflow-hidden min-h-screen">

      {/* ── HERO SECTION ── */}
      <section className="relative pt-10 pb-20 md:pt-16 md:pb-28">
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-6 h-24 w-full text-md-primary/25 pointer-events-none"
        >
          <path
            d={ECG_WIDE}
            pathLength="1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className="fx-draw"
          />
        </svg>

        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Content Left */}
          <div className="lg:col-span-7 space-y-8">
            <div className="fx-rise space-y-3" style={delay("0.05s")}>
              <span className="inline-flex items-center gap-2 rounded-full bg-md-primary/10 px-4 py-1.5 text-sm font-bold text-md-primary font-headline">
                <Sparkles className="w-4 h-4" />
                Darmon Medical Platform
              </span>
              <h1 className="font-headline text-md-on-surface font-black tracking-tight leading-[1.02] text-5xl md:text-7xl lg:text-[5.25rem]">
                <span className="text-md-primary">Darmon</span> —{" "}
                {t("hero.title2") || "Тибби оянда"}
              </h1>
            </div>

            <p
              className="fx-rise text-lg md:text-xl text-md-on-surface-variant max-w-xl leading-relaxed"
              style={delay("0.3s")}
            >
              {t("hero.desc") ||
                "Экосистемае, ки табибон ва беморонро муттаҳид мекунад. Ҷустуҷӯи дақиқ, шаффофият ва эътимод."}
            </p>

            {/* Quick value cards */}
            <div className="fx-rise grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2" style={delay("0.5s")}>
              {heroFeatures.map((f, i) => (
                <div
                  key={i}
                  className="rounded-[1.5rem] bg-md-surface-container-lowest p-5 clinical-shadow flex flex-col justify-between gap-4 transition-transform duration-500 hover:-translate-y-1"
                >
                  <div className="h-11 w-11 rounded-2xl bg-md-primary/10 text-md-primary flex items-center justify-center">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-md-on-surface text-base mb-1">
                      {f.title}
                    </h3>
                    <p className="text-xs text-md-on-surface-variant leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="fx-rise pt-2" style={delay("0.7s")}>
              <Link
                href="/doctors"
                className="group inline-flex items-center gap-3 rounded-full bg-md-primary text-white pl-8 pr-3 py-3.5 font-headline font-bold shadow-lg shadow-md-primary/25 transition-all hover:shadow-xl hover:shadow-md-primary/30 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-md-primary"
              >
                <span>{t("hero.more") || "Оғози кор"}</span>
                <span className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </div>

          {/* Right Floating Elements / Arc Frame */}
          <div className="lg:col-span-5 relative mx-auto w-full max-w-md">
            <div className="absolute -left-5 top-8 h-full w-full rounded-t-[999px] rounded-b-[2rem] bg-md-primary/15" />
            <div className="fx-arch relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[2rem] shadow-2xl">
              <Image
                src="/boboidukhtur.png"
                alt="Darmon Healthcare"
                fill
                priority
                sizes="(min-width: 1024px) 28rem, 90vw"
                className="object-cover"
              />
            </div>

            {/* Overlay Doctor Card */}
            <div
              className="fx-rise absolute top-8 -left-13 hidden sm:flex items-center gap-3 rounded-2xl bg-md-surface-container-lowest p-4 clinical-shadow backdrop-blur-md"
              style={delay("1.1s")}
            >
              <div className="h-11 w-11 rounded-full bg-md-primary text-white flex items-center justify-center shrink-0">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <p className="font-headline font-bold text-sm text-md-on-surface">
                  Доктор Аҳмадов
                </p>
                <p className="text-xs text-md-primary font-medium">Кардиолог • ★ 4.9</p>
              </div>
            </div>

            {/* Pulse Indicator */}
            <div
              className="fx-rise absolute -bottom-5 -right-3 md:-right-6 h-16 w-16 rounded-full bg-md-surface-container-lowest clinical-shadow flex items-center justify-center"
              style={delay("1.3s")}
            >
              <span className="fx-beat h-4 w-4 rounded-full bg-md-primary" />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="bg-md-primary py-12 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center md:text-left space-y-1">
                <div className="text-4xl md:text-5xl font-black tracking-tight font-headline tabular-nums">
                  {stat.num}
                </div>
                <div className="text-white/80 font-semibold text-xs md:text-sm uppercase tracking-wider font-headline">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECHNOLOGY SECTION ── */}
      <section className="py-24 bg-md-surface-container-low">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-16 space-y-4">
            <span className="text-md-primary font-headline font-bold uppercase tracking-wider text-sm">
              {t("tech.badge") || "Таҷҳизот"}
            </span>
            <h2 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-md-on-surface">
              {t("tech.title") || "Технологияҳои"} {" "}
              <span className="text-md-primary">
                {t("tech.titleHighlight") || "муосири тиббӣ"}
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {techItems.map((item, i) => (
              <div
                key={i}
                className="group rounded-[2rem] bg-md-surface-container-lowest overflow-hidden clinical-shadow flex flex-col transition-transform duration-500 hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 h-12 w-12 rounded-2xl bg-md-primary text-white flex items-center justify-center shadow-lg">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="absolute bottom-4 right-4 bg-md-surface-container-lowest/90 backdrop-blur-md text-md-primary text-xs font-bold px-3 py-1.5 rounded-full font-headline shadow-sm">
                    {item.tag}
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-headline font-bold text-md-on-surface mb-2">
                      {item.title}
                    </h3>
                    <p className="text-md-on-surface-variant text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-md-primary font-headline">
                      <CheckCircle2 className="w-4 h-4" /> Ташхиси дақиқ
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT SECTION ── */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-md-primary font-headline font-bold text-sm uppercase tracking-wider">
                Дар бораи марказ
              </span>
              <h2 className="font-headline text-3xl md:text-5xl font-extrabold text-md-on-surface leading-tight tracking-tight">
                {t("about.title1") || "Сатҳи нави"}{" "}
                <span className="text-md-primary underline decoration-md-primary/30 decoration-4 underline-offset-8">
                  {t("about.titleHighlight") || "хизматрасонии тиббӣ"}
                </span>
              </h2>
              <p className="text-md-on-surface-variant leading-relaxed text-lg pt-2">
                {t("about.desc") ||
                  "Маркази мо барои расонидани ёрӣ дар сатҳи баландтарин тарҳрезӣ шудааст. Мо технологияҳои пешрафтаро бо ғамхории самимона якҷоя мекунем."}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 pt-2">
              {aboutBadges.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-md-surface-container-low transition-colors duration-300 hover:bg-md-primary/10 group"
                >
                  <div className="h-12 w-12 rounded-2xl bg-md-primary/10 text-md-primary flex items-center justify-center shrink-0 transition-colors group-hover:bg-md-primary group-hover:text-white">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-headline font-bold text-sm text-md-on-surface">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative overflow-hidden rounded-[2.5rem] clinical-shadow aspect-[4/3] w-full">
              <Image
                src="/hero2.png"
                alt="Medical center"
                fill
                sizes="(min-width: 1024px) 30rem, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="relative bg-md-banner py-20 overflow-hidden">
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-36 w-full text-white/15 pointer-events-none"
        >
          <path
            d={ECG_WIDE}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="relative max-w-6xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-4xl md:text-6xl font-headline font-black tracking-tight text-white leading-[1.05]">
              {t("cta.title1") || "Саломатии худро ба"}{" "}
              <span className="text-md-on-banner-muted">
                {t("cta.title2") || "мутахассисон бовар кунед"}
              </span>
            </h2>
            <p className="text-md-on-banner-muted text-lg leading-relaxed">
              {t("cta.desc") ||
                "Ҳозир ба қабули духтур нависед ва қадами аввалро ба сӯи саломатии мустаҳкам гузоред."}
            </p>
          </div>

          <Link
            href="/doctors"
            className="group shrink-0 inline-flex items-center gap-3 self-start md:self-auto rounded-full bg-white text-md-banner dark:text-md-primary px-10 py-5 font-headline font-black text-lg shadow-xl shadow-black/15 transition-all hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            {t("cta.register") || "Ба қабул навиштан"}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;