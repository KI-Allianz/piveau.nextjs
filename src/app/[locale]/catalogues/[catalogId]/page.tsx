import DatasetSearch from "../../_components/DatasetSearch";
import React, { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getResourceById } from "@piveau/sdk-core";
import { supportedLocales } from "@/lib/lang";
import { StandardSchemaV1 } from "@standard-schema/spec";
import { schemaCatalog } from "@piveau/sdk-core/model";

interface Props {
  params: Promise<{ catalogId: string; locale: supportedLocales }>;
}

export default async function CatalogPage({ params }: Props) {
  const { catalogId } = await params;

  const urls = {
    SEARCH: process.env.SEARCH_HUB_URL!,
    REPO: process.env.REPO_HUB_URL!,
  };

  const response = await getResourceById<
    StandardSchemaV1.InferOutput<typeof schemaCatalog>
  >({
    baseUrl: urls.SEARCH,
    resource: "catalogues",
    id: catalogId,
  });

  return (
    <div className="bg-background w-full max-w-[1920px] mx-auto shadow-[0_0_12px_rgba(0,0,0,0.17)]">
      <Header />
      <div className="px-10 pt-20 w-full max-w-7xl mx-auto">
        <Suspense>
          <DatasetSearch catalog={response.result} urls={urls} />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
