import { Suspense } from "react";

import DatasetSearch from "@/components/dataset/DatasetSearch";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SupportSection from "@/components/SupportSection";

export default async function DatasetsPage() {
  return (
    <div className="bg-background w-full max-w-[1920px] mx-auto shadow-[0_0_12px_rgba(0,0,0,0.17)]">
      <Header />
      <div className="px-10 pt-20 w-full max-w-7xl mx-auto">
        <Suspense>
          <DatasetSearch />
        </Suspense>
      </div>

      <SupportSection />

      <Footer />
    </div>
  );
}
