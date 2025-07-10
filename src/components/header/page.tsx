import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const Header = () => {
  return (
    <nav className="flex items-center justify-between py-[10px] w-[90%] md:max-w-[1200px] m-auto">
      <img src={"/logo1.png"} className="w-[50px] hidden md:block md:w-[200px]" alt="logo" />
      <ul className="flex items-center gap-[20px] text-xs md:text-[18px]">
        <Link href={"/"}>
          <li className="relative cursor-pointer group">
            Хона
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-teal-600 transition-all duration-300 group-hover:w-full"></span>
          </li>
        </Link>
        <Link href={"/doctors"}>
          <li className="relative cursor-pointer group">
            Духтурҳо
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-teal-600 transition-all duration-300 group-hover:w-full"></span>
          </li>
        </Link>
        <Link href={"/about"}>
          <li className="relative cursor-pointer group">
            Дар бораи мо
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-teal-600 transition-all duration-300 group-hover:w-full"></span>
          </li>
        </Link>
      </ul>
      <div>
        <Link href={"/auth"}>
          <Button className="hover:bg-teal-800 bg-[#2c94a1] text-white cursor-pointer">
            Ҳуҷраи шахси
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Header;
