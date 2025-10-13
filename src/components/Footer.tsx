"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import LanguageSelector from "@/components/LanguageSelector";
import { useLocale } from "@/hooks/useLocale";
import { ThemeToggle } from "./ThemeToggle";

export default function Footer() {
  const { locale, translations } = useLocale();

  return (
    <footer className="">
      <div className="pt-4 mx-4 justify-center flex">
        <nav className="navbar flex flex-row items-center justify-between w-full max-w-[1440px] h-[80px] pt-28 pb-20">
          <Link className="navbar-brand dark:invert" href={`/${locale}`}>
            <Logo />
          </Link>

          <div className="flex flex-wrap gap-3">
            <Link href={"https://www.hlrs.de/de/impressum"}>
              <span className="hover:text-muted-foreground">{translations.footer.imprint}</span>
            </Link>
            <Link href={"https://www.hlrs.de/de/datenschutzerklaerung"}>
              <span className="hover:text-muted-foreground">{translations.footer.privacy}</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSelector />
          </div>
        </nav>
      </div>
    </footer>
  );
}
