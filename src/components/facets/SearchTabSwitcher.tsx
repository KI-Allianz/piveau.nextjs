import {useSearchParams} from "next/navigation";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import { useLocale } from "@/hooks/useLocale";

export enum SearchTab {
  DATASETS = "datasets",
  DATA_SERVICES = "dataServices",
  MODELS = "models"
}


export default function SearchTabSwitcher() {
  const searchParams = useSearchParams();
  const { translations } = useLocale();

  const currentTab = (params: any) => {
    const tab = params.get("tab");
    switch (tab) {
      case "dataServices":
        return SearchTab.DATA_SERVICES;
      case "models":
        return SearchTab.MODELS;
      default:
        return SearchTab.DATASETS; // Default to datasets if no tab is specified
    }
  }

  return (
    <Tabs
      defaultValue={currentTab(searchParams)}
      className=""
      onValueChange={(value) => {
        const params = new URLSearchParams(window.location.search);
        const current = currentTab(params);

        if (current !== value) {
          if (value === SearchTab.DATASETS) {
            params.delete("tab");
          } else {
            params.set("tab", value);
          }

          window.history.replaceState({}, "", `?${params.toString()}`);
        }
      }}
    >
      <TabsList>
        <TabsTrigger value={SearchTab.DATASETS}>{translations.search.tabs.datasets}</TabsTrigger>
        <TabsTrigger value={SearchTab.DATA_SERVICES}>{translations.search.tabs.dataServices}</TabsTrigger>
        <TabsTrigger value={SearchTab.MODELS}>{translations.search.tabs.aiModels}</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}