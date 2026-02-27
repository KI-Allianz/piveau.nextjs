import Link from "next/link";

import { useLocale } from "@/hooks/useLocale";

import HtmlSnippet from "@/components/HTMLSnippet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DateBadge from "../dataset/DateBadge";
import { Catalog } from "@piveau/sdk-core";
import { fixThemeUrl } from "@/hooks/useTheme";

interface Props {
  catalog: Catalog;
}

export default function CatalogCard({ catalog }: Props) {
  const { translateDict, locale, theme } = useLocale();

  return (
    <Link
      href={fixThemeUrl(`/${locale}/catalogues/${catalog.id}`, theme)}
      className="w-full"
    >
      <Card className="w-full hover:border-primary hover:bg-card/60 transition-all duration-200 cursor-pointer gap-3">
        <CardHeader className="flex justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="flex-1">
              <h2 className="text-2xl text-wrap">
                {translateDict(catalog.title)}
              </h2>
            </CardTitle>

            <Badge variant={"default"} className="">
              {catalog["count"]}
            </Badge>
          </div>
          <div className="flex gap-2 items-center justify-between">
            <div onClick={(e) => e.preventDefault()}></div>
            <div className="flex gap-2 items-center">
              <DateBadge modified={catalog.modified} issued={catalog.issued} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <CardDescription className="flex-2/3 snippet">
              <HtmlSnippet
                html={
                  translateDict(catalog.description).slice(0, 205) +
                  (translateDict(catalog.description).length > 205 ? "..." : "")
                }
              />
            </CardDescription>
            {catalog.language && (
              <div className="flex flex-wrap gap-2 flex-1/3">
                {catalog.language?.map((language) => (
                  <Badge variant={"secondary"}>{language.label}</Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
