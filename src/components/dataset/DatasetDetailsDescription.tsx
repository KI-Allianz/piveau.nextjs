"use client";

import { useLocale } from "@/hooks/useLocale";
import HtmlSnippet from "@/components/HTMLSnippet";
import {ExpandableClamp} from "@/components/ExpandableClamp";
import { Dataset } from "@/lib/utils";


interface Props {
  description: Dataset["description"];
}

export default function DatasetDetailsDescription({ description }: Props) {
  const { translateDict } = useLocale();

  return (
    <div className="flex items-center justify-center snippet">
      <ExpandableClamp collapsedHeight={250}>
        <HtmlSnippet
          html={translateDict(description)}
        />
      </ExpandableClamp>

    </div>
  )
}
