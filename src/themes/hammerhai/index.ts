import { Exo_2, Overpass } from "next/font/google";
import { ProjectTheme } from "../types";
import SupportSection from "./SupportSection";
import Logo from "./Logo";

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
  components: {
    SupportSection,
    Logo,
  },
  footer: {
    enableLanguageSelector: false,
    enableThemeToggle: false,
    buildFooterLinks: (t) => [
      { label: t.footer.imprint, href: "https://www.hammerhai.eu/imprint/" },
      {
        label: t.footer.privacy,
        href: "https://www.hammerhai.eu/privacy-policy/",
      },
    ],
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
