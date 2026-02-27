import { Exo_2, Overpass } from "next/font/google";
import { ProjectTheme } from "../types";
import { headElements } from "./head";

const exo2 = Exo_2({
  variable: "--font-exo-2",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});
const overpass = Overpass({
  variable: "--font-overpass",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const HammerTheme: ProjectTheme = {
  id: "hammerhai",
  name: "HammerHAI",
  fonts: [overpass, exo2],
  themeProvider: {
    defaultTheme: "light",
    forcedTheme: "light",
  },
  headElements: headElements,
  footer: {
    enableLanguageSelector: false,
    enableThemeToggle: false,
  },

  lang: {
    default: "en",
    supported: ["en"],
    translations: {
      de: undefined,
      en: {
        title: "Welcome to the HammerHAI data platform",
      },
    },
  },
};
