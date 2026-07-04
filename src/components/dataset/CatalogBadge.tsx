import { Archive } from "lucide-react";
import Link from "next/link";
import { Dataset } from "@piveau/sdk-core";

import { useLocale } from "@/hooks/useLocale";
import { fixThemeUrl } from "@/hooks/useTheme";

interface Props {
  catalog: Dataset["catalog"];
}

export default function CatalogBadge({ catalog }: Props) {
  const { locale, translateDict, translations, theme } = useLocale();

  return (
    <Link
      href={fixThemeUrl(`/${locale}/catalogues/${catalog.id}`, theme)}
      className="w-fit min-w-fit flex items-center gap-2 group transition-all duration-200 hover:bg-secondary cursor-pointer rounded-lg p-1"
    >
      <div className="bg-(--main-accent) text-white p-1.5 rounded-xl w-fit group-hover:bg-(--main-accent)/80 transition-all duration-200">
        <Archive size={24} />
      </div>
      <div className="flex flex-col">
        <span
          className="text-xs text-muted-foreground"
          style={{ marginBottom: "-1px" }}
        >
          {translations.dataset.providedBy}
        </span>
        <span className="font-bold line-clamp-1">
          {translateDict(catalog.title)}
        </span>
      </div>
    </Link>
  );
}
