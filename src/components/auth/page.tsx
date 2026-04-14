"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useStore from "@/store/store";

const publicRoutes = ["/", "/doctors", "/about", "/auth", "/auth/login"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { loginMe, userById } = useStore((state) => state);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    
    if (publicRoutes.includes(pathname) || pathname.startsWith("/doctors/")) {
      setReady(true);
      if (token && !userById?.id) loginMe();
      return;
    }

    
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    
    loginMe().then((user: { role?: string } | null) => {
      if (!user) {
        router.replace("/auth/login");
        return;
      }

      const doctorOnlyRoutes = ["/dashboard"];
      const clientOnlyRoutes = ["/wishlist", "/appointments"];

      if (user.role === "doctor" && clientOnlyRoutes.some((r) => pathname.startsWith(r))) {
        router.replace("/dashboard");
        return;
      }
      if (user.role === "client" && doctorOnlyRoutes.some((r) => pathname.startsWith(r))) {
        router.replace("/");
        return;
      }
      setReady(true);
    });
  }, [pathname]);

  if (!ready && !publicRoutes.includes(pathname) && !pathname.startsWith("/doctors/")) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}

