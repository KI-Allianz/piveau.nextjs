import DatasetSearch from "./_components/DatasetSearch";
import React, { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function Home() {
  const urls = {
    SEARCH: process.env.SEARCH_HUB_URL!,
    REPO: process.env.REPO_HUB_URL!,
  };

  return (
    <div className="bg-background w-full max-w-[1920px] mx-auto shadow-[0_0_12px_rgba(0,0,0,0.17)]">
      <Header />
      <div className="px-10 pt-20 w-full max-w-7xl mx-auto">
        <Suspense>
          <DatasetSearch urls={urls} />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
