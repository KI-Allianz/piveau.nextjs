"use client";

import { supportedLocales } from "@/lib/lang";
import { ThemeProviderProps } from "next-themes";
import { NextFontWithVariable } from "next/dist/compiled/@next/font";
import { translations } from "@/lib/lang/base";

export interface ProjectTheme {
  id: string;
  name: string;
  fonts: NextFontWithVariable[];
  themeProvider?: ThemeProviderProps;

  headElements: React.ReactNode[];

  footer: {
    enableLanguageSelector: boolean;
    enableThemeToggle: boolean;
  };

  lang: {
    default: supportedLocales;
    supported: supportedLocales[];
    translations: Record<
      supportedLocales,
      | {
          title: string;
        }
      | undefined
    >;
  };
}

export interface ProjectClientTheme {
  components: {
    SupportSection: React.ComponentType;
    Logo: React.ComponentType;
  };

  footer: {
    buildFooterLinks: (
      translations: translations,
    ) => Array<{ label: string; href: string }>;
  };
}
