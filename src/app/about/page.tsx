"use client";
import React from "react";
import { Star, Zap, Shield, Users, BarChart3, ArrowRight, Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-20 overflow-hidden">
      {/* Hero */}
      <section className="py-20 md:py-32 relative">
        <div className="absolute -right-32 -top-32 w-96 h-96 bg-md-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-md-secondary-container/10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl font-headline text-md-on-surface">
              <span className="text-md-primary">{t("aboutPage.title1")}</span> {t("aboutPage.title2")}
            </h1>

            <p className="text-xl text-md-on-surface-variant max-w-2xl">
              {t("aboutPage.desc")}
            </p>

            <Link href={"/doctors"}>
              <button className="bg-md-primary text-white px-10 py-4 rounded-full font-headline font-bold shadow-lg shadow-md-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group cursor-pointer">
                {t("aboutPage.register")}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            <div className="pt-8">
              <Image
                src="/sitting-and-smiling-doctor-with-little-baby-is-wo-2025-03-18-21-04-12-YZR9FJZ-1024x683.jpg"
                alt="Darmon Medical"
                width={800}
                height={400}
                className="rounded-xl shadow-2xl border-8 border-white dark:border-[#1F1F28]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-md-surface-container-low">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <span className="text-md-primary font-headline font-bold text-sm uppercase tracking-widest">{t("aboutPage.featuresLabel")}</span>
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-md-on-surface">
              {t("aboutPage.featuresTitle")}
            </h2>
            <p className="text-xl text-md-on-surface-variant max-w-2xl mx-auto">
              {t("aboutPage.featuresDesc")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Zap className="h-6 w-6" />, color: "bg-teal-100 text-[#00A896] dark:bg-[#0A2342]/50 dark:text-teal-400", title: t("aboutPage.f1Title"), desc: t("aboutPage.f1Desc") },
              { icon: <Shield className="h-6 w-6" />, color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400", title: t("aboutPage.f2Title"), desc: t("aboutPage.f2Desc") },
              { icon: <Users className="h-6 w-6" />, color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400", title: t("aboutPage.f3Title"), desc: t("aboutPage.f3Desc") },
              { icon: <BarChart3 className="h-6 w-6" />, color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400", title: t("aboutPage.f4Title"), desc: t("aboutPage.f4Desc") },
            ].map((item, i) => (
              <div key={i} className="bg-md-surface-container-lowest p-8 rounded-xl clinical-shadow hover:translate-y-[-4px] transition-transform duration-300 group">
                <div className={`h-12 w-12 rounded-xl ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h3 className="font-headline font-bold text-lg mb-3 text-md-on-surface">{item.title}</h3>
                <p className="text-md-on-surface-variant text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <span className="text-md-primary font-headline font-bold text-sm uppercase tracking-widest">{t("aboutPage.reviewsLabel")}</span>
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-md-on-surface">
              {t("aboutPage.reviewsTitle")}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Сара Ҷонсон", role: "СЕО, TechCorp", text: "Darmon комилан равиши кори моро тағйир дод. Мо кори дастиро 80% коҳиш додем ва ҳосилнокии даста бештар аз ҳарвақта шуд." },
              { name: "Майкл Чен", role: "Директори амалиёт", text: "Функсияҳои автоматикунонӣ аҷоибанд. Он чизе, ки пештар соатҳо вақт мегирифт, ҳоло худкор иҷро мешавад." },
              { name: "Эмили Родригес", role: "Мудири лоиҳа", text: "Дастгирии муштариёни Darmon беҳамто аст. Платформа фаҳмо ва осон аст ва натиҷаҳо худ гувоҳӣ медиҳанд." },
            ].map((item, i) => (
              <div key={i} className="bg-md-surface-container-lowest p-8 rounded-xl clinical-shadow hover:translate-y-[-4px] transition-transform duration-300">
                <Quote className="w-8 h-8 text-md-primary/20 mb-4" />
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-md-secondary-container text-md-secondary-container" />
                  ))}
                </div>
                <p className="text-md-on-surface-variant italic mb-6 leading-relaxed">&ldquo;{item.text}&rdquo;</p>
                <div className="flex items-center space-x-3 pt-4 border-t border-md-surface-variant/20">
                  <div className="h-10 w-10 rounded-full bg-md-primary/10 flex items-center justify-center">
                    <span className="text-md-primary font-bold text-sm">{item.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-md-on-surface">{item.name}</p>
                    <p className="text-sm text-md-on-surface-variant">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-[#00A191] py-20 overflow-hidden">
        {/* Glow effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#00C4B0] rounded-full blur-[120px]"></div>
          <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-[#007D70] rounded-full blur-[120px]"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-white">
            {t("aboutPage.ready")}
          </h2>
          <p className="text-[#A7F3EB] text-lg opacity-90 max-w-2xl mx-auto">
            {t("aboutPage.readyDesc")}
          </p>
          <Link href="/doctors" className="bg-[#00BFA5] text-white hover:bg-white hover:text-[#00A191] px-12 py-5 rounded-full font-headline font-black text-lg shadow-xl shadow-black/10 hover:scale-105 active:scale-95 transition-all inline-block">
            {t("aboutPage.start")}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
