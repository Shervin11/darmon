"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link"; 
import { usePathname } from "next/navigation";
import logo from './../../../public/logo1.png'
import { Menu, X, Sun, Moon, Bot, Globe } from "lucide-react";
import BtnProfile from "../btnProfile/page";
import useStore from "@/store/store";
import { useTranslation, useLanguageStore, langNames, type Lang } from "@/lib/i18n";
import { useThemeStore } from "@/lib/theme";
import Image from "next/image";

const Header = () => {
  const userById = useStore((s) => s.userById);
  const role = userById?.role;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();
  const { lang, setLang } = useLanguageStore();
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: t("nav.home"), href: "/" },
    ...(role === "doctor"
      ? [{ name: t("nav.panel"), href: "/dashboard" }]
      : [
          { name: t("nav.doctors"), href: "/doctors" },
          ...(role === "client"
            ? [{ name: t("nav.appointments"), href: "/appointments" }]
            : []),
        ]),
    { name: t("nav.about"), href: "/about" },
  ];

  return (
    <>
      <header className="fixed top-0 w-full z-50 glass-nav shadow-[0_12px_40px_rgba(0,78,159,0.06)]">
        <nav className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-black text-md-primary uppercase tracking-tighter font-headline">
            <Image src={logo} alt="logo" width={160} height={160} className="dark:invert-50" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 font-headline font-medium text-sm tracking-wide">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                  pathname === link.href
                    ? "bg-md-primary text-white font-semibold shadow-sm shadow-md-primary/30"
                    : "text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* AI Button - Desktop */}
            <button
              onClick={() => {
                const btn = document.getElementById("ai-chat-toggle");
                if (btn) btn.click();
              }}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-md-primary/10 to-md-primary-container/10 text-md-primary hover:from-md-primary/20 hover:to-md-primary-container/20 transition-all cursor-pointer text-xs font-bold font-headline"
              title={t("nav.ai")}
            >
              <Bot className="w-4 h-4" />
              <span className="hidden lg:inline">AI</span>
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-1 px-2 py-2 rounded-lg text-md-on-surface-variant hover:text-md-primary hover:bg-md-primary/5 transition-colors cursor-pointer"
                title="Language"
              >
                <Globe className="w-4 h-4" />
                <span className="text-xs font-bold uppercase hidden sm:inline">{lang}</span>
              </button>
              {showLangDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowLangDropdown(false)} />
                  <div className="absolute right-0 top-full mt-2 bg-white dark:bg-[#1F1F28] border border-md-outline-variant/20 rounded-xl shadow-xl z-50 overflow-hidden min-w-[140px]">
                    {(["tj", "ru", "en"] as Lang[]).map((l) => (
                      <button
                        key={l}
                        onClick={() => { setLang(l); setShowLangDropdown(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer hover:bg-md-primary/5 ${
                          lang === l ? "text-md-primary bg-md-primary/5 font-bold" : "text-md-on-surface"
                        }`}
                      >
                        {langNames[l]}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-md-on-surface-variant hover:text-md-primary hover:bg-md-primary/5 transition-all cursor-pointer"
              title={theme === "light" ? t("theme.dark") : t("theme.light")}
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <BtnProfile />
            <button
              className="md:hidden p-2 text-md-on-surface-variant hover:text-md-primary hover:bg-md-primary/5 rounded-lg transition-colors cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-72 bg-white dark:bg-[#1B1B22] z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="signature-gradient text-white p-5 flex justify-between items-center">
            <span className="font-bold text-lg tracking-wide font-headline">
              {t("nav.menu")}
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <ul className="flex flex-col p-4 gap-1.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block px-4 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-200 font-headline ${
                    pathname === link.href
                      ? "bg-md-primary text-white shadow-sm"
                      : "text-md-on-surface-variant hover:bg-md-primary/5 hover:text-md-primary"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            {/* Mobile AI Button */}
            <li>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setTimeout(() => {
                    const btn = document.getElementById("ai-chat-toggle");
                    if (btn) btn.click();
                  }, 300);
                }}
                className="w-full text-left px-4 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-200 font-headline text-md-primary hover:bg-md-primary/5 cursor-pointer flex items-center gap-2"
              >
                <Bot className="w-4 h-4" />
                {t("nav.ai")}
              </button>
            </li>
          </ul>

          <div className="mt-auto p-5 border-t border-md-outline-variant/20 bg-md-surface-container-low">
            <div className="text-xs text-md-on-surface-variant space-y-2">
              <p>{t("footer.schedule")}</p>
              <p>+992 44 600 60 60</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
