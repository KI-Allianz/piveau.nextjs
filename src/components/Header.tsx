"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import {usePathname} from "next/navigation";
import {twMerge} from "tailwind-merge";

const navItems = [
  {
    title: "Datasets",
    href: "/",
  },
  {
    title: "Catalogues",
    href: "/catalogues",
  },
  {
    title: "Events",
    href: "https://ki-allianz.de/events/",
  },
  {
    title: "Magazin",
    href: "https://ki-allianz.de/magazin/",
  },
  {
    title: "Newsletter",
    href: "https://ki-allianz.de/newsletter/",
  },
  {
    title: "Presse",
    href: "https://ki-allianz.de/presse/",
  },
  {
    title: "Kontakt",
    href: "https://ki-allianz.de/kontakt/",
  }
];

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="">
      <div className="pt-4 mx-4 justify-center flex">
        <nav className="navbar flex flex-row items-center justify-between w-full max-w-[1440px] h-[80px] bg-white rounded-2xl pr-[2.3rem] pl-[3.75rem]" >
          <Link className="navbar-brand" href="https://ki-allianz.de/">
            <Logo />
          </Link>
          <div className="flex items-center h-[48px]" id="navbarNav">
            <ul className="flex flex-row mt-0">
              {navItems.map((item, i) => {
                return (
                  <li
                    key={`navItem@${i}`}
                    className={twMerge("text-black h-[48px]")}
                  >
                    <Link
                      href={item.href}
                      data-active={item.href === pathname}
                      className={"pt-[4px] block mx-6 font-bold text-[1.1rem] transition-[padding-bottom] duration-300 pb-[3px] border-b-2 border-b-black hover:text-[#000AFA] hover:border-b-[#000AFA] hover:cursor-pointer hover:border-b-[3px] hover:pb-[5px] data-[active=true]:text-[#000AFA] data-[active=true]:border-b-[#000AFA] data-[active=true]:cursor-pointer data-[active=true]:border-b-[3px] "}>
                      {item.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  )
}