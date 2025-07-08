import React from "react";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Phone,
  Mail,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-teal-600 max-w-[1440px] m-auto text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
                <div className="w-5 h-5 text-teal-600">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
              </div>
              <span className="text-2xl font-bold">DARMON</span>
            </div>

            <p className="text-white/90 mb-6 leading-relaxed">
              Мо ҳамеша кӯшиш мекунем, ки ба шумо хидматрасонии босифат ва
              эътимодбахш пешниҳод намоем.
            </p>

            <div className="space-y-3">
              <div>
                <p className="text-white/90 mb-1">
                  Ба кӯмаки бештар ниёз доред?
                </p>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-xl font-semibold">+123 456 789</span>
                </div>
              </div>

              <div>
                <p className="text-white/90 mb-1">Почтаи дастгирӣ</p>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-lg">hello@darmon.tj</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6">Хизматҳо</h3>
            <ul className="space-y-3">
              <li>Муоинаи умумии саломатӣ</li>
              <li>Ёрии таъҷилӣ ва саривақтӣ</li>
              <li>Кардиология ва саломатии дил</li>
              <li>Кӯдакона ва тибби оилавӣ</li>
              <li>Орторопедия ва физиотерапия</li>
              <li>Ташхисҳои радиологӣ ва лабораторӣ</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6">Пайвандҳои зуд</h3>
            <ul className="space-y-3">
              <li>Саҳифаи асосӣ</li>
              <li>Дар бораи мо</li>
              <li>Таъинот</li>
              <li>Хидматҳо</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6">Шабакаҳои иҷтимоӣ</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="flex items-center text-white/90 hover:text-white transition-colors"
                >
                  <Facebook className="w-4 h-4 mr-3" />
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-white/90 hover:text-white transition-colors"
                >
                  <Twitter className="w-4 h-4 mr-3" />
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-white/90 hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4 mr-3" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-white/90 hover:text-white transition-colors"
                >
                  <Instagram className="w-4 h-4 mr-3" />
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-white/90 hover:text-white transition-colors"
                >
                  <Youtube className="w-4 h-4 mr-3" />
                  Youtube
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/90 text-sm mb-4 md:mb-0">
              Шаблон бемористон ва клиникаи тиббӣ аз{" "}
              <span className="font-semibold">FoxCreation Studio</span>
            </p>
            <p className="text-white/90 text-sm">
              Ҳуқуқи муаллиф © 2025. Ҳамаи ҳуқуқҳо ҳифз шудаанд
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
