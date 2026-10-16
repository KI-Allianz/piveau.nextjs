"use client";

import { useFormContext } from "react-hook-form";
import { ZodType } from "zod";

import {
  DatasetFormValues,
  distributionFormDefaults,
} from "@/lib/editor/schema";
import { deleteFile } from "@/lib/repo/uploader/api";

import { FileUpload } from "./FileUpload";
import { RepeatableObjectField } from "./RepeatableObjectField";

interface DistributionsFieldProps {
  name: string;
  elementSchema: ZodType;
}

export function DistributionsField({
  name,
  elementSchema,
}: DistributionsFieldProps) {
  const { getValues } = useFormContext<DatasetFormValues>();

  const handleRemove = async (index: number) => {
    const datasetId = getValues("id");
    const uploadPath = getValues(`${name}.${index}.uploadPath` as any) as
      | string
      | undefined;

    if (datasetId && uploadPath) {
      try {
        await deleteFile(datasetId, uploadPath);
      } catch (error) {
        console.error("Failed to delete uploaded distribution file:", error);
      }
    }
  };

  return (
    <RepeatableObjectField
      name={name}
      elementSchema={elementSchema}
      addLabel="Add distribution"
      defaultItem={distributionFormDefaults}
      renderLeading={(itemName) => <FileUpload namePrefix={itemName} />}
      onRemoveItem={handleRemove}
    />
  );
}
