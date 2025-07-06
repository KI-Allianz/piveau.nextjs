import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {DistributionDownloadButton} from "@/components/distributions/DistributionDownloadButton";
import {DistributionLinkedDataButton} from "@/components/distributions/DistributionLinkedDataButton";
import {StandardSchemaV1} from "@standard-schema/spec";
import {schemaDataset} from "@piveau/sdk-core/model";
import {useLocale} from "@/hooks/useLocale";
import {DistributionLicense} from "@/components/distributions/DistributionLicense";
import {format} from "date-fns";


interface Props {
  distribution: NonNullable<StandardSchemaV1.InferOutput<typeof schemaDataset>["distributions"]>[number]
}

export default function DistributionCard({ distribution }: Props) {
  const { translate } = useLocale();

  console.log(distribution)

  return (
    <Card key={distribution.id} className="w-full flex flex-row justify-between">
      <div className="flex-1">
        <CardHeader>
          <CardTitle>
            {translate(distribution.title)}
          </CardTitle>
          <CardDescription>
            {translate(distribution.description)}
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
          <span className="text-end text-muted-foreground">{distribution.modified && format(distribution.modified, "dd MMMM yyyy")}</span>
          <DistributionDownloadButton access_urls={distribution.access_url} download_urls={distribution.download_url} />
          <DistributionLinkedDataButton id={distribution.id} />
        </div>
      </div>
    </Card>
  )
}