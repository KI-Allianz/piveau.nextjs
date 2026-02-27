"use client";

import { useTheme } from "@/hooks/useTheme";
import { getClientTheme } from "@/themes/client";

export const SupportSection = () => {
  const theme = useTheme();
  const clientTheme = getClientTheme(theme.id);

  return (
    clientTheme.components.SupportSection && (
      <clientTheme.components.SupportSection />
    )
  );
};
