"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {languageNames, SupportedLocales} from "@/lib/lang";
import {useLocale} from "@/hooks/useLocale";

export default function LanguageSelector() {
  const pathname = usePathname()
  const { locale, setLocale } = useLocale();

  return (
    <Select defaultValue={locale} onValueChange={setLocale}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Languages</SelectLabel>
          {SupportedLocales.map((locale) => (
            <Link key={locale} href={`/${locale}/${pathname.split("/").slice(2).join("/")}`} className="flex items-center">
              <SelectItem key={locale} value={locale}>
                {languageNames[locale]}
              </SelectItem>
            </Link>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}