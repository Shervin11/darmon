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

const BtnProfile = () => {
  const isAuth = useAuth();
  const [localIsAuth, setLocalIsAuth] = useState(isAuth);
  let router = useRouter()

  useEffect(() => {
    setLocalIsAuth(isAuth);
  }, [isAuth]);

  return (
    <div>
      {!localIsAuth ? (
        <Link href={"/auth"}>
          <Button className="hover:bg-teal-800 bg-[#2c94a1] text-white cursor-pointer">
            Ҳуҷраи шахси
          </Button>
        </Link>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <Button className="hover:bg-teal-800 bg-[#2c94a1] text-white cursor-pointer">
              Ҳуҷраи шахси
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-0">
            <Link href={"/profile"}>
              <div className="flex hover:bg-gray-300 cursor-pointer rounded-t-[7px] items-center gap-2 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                <p>Ҳуҷраи шахси</p>
              </div>
            </Link>
            <Link href={"/wishlist"}>
              <div className="flex hover:bg-gray-300 cursor-pointer items-center gap-2 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
                <p>Интихобшуда</p>
              </div>
            </Link>
            <div
              className="flex hover:bg-gray-300 cursor-pointer rounded-b-[7px] items-center gap-2 p-3"
              onClick={() => {
                localStorage.removeItem("accessToken");
                setLocalIsAuth(!localIsAuth);
                router.push('/')
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                />
              </svg>
              <p>Баромад</p>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default BtnProfile;
