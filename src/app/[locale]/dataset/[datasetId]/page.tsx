import { getResourceById } from "@piveau/sdk-core";
import { StandardSchemaV1 } from "@standard-schema/spec";
import { schemaDataset } from "@piveau/sdk-core/model";
import DatasetDetailsHeader from "./_components/DatasetDetailsHeader";
import DatasetDetailsDistributions from "./_components/DatasetDetailsDistributions";
import Header from "@/components/Header";
import React from "react";
import Footer from "@/components/Footer";
import MapComponent from "@/components/MapComponent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getTranslations, supportedLocales } from "@/lib/lang";
import DatasetDetailsChatbot from "@/app/[locale]/dataset/[datasetId]/_components/DatasetDetailsChatbot";
import { redirect } from "next/navigation";
import { headers as getHeaders } from "next/headers";
import { dataTypes, pickBestDataType } from "@/lib/content";

interface Props {
  params: Promise<{ datasetId: string; locale: supportedLocales }>;
}

export default async function DatasetPage({ params }: Props) {
  const { datasetId, locale } = await params;
  const headers = await getHeaders();

  const urls = {
    SEARCH: process.env.SEARCH_HUB_URL!,
    REPO: process.env.REPO_HUB_URL!,
  };

  // Content negotiation up front
  const accept = headers.get("accept") ?? "";
  const match = pickBestDataType(accept, dataTypes);

  if (match) {
    redirect(urls.REPO + `datasets/${datasetId}${match.value}`);
  }

  const translations = getTranslations(locale);
  const response = await getResourceById<
    StandardSchemaV1.InferOutput<typeof schemaDataset>
  >({
    baseUrl: urls.SEARCH,
    resource: "datasets",
    id: datasetId,
  });

  return (
    <div className="bg-background w-full max-w-[1920px] mx-auto shadow-[0_0_12px_rgba(0,0,0,0.17)]">
      <Header />
      <div className="px-10 pt-20 w-full max-w-7xl mx-auto flex flex-col gap-5">
        <DatasetDetailsHeader
          dataset={response.result}
          baseUrl={process.env.DOMAIN || ""}
          urls={urls}
        />

        <Accordion
          type="multiple"
          className="w-full"
          defaultValue={["distributions", "assistant", "map"]}
        >
          <AccordionItem value={"distributions"} className="py-2">
            <AccordionTrigger className="py-4 text-2xl leading-6 hover:no-underline">
              {translations.dataset.distribution.title}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-2">
              <DatasetDetailsDistributions
                dataset={response.result}
                urls={urls}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value={"assistant"} className="py-2">
            <AccordionTrigger className="py-4 text-2xl leading-6 hover:no-underline">
              {translations.dataset.assistant.title}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-2">
              <DatasetDetailsChatbot dataset={response.result} />
            </AccordionContent>
          </AccordionItem>
          {response.result.spatial && (
            <AccordionItem value={"map"} className="py-2">
              <AccordionTrigger className="py-4 text-2xl leading-6 hover:no-underline">
                {translations.dataset.map.title}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-2">
                <MapComponent geoJsonData={response.result.spatial} />
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
      <Footer />
    </div>
  );
}
