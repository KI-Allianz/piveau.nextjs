"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { DatasetForm } from "./DatasetForm";
import { DraftList } from "./DraftList";
import { DatasetFormValues } from "@/lib/editor/schema";

export default function DatasetEditor() {
  const searchParams = useSearchParams();
  const [currentDraft, setCurrentDraft] =
    useState<Partial<DatasetFormValues> | null>(null);
  const [draftVersion, setDraftVersion] = useState(0);
  const catalogueId = searchParams.get("catalogueId") ?? "catalog1";

  const handleDraftChange = (draft: Partial<DatasetFormValues> | null) => {
    setCurrentDraft(draft);
    setDraftVersion((version) => version + 1);
  };

  return (
    <div className="">
      <DraftList setCurrentDraft={handleDraftChange} catalogueId={catalogueId} />
      <DatasetForm
        key={draftVersion}
        currentDraft={currentDraft}
        catalogueId={catalogueId}
      />
    </div>
  );
}
