import DatasetDetailsDistributions from "../../../../components/dataset/DatasetDetailsDistributions";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getTranslations, supportedLocales } from "@/lib/lang";
import { redirect } from "next/navigation";
import { headers as getHeaders } from "next/headers";
import { dataTypes, pickBestDataType } from "@/lib/content";
import ModelDetailsHeader from "@/components/dataset/ModelDetailsHeader";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getModel } from "@/lib/repo/model/api";

interface Props {
  params: Promise<{ id: string; locale: supportedLocales }>;
}

export default async function ModelPage({ params }: Props) {
  const { id, locale } = await params;
  const headers = await getHeaders();
  const session = await getServerSession(authOptions);

  // Content negotiation up front
  const accept = headers.get("accept") ?? "";
  const match = pickBestDataType(accept, dataTypes);

  if (match) {
    redirect(
      `${process.env.DOMAIN}/${locale}/model/${id}/raw?format=${match.value}`,
    );
  }

  const translations = getTranslations(locale);
  const response = await getModel(id);

  const isAuthed =
    !!session?.user || process.env.NEXT_PUBLIC_AUTH_DISABLED === "true";
  const isPublic = response.keywords?.some(
    (k) => k.label.toLowerCase() === "public",
  );
  // const isPublic = true;
  if (!isPublic && !isAuthed) {
    redirect(`/auth/signin?callbackUrl=/${locale}/model/${id}`);
  }

  return (
    <div className="bg-background w-full max-w-[1920px] mx-auto shadow-[0_0_12px_rgba(0,0,0,0.17)]">
      <Header />
      <div className="px-10 pt-20 w-full max-w-7xl mx-auto flex flex-col gap-5">
        <ModelDetailsHeader
          dataset={response}
          baseUrl={process.env.DOMAIN || ""}
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
              <DatasetDetailsDistributions dataset={response} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <Footer />
    </div>
  );
}
