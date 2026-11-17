"use client";
import React from "react";
import { Star, Zap, Shield, Users, BarChart3, ArrowRight, Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { ECG_WIDE, delay } from "@/lib/ui";

/* Типизированный хелпер: TS не знает про CSS-переменные в style */

const About = () => {
  const { t } = useTranslation();

  const features = [
    { icon: Zap, title: t("aboutPage.f1Title"), desc: t("aboutPage.f1Desc") },
    { icon: Shield, title: t("aboutPage.f2Title"), desc: t("aboutPage.f2Desc") },
    { icon: Users, title: t("aboutPage.f3Title"), desc: t("aboutPage.f3Desc") },
    { icon: BarChart3, title: t("aboutPage.f4Title"), desc: t("aboutPage.f4Desc") },
  ];

  const reviews = [
    { name: "Сара Ҷонсон", role: "СЕО, TechCorp", text: "Darmon комилан равиши кори моро тағйир дод. Мо кори дастиро 80% коҳиш додем ва ҳосилнокии даста бештар аз ҳарвақта шуд." },
    { name: "Майкл Чен", role: "Директори амалиёт", text: "Функсияҳои автоматикунонӣ аҷоибанд. Он чизе, ки пештар соатҳо вақт мегирифт, ҳоло худкор иҷро мешавад." },
    { name: "Эмили Родригес", role: "Мудири лоиҳа", text: "Дастгирии муштариёни Darmon беҳамто аст. Платформа фаҳмо ва осон аст ва натиҷаҳо худ гувоҳӣ медиҳанд." },
  ];

  const Stars = () => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, j) => (
        <Star key={j} className="h-4 w-4 fill-md-secondary-container text-md-secondary-container" />
      ))}
    </div>
  );

  const Avatar = ({ name }: { name: string }) => (
    <div className="h-11 w-11 shrink-0 rounded-full bg-md-primary/10 flex items-center justify-center">
      <span className="text-md-primary font-bold">{name.charAt(0)}</span>
    </div>
  );

  return (
    <div className="pt-20 overflow-hidden">

      {/* Hero: заголовок слева, арка с фото справа, линия пульса пересекает всю секцию */}
      <section className="relative pt-12 pb-28 md:pt-20 md:pb-36">
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-10 h-24 w-full text-md-primary/30"
        >
          <path d={ECG_WIDE} pathLength="1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" className="fx-draw" />
        </svg>

        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-8">
            <h1 className="font-headline text-md-on-surface font-extrabold tracking-tight leading-[1.02] text-5xl md:text-7xl lg:text-[5.5rem]">
              <span className="fx-rise block text-md-primary" style={delay("0.1s")}>
                {t("aboutPage.title1")}
              </span>
              <span className="fx-rise block" style={delay("0.3s")}>
                {t("aboutPage.title2")}
              </span>
            </h1>

            <p className="fx-rise text-lg md:text-xl text-md-on-surface-variant max-w-xl leading-relaxed" style={delay("0.55s")}>
              {t("aboutPage.desc")}
            </p>

            <div className="fx-rise" style={delay("0.75s")}>
              <Link
                href="/doctors"
                className="group inline-flex items-center gap-3 rounded-full bg-md-primary text-white pl-8 pr-3 py-3 font-headline font-bold shadow-lg shadow-md-primary/25 transition-all hover:shadow-xl hover:shadow-md-primary/30 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-md-primary"
              >
                {t("aboutPage.register")}
                <span className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative mx-auto w-full max-w-md">
            <div className="absolute -left-5 top-8 h-full w-full rounded-t-[999px] rounded-b-[2rem] bg-md-primary/15" />
            <div className="fx-arch relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[2rem] shadow-2xl">
              <Image
                src="/sitting-and-smiling-doctor-with-little-baby-is-wo-2025-03-18-21-04-12-YZR9FJZ-1024x683.jpg"
                alt="Darmon Medical"
                fill
                priority
                sizes="(min-width: 1024px) 28rem, 90vw"
                className="object-cover"
              />
            </div>
            <div className="fx-rise absolute -bottom-5 -right-3 md:-right-8 h-16 w-16 rounded-full bg-white dark:bg-md-surface-container-high shadow-xl flex items-center justify-center" style={delay("1.4s")}>
              <span className="fx-beat h-4 w-4 rounded-full bg-md-primary" />
            </div>
          </div>
        </div>
      </section>

      {/* Features: bento вместо четырёх одинаковых карточек */}
      <section className="py-24 bg-md-surface-container-low">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-14 space-y-4">
            <span className="text-md-primary font-headline font-bold">{t("aboutPage.featuresLabel")}</span>
            <h2 className="text-3xl md:text-5xl font-bold font-headline tracking-tight text-md-on-surface">
              {t("aboutPage.featuresTitle")}
            </h2>
            <p className="text-lg text-md-on-surface-variant leading-relaxed">{t("aboutPage.featuresDesc")}</p>
          </div>

          <div className="grid md:grid-cols-6 gap-5">
            {/* 1: крупная, цветная */}
            <div className="group md:col-span-4 relative overflow-hidden rounded-[2rem] bg-md-primary text-white p-10 min-h-[18rem] flex flex-col justify-between transition-transform duration-500 hover:-translate-y-1">
              <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-white/10 transition-transform duration-700 group-hover:scale-125" />
              <div className="relative h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">
                {React.createElement(features[0].icon, { className: "h-7 w-7" })}
              </div>
              <div className="relative max-w-md">
                <h3 className="font-headline font-bold text-2xl md:text-3xl mb-3">{features[0].title}</h3>
                <p className="text-white/85 leading-relaxed">{features[0].desc}</p>
              </div>
            </div>

            {/* 2 и 3: светлые, поменьше */}
            {[features[1], features[2]].map((f, i) => (
              <div
                key={i}
                className="group md:col-span-2 rounded-[2rem] bg-md-surface-container-lowest p-8 clinical-shadow transition-transform duration-500 hover:-translate-y-1"
              >
                <div className="h-12 w-12 rounded-full bg-md-primary/10 text-md-primary flex items-center justify-center mb-8 transition-colors group-hover:bg-md-primary group-hover:text-white">
                  {React.createElement(f.icon, { className: "h-5 w-5" })}
                </div>
                <h3 className="font-headline font-bold text-lg mb-2 text-md-on-surface">{f.title}</h3>
                <p className="text-sm text-md-on-surface-variant leading-relaxed">{f.desc}</p>
              </div>
            ))}

            {/* 4: широкая, горизонтальная */}
            <div className="group md:col-span-4 rounded-[2rem] bg-md-surface-container-lowest p-8 md:p-10 clinical-shadow flex flex-col sm:flex-row sm:items-center gap-6 transition-transform duration-500 hover:-translate-y-1">
              <div className="h-16 w-16 shrink-0 rounded-3xl bg-md-primary/10 text-md-primary flex items-center justify-center transition-transform duration-500 group-hover:rotate-6">
                {React.createElement(features[3].icon, { className: "h-7 w-7" })}
              </div>
              <div>
                <h3 className="font-headline font-bold text-xl mb-2 text-md-on-surface">{features[3].title}</h3>
                <p className="text-md-on-surface-variant leading-relaxed">{features[3].desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Отзывы: один главный и два коротких */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-14 space-y-4">
            <span className="text-md-primary font-headline font-bold">{t("aboutPage.reviewsLabel")}</span>
            <h2 className="text-3xl md:text-5xl font-bold font-headline tracking-tight text-md-on-surface">
              {t("aboutPage.reviewsTitle")}
            </h2>
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            <figure className="lg:col-span-3 relative rounded-[2rem] bg-md-surface-container-low p-10 md:p-14 flex flex-col justify-between gap-10">
              <Quote className="h-14 w-14 text-md-primary/25" />
              <blockquote className="font-headline text-2xl md:text-3xl leading-snug text-md-on-surface">
                {reviews[0].text}
              </blockquote>
              <figcaption className="flex items-center gap-4">
                <Avatar name={reviews[0].name} />
                <div>
                  <p className="font-semibold text-md-on-surface">{reviews[0].name}</p>
                  <p className="text-sm text-md-on-surface-variant">{reviews[0].role}</p>
                </div>
                <div className="ml-auto hidden sm:block"><Stars /></div>
              </figcaption>
            </figure>

            <div className="lg:col-span-2 grid gap-6">
              {reviews.slice(1).map((r, i) => (
                <figure
                  key={i}
                  className="rounded-[2rem] bg-md-surface-container-lowest clinical-shadow p-8 flex flex-col gap-5 transition-transform duration-500 hover:-translate-y-1"
                >
                  <Stars />
                  <blockquote className="text-md-on-surface-variant leading-relaxed">{r.text}</blockquote>
                  <figcaption className="flex items-center gap-3 mt-auto">
                    <Avatar name={r.name} />
                    <div>
                      <p className="font-semibold text-md-on-surface">{r.name}</p>
                      <p className="text-sm text-md-on-surface-variant">{r.role}</p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-md-banner py-24 overflow-hidden">
        <svg aria-hidden="true" viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-40 w-full text-white/15">
          <path d={ECG_WIDE} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>

        <div className="relative max-w-6xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
          <div className="max-w-2xl space-y-5">
            <h2 className="text-4xl md:text-6xl font-headline font-extrabold tracking-tight text-white leading-[1.05]">
              {t("aboutPage.ready")}
            </h2>
            <p className="text-md-on-banner-muted text-lg leading-relaxed">{t("aboutPage.readyDesc")}</p>
          </div>

          <Link
            href="/doctors"
            className="group shrink-0 inline-flex items-center gap-3 self-start md:self-auto rounded-full bg-white text-md-banner dark:text-md-primary px-10 py-5 font-headline font-black text-lg shadow-xl shadow-black/15 transition-all hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            {t("aboutPage.start")}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;