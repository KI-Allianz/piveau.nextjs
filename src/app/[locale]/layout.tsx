import React from "react";
import { LanguageProvider } from "@/hooks/useLocale";
import { redirect } from "next/navigation";
import { defaultLocale, supportedLocales, SupportedLocales } from "@/lib/lang";
import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "../globals.css";
import { Providers } from "@/components/Providers";
import { ThemeProvider } from "next-themes";
import {getLicenses} from "@/lib/license";
import {LicenseProvider} from "@/hooks/useLicenses";

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
  params: Promise<{ locale: supportedLocales }>;
}>) {
  const { locale } = await params;

  if (!locale || !SupportedLocales.includes(locale)) {
    redirect("/" + defaultLocale);
  }

  const licenses = await getLicenses();

  return (
    <html lang={locale}>
      <body className={`${nunitoSans.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="w-full bg-white dark:bg-black">
            <LanguageProvider language={locale}>
              <LicenseProvider licenses={licenses} >
                <Providers>{children}</Providers>
              </LicenseProvider>
            </LanguageProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
