import { redirect } from "next/navigation";
import { headers as getHeaders } from "next/headers";

import { supportedLocales } from "@/lib/lang";
import { dataTypes, pickBestDataType } from "@/lib/content";

import DatasetDetails from "@/components/dataset/DatasetDetails";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Props {
  params: Promise<{ id: string; locale: supportedLocales }>;
}

export default async function DatasetPage({ params }: Props) {
  const { id, locale } = await params;
  const headers = await getHeaders();

  // Content negotiation up front
  const accept = headers.get("accept") ?? "";
  const match = pickBestDataType(accept, dataTypes);

  if (match) {
    redirect(
      `${process.env.DOMAIN}/${locale}/dataset/${id}/raw?format=${match.value}`,
    );
  }

  return (
    <div className="bg-background w-full max-w-[1920px] mx-auto shadow-[0_0_12px_rgba(0,0,0,0.17)]">
      <Header />
      <DatasetDetails id={id} />
      <Footer />
    </div>
  );
}
