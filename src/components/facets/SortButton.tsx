import {useSearchParams} from "next/navigation";
import {
  Menubar, MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {ArrowUpDown} from "lucide-react";

export enum SortMode {
  LAST_MODIFIED = "modified+desc, relevance+desc, title.en+asc",
  RELEVANCE = "relevance+desc, modified+desc, title.en+asc",
  NAME_ASC = "title.en+asc, relevance+desc, modified+desc",
  NAME_DESC = "title.en+desc, relevance+desc, modified+desc",
  LAST_ISSUED = "issued+desc, relevance+desc, title.en+asc",
}
const sortModeNames: Record<SortMode, string> = {
  [SortMode.LAST_MODIFIED]: "Last Modified",
  [SortMode.RELEVANCE]: "Relevance",
  [SortMode.NAME_ASC]: "Name Ascending",
  [SortMode.NAME_DESC]: "Name Descending",
  [SortMode.LAST_ISSUED]: "Last Issued",
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

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>
          <ArrowUpDown size={15} />
        </MenubarTrigger>
        <MenubarContent>
          {Object.values(SortMode).map((mode) => (
            <MenubarCheckboxItem
              checked={currentMode(searchParams) === mode}
            >
              <MenubarItem
                onClick={() => onChange(mode)}
              >
                {sortModeNames[mode]}
              </MenubarItem>
            </MenubarCheckboxItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}