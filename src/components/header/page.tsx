"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Stethoscope, Heart, User } from "lucide-react";
import BtnProfile from "../btnProfile/page";
import useStore from "@/store/store";

const Header = () => {
  const userById = useStore((s) => s.userById);
  const role = userById?.role;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Асосӣ", href: "/" },
    ...(role === "doctor"
      ? [{ name: "Панел", href: "/dashboard" }]
      : [
          { name: "Духтурон", href: "/doctors" },
          ...(role === "client"
            ? [{ name: "Навбатҳо", href: "/appointments" }]
            : []),
        ]),
    { name: "Дар бораи мо", href: "/about" },
  ];

  return (
    <>
      <header className="fixed top-0 w-full z-50 glass-nav shadow-[0_12px_40px_rgba(0,78,159,0.06)]">
        <nav className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-black text-md-primary uppercase tracking-tighter font-headline">
            <Stethoscope className="w-6 h-6 fill-md-primary text-md-primary" />
            DARMON
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 font-headline font-medium text-sm tracking-wide">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${
                  pathname === link.href
                    ? "text-md-primary font-bold border-b-2 border-md-primary pb-1"
                    : "text-md-on-surface-variant hover:text-md-primary"
                } transition-colors`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
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
        className={`fixed top-0 right-0 bottom-0 w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="signature-gradient text-white p-5 flex justify-between items-center">
            <span className="font-bold text-lg tracking-wide font-headline">
              МЕНЮ
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
          </ul>

          <div className="mt-auto p-5 border-t border-md-outline-variant/20 bg-md-surface-container-low">
            <div className="text-xs text-md-on-surface-variant space-y-2">
              <p>Душ — Ҷум: 8:00 — 19:00</p>
              <p>+992 44 600 60 60</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
