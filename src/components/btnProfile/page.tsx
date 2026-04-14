"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth/page";
import { useRouter } from "next/navigation";
import useStore from "@/store/store";
import { User, Heart, LogOut, Settings } from "lucide-react";
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
    <div>
      {!localIsAuth ? (
        <Link href={"/auth"}>
          <button className="bg-md-primary text-white px-6 py-2.5 rounded-full font-headline font-bold text-sm tracking-wide hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer">
            {t("nav.login")}
          </button>
        </Link>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" className="w-10 h-10 rounded-full bg-md-primary hover:bg-md-primary-container text-white cursor-pointer shadow-md transition-transform hover:scale-105">
              <User className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2 rounded-xl shadow-[0_20px_60px_rgba(0,78,159,0.12)] border-md-outline-variant/20 bg-white dark:bg-[#1F1F28]">
            <Link href={"/profile"}>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-md-surface-container-low cursor-pointer transition-colors text-md-on-surface text-sm font-medium">
                <Settings className="w-4 h-4 text-md-primary" />
                <span>{t("profile.cabinet")}</span>
              </div>
            </Link>
            {userById?.role !== "doctor" && (
              <Link href={"/wishlist"}>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-md-surface-container-low cursor-pointer transition-colors text-md-on-surface text-sm font-medium">
                  <Heart className="w-4 h-4 text-md-primary" />
                  <span>{t("profile.favorites")}</span>
                </div>
              </Link>
            )}
            <div
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-md-error-container cursor-pointer transition-colors text-md-error text-sm font-medium mt-1 border-t border-md-outline-variant/10 pt-2"
              onClick={() => {
                localStorage.removeItem("accessToken");
                setLocalIsAuth(!localIsAuth);
                router.push("/");
              }}
            >
              <LogOut className="w-4 h-4" />
              <span>{t("profile.logout")}</span>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default BtnProfile;
