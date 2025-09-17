"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { useLocale } from "@/hooks/useLocale";

export enum NavItemId {
  DATASETS = "datasets",
  CATALOGUES = "catalogues",
  FAVOURITES = "favourites",
}

const navItems = [
  {
    id: NavItemId.DATASETS,
    href: "/",
    external: false,
  },
  {
    id: NavItemId.CATALOGUES,
    href: "/catalogues",
    external: false,
  },
  {
    id: NavItemId.FAVOURITES,
    href: "/favourites",
    external: false,
  },
];

export default function Header() {
  const pathname = usePathname();
  const { locale, translations } = useLocale();

  return (
    <header className="">
      <div className="pt-4 mx-4 justify-center flex">
        <nav className="navbar flex flex-row items-center justify-between w-full max-w-[1440px] h-[80px] bg-white dark:bg-black rounded-2xl pr-[2.3rem] pl-[3.75rem]">
          <Link className="navbar-brand dark:invert" href={`/${locale}`}>
            <Logo />
          </Link>
          <div className="flex items-center h-[48px]" id="navbarNav">
            <ul className="flex flex-row mt-0">
              {navItems.map((item, i) => {
                return (
                  <li
                    key={`navItem@${i}`}
                    className={twMerge("text-black dark:text-white h-[48px]")}
                  >
                    <Link
                      href={(item.external ? "" : "/" + locale) + item.href}
                      data-active={item.href === pathname}
                      className={
                        "pt-[4px] block mx-6 font-bold text-[1.1rem] transition-[padding-bottom] duration-300 pb-[3px] border-b-2 border-b-black dark:border-b-white hover:text-[#000AFA] hover:border-b-[#000AFA] dark:hover:text-[#7777FF] dark:hover:border-b-[#7777FF] hover:cursor-pointer hover:border-b-[3px] hover:pb-[5px] data-[active=true]:text-[#000AFA] data-[active=true]:border-b-[#000AFA] data-[active=true]:cursor-pointer data-[active=true]:border-b-[3px] "
                      }
                    >
                      {translations.header.navTitles[item.id]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
