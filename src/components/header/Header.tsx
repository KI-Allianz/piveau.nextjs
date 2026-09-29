"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AUTH_DISABLED } from "@/lib/auth-config";
import { NavItemId } from "@/lib/lang/base";
import { fixThemeUrl, useTheme } from "@/hooks/useTheme";
import { getClientTheme } from "@/themes/client";
import HeaderUserSection from "./HeaderUserSection";
import HeaderLink from "./HeaderLink";
import { twMerge } from "cn";

const navItems = [
  {
    id: NavItemId.DATASETS,
    href: "/dataset",
    external: false,
  },
  {
    id: NavItemId.MODELS,
    href: "/dataset?tab=models",
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
  const { locale } = useLocale();
  const theme = useTheme();
  const clientTheme = getClientTheme(theme.id);

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftSectionRef = useRef<HTMLDivElement>(null);
  const navLinksRef = useRef<HTMLDivElement>(null);
  const userSectionRef = useRef<HTMLDivElement>(null);
  const navLinksWidthRef = useRef<number>(0);
  const userSectionWidthRef = useRef<number>(0);

  const mappedNavItems = theme.header.navItems
    .map((i) => ({ ...i, isTheme: true }))
    .concat(navItems.map((i) => ({ ...i, isTheme: false })));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const availableWidth = entry.contentRect.width;

        const newNavWidth = navLinksRef.current?.offsetWidth;
        if (newNavWidth && newNavWidth > 0) {
          navLinksWidthRef.current = newNavWidth;
        }

        const newUserWidth = userSectionRef.current?.offsetWidth;
        if (newUserWidth && newUserWidth > 0) {
          userSectionWidthRef.current = newUserWidth;
        }

        const logoWidth = leftSectionRef.current?.offsetWidth ?? 0;
        const navWidth = navLinksWidthRef.current || newNavWidth || 0;
        const userSectionWidth =
          userSectionWidthRef.current || newUserWidth || 0;

        const totalRequiredWidth =
          logoWidth + navWidth + (AUTH_DISABLED ? 0 : userSectionWidth) + 80;

        setIsMobile(availableWidth < totalRequiredWidth);
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <header className="header">
      <div className="pt-4 mx-4 justify-center flex">
        <nav
          className="h-20 flex flex-row gap-2 items-center w-full"
          ref={containerRef}
        >
          <div className="h-20 flex flex-1 items-center justify-between bg-white dark:bg-black rounded-2xl px-6 navbar gap-10">
            <div ref={leftSectionRef} className="flex items-center shrink-0">
              <Link
                className="navbar-brand dark:invert"
                href={fixThemeUrl(`/${locale}`, theme)}
              >
                <clientTheme.components.Logo />
              </Link>
            </div>

            <div
              className={twMerge("items-center h-12", isMobile && "hidden")}
              id="navbarNav"
              ref={navLinksRef}
            >
              <ul className="flex flex-row mt-0">
                {mappedNavItems.map((item, i) => (
                  <HeaderLink item={item} key={`navItem@${i}`} />
                ))}
              </ul>
            </div>

            <div className="items-center" hidden={!isMobile}>
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer"
                  >
                    <Menu className="w-6 h-6" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-60 justify-between">
                  <div className="flex flex-col items-center">
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <div className="mt-8 mb-6">
                      <Link
                        className="dark:invert inline-block px-4"
                        href={fixThemeUrl(`/${locale}`, theme)}
                        onClick={() => setIsOpen(false)}
                      >
                        <clientTheme.components.Logo />
                      </Link>
                    </div>
                    <ul className="flex flex-col gap-4">
                      {mappedNavItems.map((item, i) => (
                        <HeaderLink item={item} key={`sheetNavItem@${i}`} />
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 pb-4 flex justify-center">
                    <HeaderUserSection />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {!AUTH_DISABLED && (
            <div
              hidden={isMobile ?? false}
              ref={userSectionRef}
              className="h-20 bg-white dark:bg-black rounded-2xl px-4 navbar"
            >
              <HeaderUserSection />
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
