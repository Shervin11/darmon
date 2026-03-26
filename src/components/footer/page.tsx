import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-md-primary text-white w-full rounded-t-[3rem] mt-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 py-16 max-w-7xl mx-auto text-sm leading-relaxed">
        {/* Brand */}
        <div className="space-y-4">
          <span className="text-2xl font-black text-white mb-4 block font-headline">DARMON</span>
          <p className="text-blue-100/80">
            Саломатии шумо - афзалияти мо. Мо бо технологияҳои муосир ва мутахассисони ботаҷриба дар хидмати шумоем.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-bold text-lg mb-6 text-white font-headline">Пайвандҳо</h4>
          <ul className="space-y-3">
            <li><Link href="/" className="text-blue-100/80 hover:text-white transition-colors hover:translate-x-1 inline-block">Асосӣ</Link></li>
            <li><Link href="/doctors" className="text-blue-100/80 hover:text-white transition-colors hover:translate-x-1 inline-block">Духтурон</Link></li>
            <li><Link href="/about" className="text-blue-100/80 hover:text-white transition-colors hover:translate-x-1 inline-block">Хизматрасонӣ</Link></li>
            <li><Link href="/appointments" className="text-blue-100/80 hover:text-white transition-colors hover:translate-x-1 inline-block">Навбатҳо</Link></li>
          </ul>
        </div>

        {/* Info */}
        <div>
          <h4 className="font-bold text-lg mb-6 text-white font-headline">Маълумот</h4>
          <ul className="space-y-3">
            <li><Link href="/about" className="text-blue-100/80 hover:text-white transition-colors hover:translate-x-1 inline-block">Тамос</Link></li>
            <li><Link href="#" className="text-blue-100/80 hover:text-white transition-colors hover:translate-x-1 inline-block">Сиёсати махфият</Link></li>
            <li><Link href="#" className="text-blue-100/80 hover:text-white transition-colors hover:translate-x-1 inline-block">Саволу ҷавоб</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-lg mb-6 text-white font-headline">Тамос</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-blue-100/80">
              <MapPin className="w-5 h-5 text-md-secondary-container" />
              ш. Душанбе, кӯч. Бухоро, 45
            </div>
            <div className="flex items-center gap-3 text-blue-100/80">
              <Phone className="w-5 h-5 text-md-secondary-container" />
              +992 44 600 60 60
            </div>
            <div className="flex items-center gap-3 text-blue-100/80">
              <Mail className="w-5 h-5 text-md-secondary-container" />
              info@darmon.tj
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 max-w-7xl mx-auto px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-blue-100/60 uppercase tracking-widest">
        <span>© 2025 DARMON — Ҳамаи ҳуқуқҳо маҳфузанд</span>
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
