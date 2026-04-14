"use client";
import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import Image from "next/image";
import logo from './../../../public/logo1.png';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-md-primary text-white w-full rounded-t-[3rem] mt-20 dark:bg-[#0A1628]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 py-16 max-w-7xl mx-auto text-sm leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-6 text-white font-headline">{t("footer.links")}</h4>
          <ul className="space-y-3">
            <li><Link href="/" className="text-white/80 hover:text-white transition-colors hover:translate-x-1 inline-block">{t("nav.home")}</Link></li>
            <li><Link href="/doctors" className="text-white/80 hover:text-white transition-colors hover:translate-x-1 inline-block">{t("nav.doctors")}</Link></li>
            <li><Link href="/about" className="text-white/80 hover:text-white transition-colors hover:translate-x-1 inline-block">{t("hero.services")}</Link></li>
            <li><Link href="/appointments" className="text-white/80 hover:text-white transition-colors hover:translate-x-1 inline-block">{t("nav.appointments")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6 text-white font-headline">{t("footer.contact")}</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/80">
              <MapPin className="w-5 h-5 text-md-primary" />
              ш. Душанбе, кӯч. Бухоро, 45
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <Phone className="w-5 h-5 text-md-primary" />
              +992 44 600 60 60
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <Mail className="w-5 h-5 text-md-primary" />
              info@darmon.tj
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 max-w-7xl mx-auto px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-white/60 uppercase tracking-widest">
        <span>{t("footer.rights")}</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Facebook</a>
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">Telegram</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
