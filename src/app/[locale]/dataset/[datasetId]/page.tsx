import { getResourceById } from "@piveau/sdk-core";
import {StandardSchemaV1} from "@standard-schema/spec";
import {schemaDataset} from "@piveau/sdk-core/model";
import DatasetDetailsHeader from "./_components/DatasetDetailsHeader";
import DatasetDetailsKeywords from "./_components/DatasetDetailsKeywords";
import DatasetDetailsDistributions from "./_components/DatasetDetailsDistributions";
import Header from "@/components/Header";
import React from "react";
import Footer from "@/components/Footer";
import MapComponent from "@/components/MapComponent";
import DatasetDetailsCategories from "@/app/[locale]/dataset/[datasetId]/_components/DatasetDetailsCategories";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {getTranslations, supportedLocales} from "@/lib/lang";
import DatasetDetailsDescription from "@/app/[locale]/dataset/[datasetId]/_components/DatasetDetailsDescription";
import DatasetDetailsChatbot from "@/app/[locale]/dataset/[datasetId]/_components/DatasetDetailsChatbot";

interface Props {
  params: Promise<{datasetId: string, locale: supportedLocales}>;
}

export default async function DatasetPage({ params }: Props) {

  const { datasetId, locale } = await params;
  const translations = getTranslations(locale)
  const response = await getResourceById<StandardSchemaV1.InferOutput<typeof schemaDataset>>({
    baseUrl: 'https://piveau.hlrs.de/hub/search/',
    resource: 'datasets',
    id: datasetId,
  })

  return (
    <div className="bg-background w-full max-w-[1920px] mx-auto shadow-[0_0_12px_rgba(0,0,0,0.17)]">
      <Header />
      <div className="px-10 pt-20 w-full max-w-7xl mx-auto flex flex-col gap-5">
        <DatasetDetailsHeader dataset={response.result} />

        <Accordion type="multiple" className="w-full" defaultValue={["description", "keywords", "categories", "distributions", "assistant", "map"]}>
          <AccordionItem value={"description"} className="py-2">
            <AccordionTrigger className="py-4 text-2xl leading-6 hover:no-underline">
              {translations.dataset.description}
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <DatasetDetailsDescription description={response.result.description} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value={"keywords"} className="py-2">
            <AccordionTrigger className="py-4 text-2xl leading-6 hover:no-underline">
              {translations.dataset.keywords}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-2">
              <DatasetDetailsKeywords dataset={response.result} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value={"categories"} className="py-2">
            <AccordionTrigger className="py-4 text-2xl leading-6 hover:no-underline">
              {translations.dataset.categories}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-2">
              <DatasetDetailsCategories dataset={response.result} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value={"distributions"} className="py-2">
            <AccordionTrigger className="py-4 text-2xl leading-6 hover:no-underline">
              {translations.dataset.distribution.title}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-2">
              <DatasetDetailsDistributions dataset={response.result} />
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
