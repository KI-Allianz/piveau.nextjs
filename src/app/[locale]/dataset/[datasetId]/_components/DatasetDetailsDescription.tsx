"use client";

import { useLocale } from "@/hooks/useLocale";
import HtmlSnippet from "@/components/HTMLSnippet";


interface Props {
  description: Record<string, string> | null | undefined;
}

export default function DatasetDetailsDescription({ description }: Props) {
  const { translateDict } = useLocale();

  return (
    <div className="flex items-center justify-center snippet">
      <HtmlSnippet
        html={translateDict(description)}
      />
    </div>
  )
}