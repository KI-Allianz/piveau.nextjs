"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";

import { NavItemId } from "@/lib/lang/base";
import { useLocale } from "@/hooks/useLocale";
import { fixThemeUrl, useTheme } from "@/hooks/useTheme";

interface HeaderLinkProps {
  item: {
    id: NavItemId | string;
    href: string;
    external: boolean;
    isTheme: boolean;
  };
}

export default function HeaderLink({ item }: HeaderLinkProps) {
  const pathname = usePathname();
  const { locale, translations } = useLocale();
  const theme = useTheme();

  return (
    <li className={twMerge("h-12 navbar-link")}>
      <Link
        href={fixThemeUrl(
          (item.external ? "" : "/" + locale) + item.href,
          theme,
        )}
        data-active={item.href === pathname}
        className={
          "text-black dark:text-white pt-1 block mx-6 font-bold text-[1.1rem] transition-[padding-bottom] duration-300 pb-[3px] border-b-2 border-b-black dark:border-b-white hover:text-[#000AFA] hover:border-b-[#000AFA] dark:hover:text-[#7777FF] dark:hover:border-b-[#7777FF] hover:cursor-pointer hover:border-b-[3px] hover:pb-[5px] data-[active=true]:text-[#000AFA] data-[active=true]:border-b-[#000AFA] data-[active=true]:cursor-pointer data-[active=true]:border-b-[3px] "
        }
      >
        {item.isTheme
          ? theme.lang.translations[locale]?.[item.id]
          : translations.navigation.navTitles[item.id as NavItemId]}
      </Link>
    </li>
  );
}
