"use client";

import { ProjectTheme } from "@/themes/types";
import React, { createContext, useContext, ReactNode } from "react";

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
