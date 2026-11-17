"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/header/page";
import Footer from "@/components/footer/page";
import { Toaster } from "react-hot-toast";
import AuthGuard from "@/components/auth/page";
import AiChat from "@/components/AiChat/AiChat";
import { useThemeStore } from "@/lib/theme";
import { useLanguageStore, langNames, type Lang } from "@/lib/i18n";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const theme = useThemeStore((s) => s.theme);
    const lang = useLanguageStore((s) => s.lang);

    // Restore saved preferences on the client
    useEffect(() => {
        const savedTheme = localStorage.getItem("darmon_theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        useThemeStore.setState({ theme: savedTheme === "dark" || (!savedTheme && prefersDark) ? "dark" : "light" });
        const savedLang = localStorage.getItem("darmon_lang");
        if (savedLang && savedLang in langNames) useLanguageStore.setState({ lang: savedLang as Lang });
    }, []);

    const hideLayout = pathname === "/auth" || pathname.startsWith("/auth/");

    // Apply theme class on mount and on change
    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    // Apply lang attribute
    useEffect(() => {
        document.documentElement.lang = lang;
    }, [lang]);

    if (hideLayout) {
        return (
            <>
                {children}
                <Toaster position="top-center" reverseOrder={false} />
            </>
        );
    }

    return (
        <>
            {/* Site chrome is left out of printouts (e.g. the medical card) */}
            <div className="print:hidden">
                <Header />
            </div>
            <AuthGuard>{children}</AuthGuard>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="print:hidden">
                <Footer />
                <AiChat />
            </div>
        </>
    );
}