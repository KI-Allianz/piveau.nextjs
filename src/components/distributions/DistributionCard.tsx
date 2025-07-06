import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {DistributionDownloadButton} from "@/components/distributions/DistributionDownloadButton";
import {DistributionLinkedDataButton} from "@/components/distributions/DistributionLinkedDataButton";
import {StandardSchemaV1} from "@standard-schema/spec";
import {schemaDataset} from "@piveau/sdk-core/model";
import {useLocale} from "@/hooks/useLocale";
import Link from "next/link";
import {Label} from "@/components/ui/label";


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
            <Label>License</Label>
            <div>
              <Link
                href={distribution.license?.resource ?? "#"}
                className="text-blue-500 hover:underline"
              >
                {distribution.license?.label}
              </Link>
            </div>
          </div>
        </CardContent>
      </div>
      <div>
        <CardContent className="flex flex-col gap-2">
          <DistributionDownloadButton access_urls={distribution.access_url} download_urls={distribution.download_url} />
          <DistributionLinkedDataButton id={distribution.id} />
        </CardContent>
      </div>
    </Card>
  )
}