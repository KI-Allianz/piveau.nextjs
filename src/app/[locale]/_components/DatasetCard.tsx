import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import HtmlSnippet from "@/components/HTMLSnippet";
import {Badge} from "@/components/ui/badge";
import {useLocale} from "@/hooks/useLocale";
import Link from "next/link";
import {Dataset, isAIModel, parseDate} from "@/lib/utils";

interface Props {
  dataset: Dataset;
}

export default function DatasetCard({dataset}: Props) {
  const { translateDict, translations, locale } = useLocale();

  return (
    <Link href={`/${locale}/dataset/${dataset.id}`} className="w-full" >
      <Card
        className="w-full hover:border-primary hover:bg-card/60 transition-all duration-200 cursor-pointer"
      >
        <CardHeader>
          <CardTitle>
            <h2 className="text-2xl text-wrap">
              {translateDict(dataset.title)}
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 justify-between">
            <CardDescription className="flex-2/3 snippet">
              <HtmlSnippet
                html={
                  translateDict(dataset.description).slice(0, 205) +
                  (translateDict(dataset.description).length > 205 ? "..." : "")
                }
              />
            </CardDescription>
            <div className="flex flex-wrap gap-2 flex-1/3">
              {isAIModel(dataset) && (
                <Badge variant={"outline"} className="bg-amber-100 text-amber-800 border-amber-500">
                  {translations.dataset.aiModel}
                </Badge>
              )}
              <Badge variant={"outline"}>
                {dataset.modified ? parseDate(dataset.modified)?.toLocaleDateString() : parseDate(dataset.issued)?.toLocaleDateString()}
              </Badge>
              {[... new Set(dataset.distributions
                ?.map((keyword) => keyword.format?.label)
                .filter((format) => format))]
                .map((format) => (
                  <Badge variant={"outline"}>{format}</Badge>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}