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

  meta: {
    headElements: headElements,
  },
  header: {
    navItems: [],
  },
  homepage: {
    showCategorySlider: false,
    showFeaturedDatasets: true,
    showFeaturedModels: true,
    description: (
      <>
        Unlock manufacturing and engineering data for AI. The HammerHAI Data
        Platform brings together relevant datasets and AI models from federated
        sources and connects directly to the AI Factory through DCAT-based
        interoperability. For registered HammerHAI users, upcoming capabilities
        include AI-driven pipelines for AI-ready data and provides fine-grained
        management and{" "}
        <a
          href="/en/editor"
          className="underline underline-offset-2 hover:text-(--main-accent)"
        >
          sharing of datasets and models
        </a>
        .
      </>
    ),
  },
  footer: {
    enableLanguageSelector: false,
    enableThemeToggle: false,
  },
  config: {
    support: {
      email: "info@hlrs.de",
    },
  },

  lang: {
    default: "en",
    supported: ["en"],
    translations: {
      de: undefined,
      en: {
        title: "Welcome to the HammerHAI data platform",
        hammerhai: "HammerHAI",
      },
    },
  },
};
