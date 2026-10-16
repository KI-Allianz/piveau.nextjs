"use client";

import { useLocale } from "@/hooks/useLocale";
import { Input } from "../ui/input";
import { useState } from "react";
import { Search } from "lucide-react";

export const SearchPreview = () => {
  const { translations, locale } = useLocale();
  const [query, setQuery] = useState("");

  return (
    <form action={`/${locale}/dataset/`} className="w-full relative">
      <Search
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-muted-foreground"
        size={22}
      />
      <Input
        placeholder={translations.search.placeholder.datasets}
        className="w-full placeholder:text-lg md:placeholder:text-xl bg-card p-6 md:p-8 rounded-lg shadow text-lg! md:text-xl! pl-12 md:pl-15"
        role={"search"}
        name={"q"}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
};
