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

  meta: {
    headElements: React.ReactNode[];
  };
  header: {
    navItems: Array<{
      id: string;
      href: string;
      external: boolean;
    }>;
  };
  homepage: {
    showCategorySlider: boolean;
    showFeaturedDatasets: boolean;
    showFeaturedModels: boolean;
  };
  footer: {
    enableLanguageSelector: boolean;
    enableThemeToggle: boolean;
  };

  config: {
    support: {
      email: string;
    };
  };

  lang: {
    default: supportedLocales;
    supported: supportedLocales[];
    translations: Record<
      supportedLocales,
      | {
          title: string;
          [key: string]: string; // Allows arbitrary additional keys with string values
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
