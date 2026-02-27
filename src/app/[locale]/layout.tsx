import React from "react";
import { LanguageProvider } from "@/hooks/useLocale";
import { redirect } from "next/navigation";
import { defaultLocale, supportedLocales, SupportedLocales } from "@/lib/lang";
import type { Metadata } from "next";
import "../globals.css";
import { ThemeProvider } from "next-themes";
import { getLicenses } from "@/lib/license";
import { LicenseProvider } from "@/hooks/useLicenses";
import { AuthProviders } from "@/components/AuthProvider";
import Provider from "../_trpc/Provider";
import { getTheme } from "@/themes";

export const metadata: Metadata = {
  title: "Piveau Next",
  description: "Piveau using Next.js",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const theme = getTheme();

  if (!locale || !SupportedLocales.includes(locale as supportedLocales)) {
    // TODO: redirect locale to same path with default locale instead of root path
    redirect(`/${defaultLocale}/`);
  }

  const licenses = await getLicenses();

  return (
    <html lang={locale} data-project={theme.id}>
      <head>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        {/* <link rel="stylesheet" type="text/css" href={theme.stylesheetPath} /> */}
      </head>
      <body
        className={`${theme.fonts.map((f) => f.variable).join(" ")} antialiased`}
      >
        <AuthProviders>
          <ThemeProvider
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
          </ThemeProvider>
        </AuthProviders>
      </body>
    </html>
  );
}
