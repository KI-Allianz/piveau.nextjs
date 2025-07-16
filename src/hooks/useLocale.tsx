'use client'

import React, { createContext, useContext } from 'react';
import {defaultLocale} from "@/lib/lang";

const extractLocale = (locale: string) => {
  // Extract the language part from the locale string (e.g., 'en-US' -> 'en')
  return locale.split('-')[0];
}

const LanguageContext = createContext<{
  language: string
}>({
  language: defaultLocale
});

export function LanguageProvider({
                              children,
                                   language
                            }: {
  language: string;
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

  console.log(`Current locale: ${context.language}`);

  return {
    getLocale: () => context.language,
    setLocale: (newLocale: string) => {
      // This is a placeholder for setting the locale.
      // In a real application, you might want to store this in a global state or context.
      console.log(`Locale set to: ${newLocale}`);
    },
    translate: (item?: string | Record<string, string> | null) => {
      if (!item) {
        return '';
      }

      if (typeof item === 'string') {
        return item; // If it's a string, return it as is
      }

      const localeId = extractLocale(context.language);

      // This is a placeholder for a translation function.
      // In a real application, you would implement actual translation logic.
      return item[localeId] || item[extractLocale(defaultLocale)] || 'Translation not available';
    }
  }
}