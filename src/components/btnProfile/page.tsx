"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";

const BtnProfile = () => {
  return (
    <div>
      <div
        style={{
          display: localStorage.getItem("accessToken") ? "none" : "block",
        }}
      >
        <Link href={"/auth"}>
          <Button className="hover:bg-teal-800 bg-[#2c94a1] text-white cursor-pointer">
            Ҳуҷраи шахси
          </Button>
        </Link>
      </div>
      <div
        style={{
          display: localStorage.getItem("accessToken") ? "block" : "none",
        }}
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button className="hover:bg-teal-800 bg-[#2c94a1] text-white cursor-pointer">
              Ҳуҷраи шахси
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <p>Profile</p>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <p>Wishlist</p>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <p>Log out</p>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default BtnProfile;
