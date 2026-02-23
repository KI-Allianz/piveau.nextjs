import { Suspense } from "react";

import DatasetSearch from "@/components/dataset/DatasetSearch";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getTheme } from "@/themes";

export default async function DatasetsPage() {
  const theme = getTheme();

  return (
    <div className="bg-background w-full max-w-[1920px] mx-auto shadow-[0_0_12px_rgba(0,0,0,0.17)]">
      <Header />
      <div className="px-10 pt-20 w-full max-w-7xl mx-auto">
        <Suspense>
          <DatasetSearch />
        </Suspense>
      </div>

      {theme.components.SupportSection && <theme.components.SupportSection />}
      <Footer />
    </div>
  );
}
