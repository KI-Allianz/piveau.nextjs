import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Badge} from "@/components/ui/badge";


export default function SearchTabSwitcher() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const currentTab = (params: any) => {
    const tab = searchParams.get("tab");
    if (tab === "dataServices") {
      return "dataServices";
    }
    return "datasets";
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.get("q") !== query) {
        if (query) {
          params.set("q", query);
        } else {
          params.delete("q");
        }
        window.history.replaceState({}, "", `?${params.toString()}`);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchParams]);

  return (
    <Tabs
      defaultValue={currentTab(searchParams)}
      className=""
      onValueChange={(value) => {
        const params = new URLSearchParams(window.location.search);
        const current = currentTab(params);

        if (current !== value) {
          if (value === "datasets") {
            params.delete("tab");
          } else {
            params.set("tab", value);
          }

          window.history.replaceState({}, "", `?${params.toString()}`);
        }
      }}
    >
      <TabsList>
        <TabsTrigger value="datasets">Datasets</TabsTrigger>
        <TabsTrigger value="dataServices">
          Data Services
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}