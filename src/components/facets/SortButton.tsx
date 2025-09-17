"use client"

import {useSearchParams} from "next/navigation";
import {
  Menubar, MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {ArrowDownWideNarrow, ArrowUpNarrowWide} from "lucide-react";
import {useLocale} from "@/hooks/useLocale";
import {SortMode, sortModeTypes} from "@/lib/utils";

export default function SortButton() {
  const searchParams = useSearchParams();
  const { translations } = useLocale();

  const currentMode = (params: any) => {
    const mode = params.get("sort");
    if (!mode) {
      return SortMode.RELEVANCE;
    }

    for (const sortMode of Object.values(SortMode)) {
      if (mode === sortMode) {
        console.log(`Found matching sort mode: ${sortMode}`);
        return sortMode;
      }
    }

    return SortMode.RELEVANCE;
  }

  const onChange = (value: SortMode) => {
    const params = new URLSearchParams(window.location.search);
    const current = currentMode(params);

    if (current !== value) {
      if (value === SortMode.RELEVANCE) {
        params.delete("sort");
      } else {
        params.set("sort", value);
      }

      window.history.replaceState({}, "", `?${params.toString()}`);
    }
  }

  const buildSortButtonTrigger = (mode: SortMode) => {
    const sortModeType = sortModeTypes[mode];
    return (
      <span className="flex items-center gap-2">
        {translations.search.sort[mode] }
        {sortModeType === "asc" ? (
          <ArrowUpNarrowWide className="h-4 w-4 text-muted-foreground" />
          ) : (
          <ArrowDownWideNarrow className="h-4 w-4 text-muted-foreground" />
        )}
      </span>
    )
  }

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>
          {buildSortButtonTrigger(currentMode(searchParams))}
        </MenubarTrigger>
        <MenubarContent>
          {Object.values(SortMode).map((mode) => (
            <MenubarCheckboxItem
              checked={currentMode(searchParams) === mode}
            >
              <MenubarItem
                onClick={() => onChange(mode)}
              >
                {translations.search.sort[mode]}
              </MenubarItem>
            </MenubarCheckboxItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}