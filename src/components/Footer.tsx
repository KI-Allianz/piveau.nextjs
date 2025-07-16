"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import LanguageSelector from "@/components/LanguageSelector";

export default function Footer() {

  return (
    <header className="">
      <div className="pt-4 mx-4 justify-center flex">
        <nav className="navbar flex flex-row items-center justify-between w-full max-w-[1440px] h-[80px] pt-52 pb-20" >
          <Link className="navbar-brand" href="https://ki-allianz.de/">
            <Logo />
          </Link>
          <div className="flex items-center">
            <LanguageSelector />
          </div>
        </nav>
      </div>
    </header>
  )
}