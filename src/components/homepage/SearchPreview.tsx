"use client";

import { useLocale } from "@/hooks/useLocale";
import { Input } from "../ui/input";
import { useState } from "react";

export const SearchPreview = () => {
  const { translations, locale } = useLocale();
  const [query, setQuery] = useState("");

  return (
    <form action={`/${locale}/dataset/`} className="w-full">
      <Input
        placeholder={translations.search.placeholder.datasets}
        className="w-full placeholder:text-xl bg-card p-8 rounded-lg shadow text-xl!"
        role={"search"}
        name={"q"}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
};
