"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DistributionDownloadButton } from "@/components/distributions/DistributionDownloadButton";
import { DistributionLinkedDataButton } from "@/components/distributions/DistributionLinkedDataButton";
import { useLocale } from "@/hooks/useLocale";
import { DistributionLicense } from "@/components/distributions/DistributionLicense";
import { format } from "date-fns";
import HtmlSnippet from "@/components/HTMLSnippet";
import { ExpandableClamp } from "@/components/ExpandableClamp";
import {Dataset, UrlCollection} from "@/lib/utils";

interface Props {
  distribution: NonNullable<Dataset["distributions"]>[number];
  urls: UrlCollection;
}

export default function DistributionCard({ distribution, urls }: Props) {
  const { translateDict, dateLocale } = useLocale();

  // console.log(distribution)

  return (
    <Card
      key={distribution.id}
      className="w-full flex flex-row justify-between"
    >
      <div className="flex-1">
        <CardHeader>
          <CardTitle className="flex gap-2">
            {translateDict(distribution.title)}
          </CardTitle>
          <CardDescription>
            <ExpandableClamp collapsedHeight={120} gradientName={"from-card"}>
              <HtmlSnippet html={translateDict(distribution.description)} />
            </ExpandableClamp>
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-3">
          <div>
            {distribution.license && (
              <DistributionLicense license={distribution.license} />
            )}
          </div>
        </CardContent>
      </div>
      <div>
        <div className="flex flex-col gap-2 px-6 justify-between">
          <span className="text-end text-muted-foreground">
            {distribution.modified &&
              format(distribution.modified, "dd MMMM yyyy", {
                locale: dateLocale,
              })}
          </span>
          <span className="text-end text-muted-foreground text-nowrap">
            {distribution.format?.label}
          </span>
          <DistributionDownloadButton
            access_urls={distribution.access_url}
            download_urls={distribution.download_url}
          />
          <DistributionLinkedDataButton id={distribution.id} urls={urls} />
        </div>
      </div>
    </Card>
  );
}
