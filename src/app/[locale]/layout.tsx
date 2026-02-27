import React from "react";
import { LanguageProvider } from "@/hooks/useLocale";
import { redirect } from "next/navigation";
import { supportedLocales } from "@/lib/lang";
import type { Metadata } from "next";
import "../globals.css";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { getLicenses } from "@/lib/license";
import { LicenseProvider } from "@/hooks/useLicenses";
import { AuthProviders } from "@/components/AuthProvider";
import Provider from "../_trpc/Provider";
import { getTheme } from "@/themes";
import { headers } from "next/headers";
import { ThemeProvider } from "@/hooks/useTheme";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const headerList = await headers();
  const themeId = headerList.get("x-selected-theme");
  const theme = getTheme(themeId);

  const licenses = await getLicenses();

  return (
    <html lang={locale} data-project={theme.id}>
      <head>{theme.headElements}</head>
      <body
        className={`${theme.fonts.map((f) => f.variable).join(" ")} antialiased`}
      >
        <AuthProviders>
          <ThemeProvider initialTheme={theme}>
            <NextThemesProvider
              {...theme.themeProvider}
              attribute="class"
              disableTransitionOnChange
            >
              <div className="w-full bg-white dark:bg-black">
                <LanguageProvider language={locale as supportedLocales}>
                  <LicenseProvider licenses={licenses}>
                    <Provider>{children}</Provider>
                  </LicenseProvider>
                </LanguageProvider>
              </div>
            </NextThemesProvider>
          </ThemeProvider>
        </AuthProviders>
      </body>
    </html>
  );
}
