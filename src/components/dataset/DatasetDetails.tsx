"use client";

import DatasetDetailsHeader from "./DatasetDetailsHeader";
import DatasetDetailsDistributions from "./DatasetDetailsDistributions";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MapComponent from "@/components/MapComponent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import DatasetDetailsChatbot from "@/components/dataset/DatasetDetailsChatbot";
import { trpc } from "@/app/_trpc/client";
import { useEffect } from "react";
import { useLocale } from "@/hooks/useLocale";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
}

export default function DatasetDetails({ id }: Props) {
  const { locale, translations } = useLocale();
  const router = useRouter();
  const { data, error } = trpc.dataset.get.useQuery({ id });

  useEffect(() => {
    if (error?.data?.httpStatus === 401) {
      router.push(`/auth/signin?callbackUrl=/${locale}/dataset/${id}`);
    }
  }, [error, locale]);

  return (
    <div className="bg-background w-full max-w-[1920px] mx-auto shadow-[0_0_12px_rgba(0,0,0,0.17)]">
      <Header />
      <div className="px-10 pt-20 w-full max-w-7xl mx-auto flex flex-col gap-5">
        <DatasetDetailsHeader
          data={data}
          baseUrl={`${process.env.DOMAIN || "http://localhost:3000"}`}
          supportEmail={process.env.NEXT_PUBLIC_SUPPORT_EMAIL}
          isAiModel={false}
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
              <DatasetDetailsDistributions dataset={data} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value={"assistant"} className="py-2">
            <AccordionTrigger className="py-4 text-2xl leading-6 hover:no-underline">
              {translations.dataset.assistant.title}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-2">
              <DatasetDetailsChatbot
                dataset={data}
                backendUrl={
                  process.env.NEXT_PUBLIC_CHATBOT_BACKEND_URL ||
                  "https://piveau.hlrs.de/metadataassistant"
                }
              />
            </AccordionContent>
          </AccordionItem>
          {data?.spatial && (
            <AccordionItem value={"map"} className="py-2">
              <AccordionTrigger className="py-4 text-2xl leading-6 hover:no-underline">
                {translations.dataset.map.title}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-2">
                <MapComponent geoJsonData={data.spatial} />
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
      <Footer />
    </div>
  );
}
