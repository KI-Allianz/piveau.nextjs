import {useSearchParams} from "next/navigation";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";


export default function SearchTabSwitcher() {
  const searchParams = useSearchParams();

  const currentTab = (params: any) => {
    const tab = params.get("tab");
    if (tab === "dataServices") {
      return "dataServices";
    }
    return "datasets";
  }

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