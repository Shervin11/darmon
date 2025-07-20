"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const publicRoutes = ["/", "/doctors", "/about"];

    if (!token && !publicRoutes.includes(pathname)) {
      router.replace("/auth");
    }

  }, []);

  return <>{children}</>;
}
