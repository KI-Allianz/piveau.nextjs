import { Archive } from "lucide-react";
import Link from "next/link";
import { Dataset } from "@piveau/sdk-core";

import { useLocale } from "@/hooks/useLocale";
import { fixThemeUrl } from "@/hooks/useTheme";

interface Props {
  catalog: Dataset["catalog"];
}

export default function CatalogBadge({ catalog }: Props) {
  const { locale, translateDict, theme } = useLocale();

  return (
    <Link
      href={fixThemeUrl(`/${locale}/catalogues/${catalog.id}`, theme)}
      className="w-fit min-w-fit flex items-center gap-2 group font-bold transition-all duration-200 hover:bg-secondary cursor-pointer rounded-lg p-1"
    >
      <div className="bg-(--main-accent) text-white p-1.5 rounded-xl w-fit group-hover:bg-(--main-accent)/80 transition-all duration-200">
        <Archive size={18} />
      </div>
      <span className="line-clamp-1">{translateDict(catalog.title)}</span>
    </Link>
  );
}
