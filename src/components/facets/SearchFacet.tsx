import {Input} from "@/components/ui/input";
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {useLocale} from "@/hooks/useLocale";


export default function SearchFacet() {
  const searchParams = useSearchParams();
  const { translations } = useLocale()
  const [query, setQuery] = useState(searchParams.get("q") || "");

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
    <Input
      placeholder={translations.search.placeholder}
      className="w-full bg-card p-6 rounded-lg shadow"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  )
}