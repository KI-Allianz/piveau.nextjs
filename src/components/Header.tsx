"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { useLocale } from "@/hooks/useLocale";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "lucide-react";
import { AUTH_DISABLED } from "@/lib/auth-config";
import { NavItemId } from "@/lib/lang/base";
import { getTheme } from "@/themes";

const navItems = [
  {
    id: NavItemId.DATASETS,
    href: "/dataset",
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
  const session = useSession();
  const theme = getTheme();

  return (
    <header className="header">
      <div className="pt-4 mx-4 justify-center flex">
        <nav className="h-20 flex flex-row gap-2 items-center w-full">
          <div className="h-20 flex flex-1 items-center justify-between bg-white dark:bg-black rounded-2xl pr-[2.3rem] pl-15 navbar">
            <Link className="navbar-brand dark:invert" href={`/${locale}`}>
              <theme.components.Logo />
            </Link>
            <div className="flex items-center h-12" id="navbarNav">
              <ul className="flex flex-row mt-0">
                {navItems.map((item, i) => {
                  return (
                    <li
                      key={`navItem@${i}`}
                      className={twMerge("h-12 navbar-link")}
                    >
                      <Link
                        href={(item.external ? "" : "/" + locale) + item.href}
                        data-active={item.href === pathname}
                        className={
                          "text-black dark:text-white pt-1 block mx-6 font-bold text-[1.1rem] transition-[padding-bottom] duration-300 pb-[3px] border-b-2 border-b-black dark:border-b-white hover:text-[#000AFA] hover:border-b-[#000AFA] dark:hover:text-[#7777FF] dark:hover:border-b-[#7777FF] hover:cursor-pointer hover:border-b-[3px] hover:pb-[5px] data-[active=true]:text-[#000AFA] data-[active=true]:border-b-[#000AFA] data-[active=true]:cursor-pointer data-[active=true]:border-b-[3px] "
                        }
                      >
                        {translations.navigation.navTitles[item.id]}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          {!AUTH_DISABLED && (
            <div className="h-20 bg-white dark:bg-black rounded-2xl px-4 flex navbar">
              {session.status === "authenticated" ? (
                <button
                  onClick={() => {
                    signOut({
                      callbackUrl: `/${locale}/`,
                    }).then();
                  }}
                  className="flex items-center justify-center h-full hover:text-red-500 transition-all duration-150 cursor-pointer"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src={session.data.user?.image ?? ""}
                        alt="@shadcn"
                      />
                      <AvatarFallback>
                        {session.data.user?.name
                          ?.split(" ")
                          .map((name) => name.at(0))
                          .join("") ?? "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-bold text-[1.1rem] ">
                      {session.data.user?.name}
                    </span>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => {
                    signIn("keycloak").then();
                  }}
                  className="flex items-center justify-center h-full hover:text-muted-foreground transition-all duration-150 cursor-pointer"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Avatar>
                      <AvatarFallback>
                        <User />
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-bold text-[1.1rem] ">
                      {translations.navigation.signIn}
                    </span>
                  </div>
                </button>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
