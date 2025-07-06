import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import HtmlSnippet from "@/components/HTMLSnippet";
import {Badge} from "@/components/ui/badge";
import {StandardSchemaV1} from "@standard-schema/spec";
import {schemaDataset} from "@piveau/sdk-core/model";
import {parse, parseISO} from "date-fns";
import {useLocale} from "@/hooks/useLocale";

function parseDate(dateString: string | undefined | null): Date | null {
  if (!dateString) {
    return new Date("2000-01-01");
  }

  let date = parseISO(dateString);
  if (!isNaN(date.getTime())) {
    return date;
  }

  return parse(dateString, "yyyy-MM-dd", new Date());
}

interface Props {
  dataset: StandardSchemaV1.InferOutput<typeof schemaDataset>;
}

export default function DatasetCard({dataset}: Props) {
  const { translate } = useLocale();

  return (
    <Card
      className="w-full hover:border-primary hover:bg-card/60 transition-all duration-200 cursor-pointer"
    >
      <CardHeader>
        <CardTitle>
          <h2 className="text-2xl text-wrap">
            {translate(dataset.title)}
          </h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 justify-between">
          <CardDescription className="flex-2/3">
            <HtmlSnippet
              html={
                translate(dataset.description).slice(0, 205) +
                (translate(dataset.description).length > 205 ? "..." : "")
              }
            />
          </CardDescription>
          <div className="flex flex-wrap gap-2 flex-1/3">
            <Badge>
              {parseDate(dataset.issued)?.toLocaleDateString()}
            </Badge>
            <Badge>
              {parseDate(dataset.modified)?.toLocaleDateString()}
            </Badge>
            {dataset.distributions
              ?.map((keyword) => keyword.format?.label)
              .filter((format) => format)
              .map((format) => (
                <Badge>{format}</Badge>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}