
const defaultLocale = 'en-US';

const extractLocale = (locale: string) => {
  // Extract the language part from the locale string (e.g., 'en-US' -> 'en')
  return locale.split('-')[0];
}


export function useLocale() {
  const locale = typeof window !== 'undefined' ? window.navigator.language : 'en-US';

  console.log(`Current locale: ${locale}`);

  return {
    getLocale: () => locale,
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

      const localeId = extractLocale(locale || defaultLocale);

      // This is a placeholder for a translation function.
      // In a real application, you would implement actual translation logic.
      return item[localeId] || item[extractLocale(defaultLocale)] || 'Translation not available';
    }
  }
}