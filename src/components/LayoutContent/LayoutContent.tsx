"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header/page";
import Footer from "@/components/footer/page";
import { Toaster } from "react-hot-toast";
import AuthGuard from "@/components/auth/page";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const hideLayout = pathname === "/auth/login" || pathname === "/auth";

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
        </>
    );
}