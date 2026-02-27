import { Nunito_Sans } from "next/font/google";
import { ProjectTheme } from "../types";
import { headElements } from "./head";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const KiAllianzTheme: ProjectTheme = {
  id: "kiallianz",
  name: "KI-Allianz",
  fonts: [nunitoSans],
  themeProvider: {
    defaultTheme: "system",
    enableSystem: true,
  },
  headElements: headElements,
  footer: {
    enableLanguageSelector: false,
    enableThemeToggle: true,
  },

  lang: {
    default: "de",
    supported: ["de"],
    translations: {
      de: {
        title: "Willkommen zur KI-Allianz Datenplattform",
      },
      en: undefined,
    },
  },
};
