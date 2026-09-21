"use client";

import DatasetDetailsHeader from "./DatasetDetailsHeader";
import DatasetDetailsDistributions from "./DatasetDetailsDistributions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { trpc } from "@/app/_trpc/client";
import { useEffect } from "react";
import { useLocale } from "@/hooks/useLocale";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
}

export default function ModelDetails({ id }: Props) {
  const { locale, translations } = useLocale();
  const router = useRouter();
  const { data, error } = trpc.model.get.useQuery({ id });

  useEffect(() => {
    if (error?.data?.httpStatus === 401 || error?.data?.httpStatus === 403) {
      router.push(`/auth/signin?callbackUrl=/${locale}/model/${id}`);
    }
  }, [error, locale]);

  return (
    <div className="px-10 pt-20 w-full max-w-7xl mx-auto flex flex-col gap-5">
      <DatasetDetailsHeader
        data={data}
        baseUrl={process.env.DOMAIN || ""}
        isAiModel={true}
      />

      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={["distributions"]}
      >
        <AccordionItem value={"distributions"} className="py-2">
          <AccordionTrigger className="py-4 text-2xl leading-6 hover:no-underline">
            {translations.dataset.distribution.titleWeights}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-2">
            <DatasetDetailsDistributions dataset={data} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
