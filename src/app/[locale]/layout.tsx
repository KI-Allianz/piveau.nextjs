import React from "react";
import {LanguageProvider} from "@/hooks/useLocale";
import {redirect} from "next/navigation";
import {defaultLocale, supportedLocales} from "@/lib/lang";

export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params;
  console.log(supportedLocales)

  if (!locale || !supportedLocales.includes(locale)) {
    redirect("/" + defaultLocale);
  }

  return (
    <LanguageProvider language={locale}>{children}</LanguageProvider>
  );
}
