import { supportedLocales } from "@/lib/lang";
import { redirect } from "next/navigation";
import { headers as getHeaders } from "next/headers";
import { dataTypes, pickBestDataType } from "@/lib/content";
import DatasetDetails from "@/components/dataset/DatasetDetails";

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

  return <DatasetDetails id={id} />;
}
