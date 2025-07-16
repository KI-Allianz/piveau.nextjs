import {en} from "@/lib/lang/en";
import {de} from "@/lib/lang/de";
import { de as deDate, enUS as enDate } from 'date-fns/locale';

export const defaultLocale = 'en';
export type supportedLocales = 'en' | 'de';
export const SupportedLocales = ['en', 'de'];

export const extractLocale = (locale: string) => {
  // Extract the language part from the locale string (e.g., 'en-US' -> 'en')
  return locale.split('-')[0];
}

export function getTranslations(locale: supportedLocales) {
  // This function should return the translations for the given locale.
  // For now, we will return an empty object as a placeholder.
  // In a real application, you would import the actual translations.
  switch (locale) {
    case 'en':
      return en
    case 'de':
      return de
  }
}

export function getDateLocale(locale: supportedLocales) {
  // This function should return the date locale for the given locale.
  // For now, we will return 'en-US' as a placeholder.
  // In a real application, you would return the actual date locale.
  switch (locale) {
    case 'en':
      return enDate;
    case 'de':
      return deDate
  }
}

export const translateDict = (lang: supportedLocales, item?: string | Record<string, string> | null) => {
  if (!item) {
    return '';
  }

  if (typeof item === 'string') {
    return item; // If it's a string, return it as is
  }

  const localeId = extractLocale(lang);

  // This is a placeholder for a translation function.
  // In a real application, you would implement actual translation logic.
  return item[localeId] || item[extractLocale(defaultLocale)] || 'Translation not available';
}

export const buildTranslateDictFunction = (lang: supportedLocales) => {
  return (item?: string | Record<string, string> | null) => {
    return translateDict(lang, item);
  };
}