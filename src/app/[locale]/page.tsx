import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CategorySlider } from "@/components/homepage/CategorySlider";
import { supportedLocales } from "@/lib/lang";
import { SearchPreview } from "@/components/homepage/SearchPreview";
import { getTheme } from "@/themes";

interface Props {
  params: Promise<{ locale: supportedLocales }>;
}

export default async function MainPage({ params }: Props) {
  const { locale } = await params;
  const theme = getTheme();

  return (
    <div className="bg-background w-full max-w-[1920px] mx-auto shadow-[0_0_12px_rgba(0,0,0,0.17)]">
      <Header />
      <div className="px-10 pt-20 w-full max-w-7xl mx-auto flex flex-col gap-5">
        <h1 className="text-4xl font-bold mb-6 text-center">
          {theme.lang.translations[locale]?.title || ""}
        </h1>

        <div className="flex flex-col gap-4">
          <SearchPreview />

          <CategorySlider locale={locale} />
        </div>
      </div>

      {theme.components.SupportSection && <theme.components.SupportSection />}

      <Footer />
    </div>
  );
}
