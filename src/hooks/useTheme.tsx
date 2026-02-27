"use client";

import { DefaultTheme } from "@/themes";
import { ProjectTheme } from "@/themes/types";
import { createContext, useContext, ReactNode } from "react";

const ThemeContext = createContext<ProjectTheme | undefined>(undefined);

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: ReactNode;
  initialTheme: ProjectTheme;
}) {
  return (
    <ThemeContext.Provider value={initialTheme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}

export function fixThemeUrl(url: string, theme: ProjectTheme): string {
  const params = new URLSearchParams(url.split("?")[1] || "");
  if (theme.id === DefaultTheme) {
    params.delete("theme");
  } else {
    params.set("theme", theme.id);
  }

  if (params.toString()) {
    return url.split("?")[0] + "?" + params.toString();
  } else {
    return url.split("?")[0];
  }
}

export function getCleanUrl(url: string): string {
  const params = new URLSearchParams(url.split("?")[1] || "");
  params.delete("theme");
  return url.split("?")[0] + (params.toString() ? "?" + params.toString() : "");
}
