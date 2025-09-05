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

export enum SortMode {
  LAST_MODIFIED = "modified+desc, relevance+desc, title.en+asc",
  RELEVANCE = "relevance+desc, modified+desc, title.en+asc",
  NAME_ASC = "title.en+asc, relevance+desc, modified+desc",
  NAME_DESC = "title.en+desc, relevance+desc, modified+desc",
  LAST_ISSUED = "issued+desc, relevance+desc, title.en+asc",
}
const sortModes = {
  [SortMode.LAST_MODIFIED]: {
    label: "Last Modified",
    type: "desc"
  },
  [SortMode.RELEVANCE]: {
    label: "Relevance",
    type: "desc"
  },
  [SortMode.NAME_ASC]: {
    label: "Name Ascending",
    type: "asc"
  },
  [SortMode.NAME_DESC]: {
    label: "Name Descending",
    type: "desc"
  },
  [SortMode.LAST_ISSUED]: {
    label: "Last Issued",
    type: "desc"
  },
}


export default function SortButton() {
  const searchParams = useSearchParams();

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
    const sortMode = sortModes[mode];
    return (
      <span className="flex items-center gap-2">
        {sortMode.label}
        {sortMode.type === "asc" ? (
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
                {sortModes[mode].label}
              </MenubarItem>
            </MenubarCheckboxItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}