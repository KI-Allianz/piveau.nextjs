"use client";

import { useState } from "react";
import { DatasetForm } from "./DatasetForm";
import { DraftList } from "./DraftList";
import { DatasetFormValues } from "@/lib/editor/DatasetFormSchema";

export default function DatasetEditor() {
  const [currentDraft, setCurrentDraft] =
    useState<Partial<DatasetFormValues> | null>(null);

  return (
    <div className="">
      <DraftList
        currentDraft={currentDraft}
        setCurrentDraft={setCurrentDraft}
      />
      <DatasetForm currentDraft={currentDraft} />
    </div>
  );
}
