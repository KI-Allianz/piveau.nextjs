"use client";

import { ProjectClientTheme } from "../types";
import SupportSection from "./SupportSection";
import Logo from "./Logo";

export const KiAllianzFunctions: ProjectClientTheme = {
  components: {
    SupportSection,
    Logo,
  },
  footer: {
    buildFooterLinks: (t) => [
      { label: t.footer.imprint, href: "https://www.hlrs.de/de/impressum" },
      {
        label: t.footer.privacy,
        href: "https://www.hlrs.de/de/datenschutzerklaerung",
      },
    ],
  },
};
