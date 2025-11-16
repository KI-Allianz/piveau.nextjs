import Header from "@/components/Header";
import React from "react";
import SupportSection from "@/components/SupportSection";
import Footer from "@/components/Footer";
import {CategorySlider} from "@/components/homepage/CategorySlider";
import {supportedLocales} from "@/lib/lang";

interface Props {
  params: Promise<{ locale: supportedLocales }>;
}

export default async function MainPage({params}: Props) {
  const { locale } =  await params

  return (
    <div className="bg-background w-full max-w-[1920px] mx-auto shadow-[0_0_12px_rgba(0,0,0,0.17)]">
      <Header />
      <div className="px-10 pt-20 w-full max-w-7xl mx-auto flex flex-col gap-10">
        <h1 className="text-4xl font-bold mb-6">Willkommen zur KI-Allianz Datenplattform</h1>

        <CategorySlider locale={locale} />
      </div>

      <SupportSection />

      <Footer />
    </div>
  )
}