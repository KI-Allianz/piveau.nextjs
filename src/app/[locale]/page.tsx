import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CategorySlider } from "@/components/homepage/CategorySlider";
import { supportedLocales } from "@/lib/lang";
import { SearchPreview } from "@/components/homepage/SearchPreview";
import { headers } from "next/headers";
import { getTheme } from "@/themes";
import { SupportSection } from "@/components/SupportSection";
import { FeaturedDatasets } from "@/components/homepage/FeaturedDatasets";
import { FeaturedModels } from "@/components/homepage/FeaturedModels";

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
      <div className="px-10 pt-20 w-full max-w-7xl mx-auto flex flex-col gap-5">
        <h1 className="text-4xl font-bold mb-6 text-center">
          {theme.lang.translations[locale]?.title || ""}
        </h1>
        <div className="w-full flex justify-center pb-4">
          <span className="max-w-2/3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
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
