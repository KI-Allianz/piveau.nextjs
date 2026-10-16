import { headers } from "next/headers";

import { supportedLocales } from "@/lib/lang";
import { getTheme } from "@/themes";
import Header from "@/components/header/Header";
import { SupportSection } from "@/components/SupportSection";
import { CategorySlider } from "@/components/homepage/CategorySlider";
import { SearchPreview } from "@/components/homepage/SearchPreview";
import { FeaturedDatasets } from "@/components/homepage/FeaturedDatasets";
import { FeaturedModels } from "@/components/homepage/FeaturedModels";
import Footer from "@/components/Footer";

interface Props {
  params: Promise<{ locale: supportedLocales }>;
}

export default async function MainPage({ params }: Props) {
  const { locale } = await params;
  const headerList = await headers();
  const themeId = headerList.get("x-selected-theme");
  const theme = getTheme(themeId);

  return (
    <div className="bg-background w-full max-w-[1920px] mx-auto shadow-[0_0_12px_rgba(0,0,0,0.17)]">
      <Header />
      <div className="px-5 pt-20 w-full max-w-7xl mx-auto flex flex-col gap-5">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center">
          {theme.lang.translations[locale]?.title || ""}
        </h1>
        <div className="w-full flex justify-center pb-4">
          <span className="sm:max-w-2/3">
            {theme.lang.translations[locale]?.description || ""}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <SearchPreview />

          {theme.homepage.showCategorySlider && <CategorySlider />}
          {theme.homepage.showFeaturedDatasets && <FeaturedDatasets />}
          {theme.homepage.showFeaturedModels && <FeaturedModels />}
        </div>
      </div>

      <SupportSection />

      <Footer />
    </div>
  );
}
