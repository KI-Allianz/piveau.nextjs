import React from "react";
import { LanguageProvider } from "@/hooks/useLocale";
import { redirect } from "next/navigation";
import { defaultLocale, supportedLocales, SupportedLocales } from "@/lib/lang";
import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "next-themes";
import {getLicenses} from "@/lib/license";
import {LicenseProvider} from "@/hooks/useLicenses";
import {AuthProviders} from "@/components/AuthProvider";
import Provider from "../_trpc/Provider";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

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

  if (!locale || !SupportedLocales.includes(locale as supportedLocales)) {
    redirect("/" + defaultLocale);
  }

  const licenses = await getLicenses();

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
      </head>
      <body className={`${nunitoSans.variable} antialiased`}>
      <AuthProviders>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="w-full bg-white dark:bg-black">
              <LanguageProvider language={locale as supportedLocales}>
                <LicenseProvider licenses={licenses} >
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
