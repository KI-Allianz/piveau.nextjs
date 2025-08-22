'use client'

import React, { createContext, useContext } from 'react';
import {
  buildTranslateDictFunction,
  defaultLocale, getDateLocale, getTranslations,
  supportedLocales
} from "@/lib/lang";
import {redirect, usePathname} from "next/navigation";
import {facetIds} from "@/lib/lang/facets";

const LanguageContext = createContext<{
  language: supportedLocales
}>({
  language: defaultLocale
});

export function LanguageProvider({
                              children, language
                            }: {
  language: supportedLocales;
  children: React.ReactNode;
}) {
  return (
    <LanguageContext.Provider value={{
      language: language
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LanguageContext);
  if (context === null) {
    throw new Error('useLocale must be used within an LanguageProvider');
  }

  // console.log(`Current locale: ${context.language}`);

  const pathname = usePathname()

  return {
    locale: context.language,
    dateLocale: getDateLocale(context.language),
    setLocale: (newLocale: supportedLocales) => {
      // This is a placeholder for setting the locale.
      // In a real application, you might want to store this in a global state or context.
      console.log(`Locale set to: ${newLocale}`);
      redirect(`/${newLocale}/${pathname.split("/").slice(2).join("/")}`)
    },
    translateDict: buildTranslateDictFunction(context.language),
    translations: getTranslations(context.language),
    translateFacet: (facetId: facetIds) => getTranslations(context.language).facets[facetId]
  }
}