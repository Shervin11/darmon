"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/header/page";
import Footer from "@/components/footer/page";
import { Toaster } from "react-hot-toast";
import AuthGuard from "@/components/auth/page";
import AiChat from "@/components/AiChat/AiChat";
import { useThemeStore } from "@/lib/theme";
import { useLanguageStore } from "@/lib/i18n";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const theme = useThemeStore((s) => s.theme);
    const lang = useLanguageStore((s) => s.lang);

    const hideLayout = pathname === "/auth/login" || pathname === "/auth";

    
    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    
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
            <Header />
            <AuthGuard>{children}</AuthGuard>
            <Toaster position="top-center" reverseOrder={false} />
            <Footer />
            <AiChat />
        </>
    );
}