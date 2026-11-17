"use client";
import React from "react";
import Link from "next/link";
import useStore from "@/store/store";
import { User, Heart, LogOut } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const BtnProfile = () => {
  const { userById, logout } = useStore((state) => state);
  const { t } = useTranslation();

  if (!userById?.id) {
    return (
      <Link href={"/auth"}>
        <button className="bg-md-primary text-white px-6 py-2.5 rounded-full font-headline font-bold text-sm tracking-wide hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer">
          {t("nav.login")}
        </button>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {/* Profile Icon */}
      <Link
        href="/profile"
        className="p-2.5 rounded-xl text-md-on-surface-variant hover:text-md-primary hover:bg-md-primary/10 transition-all duration-200 cursor-pointer"
        title={t("profile.cabinet")}
      >
        <User className="w-5 h-5" />
      </Link>

      {/* Favorites Icon — only for clients */}
      {userById.role === "client" && (
        <Link
          href="/wishlist"
          className="p-2.5 rounded-xl text-md-on-surface-variant hover:text-pink-500 hover:bg-pink-500/10 transition-all duration-200 cursor-pointer"
          title={t("profile.favorites")}
        >
          <Heart className="w-5 h-5" />
        </Link>
      )}

      {/* Logout Icon — full reload resets all page state */}
      <button
        onClick={() => {
          logout();
          window.location.href = "/";
        }}
        className="p-2.5 rounded-xl text-md-on-surface-variant hover:text-md-error hover:bg-md-error/10 transition-all duration-200 cursor-pointer"
        title={t("profile.logout")}
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  );
};

export default BtnProfile;
