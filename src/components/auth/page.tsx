"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useStore from "@/store/store";

const PUBLIC_ROUTES = ["/", "/doctors", "/clinics", "/privacy", "/about", "/auth"];
const isPublic = (path: string) => PUBLIC_ROUTES.some((r) => path === r || path.startsWith(r + "/"));

/**
 * Loads the signed-in user once and keeps guests out of private pages.
 * Role-specific access is enforced by the route middleware.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { loginMe, userById } = useStore((state) => state);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    loginMe().finally(() => setChecked(true));
  }, []);

  const allowed = isPublic(pathname) || !!userById?.id;

  useEffect(() => {
    if (checked && !allowed) router.replace("/auth/login");
  }, [checked, allowed]);

  if (!allowed) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
