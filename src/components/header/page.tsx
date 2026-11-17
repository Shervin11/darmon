"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { api } from "@/lib/api";
import { Menu, X, Sun, Moon, Bot, Globe } from "lucide-react";
import BtnProfile from "../btnProfile/page";
import useStore from "@/store/store";
import { useTranslation, useLanguageStore, langNames, type Lang } from "@/lib/i18n";
import { useThemeStore } from "@/lib/theme";

const Header = () => {
  const userById = useStore((s) => s.userById);
  const role = userById?.role;
  const isAuth = !!userById?.id;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();
  const { lang, setLang } = useLanguageStore();
  const { theme, toggleTheme } = useThemeStore();

  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!userById?.id) return;

    const fetchUnread = async () => {
      try {
        const { data } = await api.get<{ unreadCount?: number }[]>("/chat-partners");
        const total = data.reduce((acc, p) => acc + (p.unreadCount || 0), 0);
        setTotalUnread(total);
      } catch (e) {
        console.error(e);
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, [userById?.id]);

  const navLinks = (() => {
    if (!isAuth) {
      return [
        { name: t("nav.home"), href: "/" },
        { name: t("nav.clinics"), href: "/clinics" },
        { name: t("nav.about"), href: "/about" },
      ];
    }
    switch (role) {
      case "admin":
        return [
          { name: t("nav.panel"), href: "/admin/panel" },
          { name: t("nav.assistant"), href: "/ai-companion" },
        ];
      case "clinic":
        return [
          { name: t("nav.panel"), href: "/clinic/dashboard" },
          { name: t("nav.desk"), href: "/clinic/desk" },
          { name: t("nav.assistant"), href: "/ai-companion" },
        ];
      case "registrar":
        return [
          { name: t("nav.desk"), href: "/clinic/desk" },
          { name: t("nav.doctors"), href: "/doctors" },
        ];
      case "doctor":
        return [
          { name: t("nav.panel"), href: "/dashboard" },
          { name: t("nav.medicalCard"), href: "/protocol" },
          { name: t("nav.chat"), href: "/chat" },
          { name: t("nav.assistant"), href: "/ai-companion" },
        ];
      case "client":
        return [
          { name: t("nav.doctors"), href: "/doctors" },
          { name: t("nav.appointments"), href: "/appointments" },
          { name: t("nav.records"), href: "/records" },
          { name: t("nav.chat"), href: "/chat" },
          { name: t("nav.assistant"), href: "/ai-companion" },
        ];
      default:
        return [
          { name: t("nav.doctors"), href: "/doctors" },
          { name: t("nav.clinics"), href: "/clinics" },
        ];
    }
  })();

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-md-surface-container-lowest/80 backdrop-blur-md border-b border-md-outline/10 shadow-sm transition-colors duration-300">
        <nav className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center text-2xl font-black text-md-primary tracking-tight font-headline"
          >
            DARMON
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 font-headline font-semibold text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-2 relative ${
                  pathname === link.href
                    ? "bg-md-primary text-white font-bold shadow-md shadow-md-primary/25"
                    : "text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container-high"
                }`}
              >
                {link.name}
                {link.href === "/chat" && totalUnread > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-md-surface-container-lowest animate-pulse">
                    {totalUnread > 9 ? "9+" : totalUnread}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* AI Companion Quick Link */}
            <button
              onClick={() => {
                const btn = document.getElementById("ai-chat-toggle");
                if (btn) btn.click();
              }}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-md-primary/10 text-md-primary hover:bg-md-primary/20 transition-all cursor-pointer text-xs font-bold font-headline"
              title={t("nav.ai")}
            >
              <Bot className="w-4 h-4" />
              <span className="hidden lg:inline">{t("nav.assistant")}</span>
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-md-on-surface-variant hover:text-md-primary hover:bg-md-primary/10 transition-colors cursor-pointer"
                title="Language"
              >
                <Globe className="w-4 h-4" />
                <span className="text-xs font-bold uppercase hidden sm:inline">
                  {lang}
                </span>
              </button>

              {showLangDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowLangDropdown(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 bg-md-surface-container-lowest border border-md-outline/10 rounded-2xl shadow-xl z-50 overflow-hidden min-w-[150px] p-1">
                    {(["tj", "ru", "en"] as Lang[]).map((l) => (
                      <button
                        key={l}
                        onClick={() => {
                          setLang(l);
                          setShowLangDropdown(false);
                          // Telegram and SMS notifications use the saved language (Tajik or Russian)
                          if (userById?.id) api.patch(`/users/${userById.id}`, { lang: l === "ru" ? "ru" : "tj" }).catch(() => {});
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                          lang === l
                            ? "text-md-primary bg-md-primary/10"
                            : "text-md-on-surface hover:bg-md-surface-container-high"
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
              className="p-2.5 rounded-full text-md-on-surface-variant hover:text-md-primary hover:bg-md-primary/10 transition-all cursor-pointer"
              title={theme === "light" ? t("theme.dark") : t("theme.light")}
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>

            <BtnProfile />

            {/* Mobile Menu Trigger */}
            <button
              className="md:hidden p-2 text-md-on-surface-variant hover:text-md-primary hover:bg-md-primary/10 rounded-full transition-colors cursor-pointer"
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

      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-80 bg-md-surface-container-lowest z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="bg-md-banner text-white p-6 flex justify-between items-center">
            <span className="font-bold text-lg tracking-tight font-headline">
              {t("nav.menu")}
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <ul className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block px-5 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 font-headline ${
                    pathname === link.href
                      ? "bg-md-primary text-white shadow-md shadow-md-primary/20"
                      : "text-md-on-surface-variant hover:bg-md-surface-container-high hover:text-md-on-surface"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setTimeout(() => {
                    const btn = document.getElementById("ai-chat-toggle");
                    if (btn) btn.click();
                  }, 300);
                }}
                className="w-full text-left px-5 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 font-headline text-md-primary hover:bg-md-primary/10 cursor-pointer flex items-center gap-2"
              >
                <Bot className="w-4 h-4" />
                {t("nav.ai")}
              </button>
            </li>
          </ul>

          <div className="mt-auto p-6 border-t border-md-outline/10 bg-md-surface-container-low">
            <div className="text-xs text-md-on-surface-variant space-y-1 font-medium">
              <p>{t("footer.schedule")}</p>
              <p className="font-bold text-md-on-surface text-sm">
                +992 44 600 60 60
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;