import React from "react";
import {LanguageProvider} from "@/hooks/useLocale";
import {redirect} from "next/navigation";
import {defaultLocale, supportedLocales, SupportedLocales} from "@/lib/lang";
import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "../globals.css";
import { Providers } from "@/components/Providers";

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
                                     children, params
                                   }: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: supportedLocales }>
}>) {

  const { locale } = await params;

  if (!locale || !SupportedLocales.includes(locale)) {
    redirect("/" + defaultLocale);
  }
  return (
    <html lang={locale}>
      <body
        className={`${nunitoSans.variable} antialiased`}
      >
        <div className="w-full bg-white">
          <LanguageProvider language={locale}>
            <Providers>{children}</Providers>
          </LanguageProvider>
        </div>
      </body>
    </html>
  );
}