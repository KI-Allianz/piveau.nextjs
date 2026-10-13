"use client";

import { useState } from "react";
import { DatasetForm } from "./DatasetForm";
import { DraftList } from "./DraftList";
import { DatasetFormValues } from "@/lib/editor/DatasetFormSchema";

export default function DatasetEditor() {
  const [currentDraft, setCurrentDraft] =
    useState<Partial<DatasetFormValues> | null>(null);
  const [draftVersion, setDraftVersion] = useState(0);
  const [catalogueId, setCatalogueId] = useState<string>("catalog1");

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
