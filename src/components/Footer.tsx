"use client";

import Link from "next/link";
import LanguageSelector from "@/components/LanguageSelector";
import { useLocale } from "@/hooks/useLocale";
import { ThemeToggle } from "./ThemeToggle";
import { getTheme } from "@/themes";

export default function Footer() {
  const { locale, translations } = useLocale();
  const theme = getTheme();

  return (
    <footer className="">
      <div className="pt-4 mx-4 justify-center flex">
        <nav className="flex flex-row items-center justify-between w-full max-w-[1440px] h-20 pt-28 pb-20">
          <Link className="dark:invert" href={`/${locale}`}>
            <theme.components.Logo />
          </Link>

          <div className="flex flex-wrap gap-3">
            {theme.footer.buildFooterLinks(translations).map((link) => (
              <Link key={link.href} href={link.href}>
                <span className="hover:text-muted-foreground">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {theme.footer.enableThemeToggle && <ThemeToggle />}
            {theme.footer.enableLanguageSelector && <LanguageSelector />}
          </div>
        </nav>
      </div>
    </footer>
  );
}
