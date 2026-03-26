import { Button } from "@/components/ui/button";
import React from "react";
import { Star, Zap, Shield, Users, BarChart3, ArrowRight, Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const About = () => {
  return (
    <div className="pt-20 overflow-hidden">
      {/* Hero */}
      <section className="py-20 md:py-32 relative">
        <div className="absolute -right-32 -top-32 w-96 h-96 bg-md-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-md-secondary-container/10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl font-headline text-md-on-surface">
              <span className="text-md-secondary">Духтури мо</span> — ҳамроҳ ба саломатии беҳтар
            </h1>

            <p className="text-xl text-md-on-surface-variant max-w-2xl">
              Шифокори боэътимод ва ботаҷриба барои нигоҳдории саломатии шумо. Духтури дилсӯз ва касбӣ барои беҳбудии ҳаёти шумо
            </p>

            <Link href={"/doctors"}>
              <button className="bg-md-primary text-white px-10 py-4 rounded-full font-headline font-bold shadow-lg shadow-md-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group cursor-pointer">
                Қайд шудан
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            <div className="pt-8">
              <Image
                src="/sitting-and-smiling-doctor-with-little-baby-is-wo-2025-03-18-21-04-12-YZR9FJZ-1024x683.jpg"
                alt="Darmon Medical"
                width={800}
                height={400}
                className="rounded-xl shadow-2xl border-8 border-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-md-surface-container-low">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <span className="text-md-secondary font-headline font-bold text-sm uppercase tracking-widest">Имконият</span>
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-md-on-surface">
              Ҳамаи имкониятҳо барои табиби касбӣ
            </h2>
            <p className="text-xl text-md-on-surface-variant max-w-2xl mx-auto">
              Имкониятҳои пуриқтидор барои беҳтар сохтани ҳамкории гурӯҳи тиббӣ
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Zap className="h-6 w-6" />, color: "bg-blue-100 text-blue-600", title: "Автоматикунонии зирак", desc: "Системае, ки одатҳои шуморо меомӯзад ва корҳои якхеларо худкор анҷом медиҳад." },
              { icon: <Shield className="h-6 w-6" />, color: "bg-green-100 text-green-600", title: "Амнияти сатҳи корхона", desc: "Сатҳи олитарини амният барои ташкилотҳо — бо стандартҳои ҷаҳонӣ." },
              { icon: <Users className="h-6 w-6" />, color: "bg-purple-100 text-purple-600", title: "Ҳамкории даставӣ", desc: "Воситаҳои ҳамкории онлайнӣ дар вақти воқеӣ, ки дастаи шуморо ҳамоҳанг нигоҳ медоранд." },
              { icon: <BarChart3 className="h-6 w-6" />, color: "bg-orange-100 text-orange-600", title: "Таҳлили пешрафта", desc: "Иттилооти муфассал ва ҳисоботҳо барои беҳсозии ҷараёни кор ва назорати самаранокӣ." },
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
            <span className="text-md-secondary font-headline font-bold text-sm uppercase tracking-widest">Шарҳҳо</span>
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-md-on-surface">
              Муштариёни мо чӣ мегӯянд
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
      <section className="vitality-gradient py-20">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-white">
            Омода ба оғоз?
          </h2>
          <p className="text-blue-100 text-lg opacity-90 max-w-2xl mx-auto">
            Имрӯз бо Darmon ба саломатии худ ғамхорӣ кардан оғоз намоед.
          </p>
          <Link href="/doctors" className="bg-md-secondary-container text-md-on-secondary-container px-12 py-5 rounded-full font-headline font-black text-lg shadow-xl shadow-black/10 hover:scale-105 active:scale-95 transition-all inline-block">
            Оғоз кунед
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
