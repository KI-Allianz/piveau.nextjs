"use client";

import React, { createContext, useContext } from "react";
import {
  buildTranslateDictFunction,
  getDateLocale,
  getTranslations,
  supportedLocales,
} from "@/lib/lang";
import { redirect, usePathname } from "next/navigation";
import { facetIds } from "@/lib/lang/facets";
import { useTheme } from "./useTheme";

const LanguageContext = createContext<supportedLocales | undefined>(undefined);

export function LanguageProvider({
  children,
  language,
}: {
  language: supportedLocales;
  children: React.ReactNode;
}) {
  return (
    <LanguageContext.Provider value={language}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within an LanguageProvider");
  }

  // console.log(`Current locale: ${context.language}`);

  const pathname = usePathname();
  const theme = useTheme();

  return {
    locale: context,
    theme: theme,
    dateLocale: getDateLocale(context),
    setLocale: (newLocale: supportedLocales) => {
      // This is a placeholder for setting the locale.
      // In a real application, you might want to store this in a global state or context.
      console.log(`Locale set to: ${newLocale}`);
      redirect(`/${newLocale}/${pathname.split("/").slice(2).join("/")}`);
    },
    translateDict: buildTranslateDictFunction(context, theme),
    translations: getTranslations(context),
    translateFacet: (facetId: facetIds) =>
      getTranslations(context).facets[facetId],
  };
}
