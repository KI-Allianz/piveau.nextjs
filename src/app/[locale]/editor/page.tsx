import { Suspense } from "react";

import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
import { SupportSection } from "@/components/SupportSection";
import { DatasetForm } from "@/components/editor/DatasetForm";

export default async function EditorPage() {
  return (
    <div className="bg-background w-full max-w-[1920px] mx-auto shadow-[0_0_12px_rgba(0,0,0,0.17)]">
      <Header />
      <div className="px-10 pt-20 w-full max-w-7xl mx-auto">
        <Suspense>
          <DatasetForm />
        </Suspense>
      </div>

      <SupportSection />
      <Footer />
    </div>
  );
}
