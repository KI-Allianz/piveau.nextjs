"use client";

import { useLocale } from "@/hooks/useLocale";
import HtmlSnippet from "@/components/HTMLSnippet";
import { StandardSchemaV1 } from "@standard-schema/spec";
import { schemaDataset } from "@piveau/sdk-core/model";
import {ExpandableClamp} from "@/components/ExpandableClamp";


interface Props {
  description: StandardSchemaV1.InferOutput<typeof schemaDataset>["description"];
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
