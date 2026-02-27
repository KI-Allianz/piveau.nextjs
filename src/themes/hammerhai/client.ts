"use client";

import { ProjectClientTheme } from "../types";
import Logo from "./Logo";
import SupportSection from "./SupportSection";

export const HammerHaiFunctions: ProjectClientTheme = {
  components: {
    SupportSection,
    Logo,
  },
  footer: {
    buildFooterLinks: (t) => [
      { label: t.footer.imprint, href: "https://www.hammerhai.eu/imprint/" },
      {
        label: t.footer.privacy,
        href: "https://www.hammerhai.eu/privacy-policy/",
      },
    ],
  },
};
