"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth/page";
import { useRouter } from "next/navigation";
import useStore from "@/store/store";
import { User, Heart, LogOut } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const BtnProfile = () => {
  const isAuth = useAuth();
  const [localIsAuth, setLocalIsAuth] = useState(isAuth);
  const router = useRouter();
  const { userById } = useStore((state) => state);
  const { t } = useTranslation();

  useEffect(() => {
    setLocalIsAuth(isAuth);
  }, [isAuth]);

  return (
    <div className="flex items-center gap-1">
      {!localIsAuth ? (
        <Link href={"/auth"}>
          <button className="bg-md-primary text-white px-6 py-2.5 rounded-full font-headline font-bold text-sm tracking-wide hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer">
            {t("nav.login")}
          </button>
        </Link>
      ) : (
        <>
          {/* Profile Icon */}
          <Link
            href="/profile"
            className="p-2.5 rounded-xl text-md-on-surface-variant hover:text-md-primary hover:bg-md-primary/10 transition-all duration-200 cursor-pointer"
            title={t("profile.cabinet")}
          >
            <User className="w-5 h-5" />
          </Link>

          {/* Favorites Icon — only for clients */}
          {userById?.role !== "doctor" && (
            <Link
              href="/wishlist"
              className="p-2.5 rounded-xl text-md-on-surface-variant hover:text-pink-500 hover:bg-pink-500/10 transition-all duration-200 cursor-pointer"
              title={t("profile.favorites")}
            >
              <Heart className="w-5 h-5" />
            </Link>
          )}

          {/* Logout Icon */}
          <button
            onClick={() => {
              localStorage.removeItem("accessToken");
              setLocalIsAuth(false);
              router.push("/");
              window.location.reload();
            }}
            className="p-2.5 rounded-xl text-md-on-surface-variant hover:text-md-error hover:bg-md-error/10 transition-all duration-200 cursor-pointer"
            title={t("profile.logout")}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
};

export default BtnProfile;
