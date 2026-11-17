"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-md-banner text-white w-full rounded-t-[2.5rem] mt-20 dark:border-t dark:border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 py-16 max-w-7xl mx-auto text-sm leading-relaxed">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-white mb-2 font-headline">
              DARMON
            </span>
          </div>
          <p className="text-white/80 leading-relaxed max-w-sm">
            {t("footer.desc") ||
              "Экосистемаи муосири тиббӣ барои пайваст кардани беморон ва беҳтарин мутахассисон."}
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-headline font-bold text-lg mb-6 text-white">
            {t("footer.links") || "Истинодҳои муҳим"}
          </h4>
          <ul className="space-y-3 font-medium">
            <li>
              <Link
                href="/"
                className="text-white/80 hover:text-white transition-colors hover:translate-x-1 inline-block"
              >
                {t("nav.home")}
              </Link>
            </li>
            <li>
              <Link
                href="/doctors"
                className="text-white/80 hover:text-white transition-colors hover:translate-x-1 inline-block"
              >
                {t("nav.doctors")}
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-white/80 hover:text-white transition-colors hover:translate-x-1 inline-block"
              >
                {t("hero.services") || "Дар бораи мо"}
              </Link>
            </li>
            <li>
              <Link
                href="/appointments"
                className="text-white/80 hover:text-white transition-colors hover:translate-x-1 inline-block"
              >
                {t("nav.appointments")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Info */}
        <div>
          <h4 className="font-headline font-bold text-lg mb-6 text-white">
            {t("footer.info") || "Маълумот"}
          </h4>
          <ul className="space-y-3 font-medium">
            <li>
              <Link
                href="/about"
                className="text-white/80 hover:text-white transition-colors hover:translate-x-1 inline-block"
              >
                {t("footer.contact") || "Тамос"}
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="text-white/80 hover:text-white transition-colors hover:translate-x-1 inline-block"
              >
                {t("footer.privacy") || "Сиёсати махфият"}
              </Link>
            </li>
            <li>
              <Link
                href="/clinics"
                className="text-white/80 hover:text-white transition-colors hover:translate-x-1 inline-block"
              >
                {t("nav.clinics")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-headline font-bold text-lg mb-6 text-white">
            {t("footer.contact") || "Тамос"}
          </h4>
          <div className="space-y-4 font-medium">
            <div className="flex items-center gap-3 text-white/90">
              <MapPin className="w-5 h-5 text-md-on-banner-muted shrink-0" />
              <span>ш. Душанбе, кӯч. Бухоро, 45</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <Phone className="w-5 h-5 text-md-on-banner-muted shrink-0" />
              <span>+992 44 600 60 60</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <Mail className="w-5 h-5 text-md-on-banner-muted shrink-0" />
              <span>info@darmon.tj</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/15 max-w-7xl mx-auto px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-white/70 uppercase tracking-widest font-headline">
        <span>{t("footer.rights") || "© 2026 DARMON. Ҳамаи ҳуқуқҳо ҳифз шудаанд."}</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">
            Facebook
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Instagram
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Telegram
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;