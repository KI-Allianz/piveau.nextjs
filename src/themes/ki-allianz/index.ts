import { Nunito_Sans } from "next/font/google";
import { ProjectTheme } from "../types";
import SupportSection from "./SupportSection";
import Logo from "./Logo";

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
  components: {
    SupportSection,
    Logo,
  },
  footer: {
    enableLanguageSelector: false,
    enableThemeToggle: true,
    buildFooterLinks: (t) => [
      { label: t.footer.imprint, href: "https://www.hlrs.de/de/impressum" },
      {
        label: t.footer.privacy,
        href: "https://www.hlrs.de/de/datenschutzerklaerung",
      },
    ],
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
