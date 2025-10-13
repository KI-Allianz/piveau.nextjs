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

  const isModel = isAIModel(dataset)
  const date = parseDate(dataset.modified) || parseDate(dataset.issued)
  const age = date ? Math.floor(Math.abs((new Date()).getTime() - date.getTime()) / (1000 * 60 * 60 * 24)) : null

  return (
    <Link href={`/${locale}/${isModel ? "model" : "dataset"}/${dataset.id}`} className="w-full" >
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
                <Badge variant={"outline"} className="bg-amber-100 dark:bg-amber-500 text-amber-800 dark:text-black border-amber-300">
                  {translations.dataset.aiModel}
                </Badge>
              )}
              <Badge variant={"outline"}>
                {date?.toLocaleDateString()}
              </Badge>
              {(parseDate(dataset.modified) || parseDate(dataset.issued)) != null && (
                <Badge variant={"outline"}>
                  {age} {translations.dataset.daysOld}
                </Badge>
              )}
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