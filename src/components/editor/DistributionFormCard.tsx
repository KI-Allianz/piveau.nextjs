"use client";

import { useFormContext } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { ZodType } from "zod";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DatasetFormValues,
  getUnwrappedObjectSchema,
} from "@/lib/editor/DatasetFormSchema";
import { deleteFile } from "@/lib/repo/uploader/api";

import DynamicField from "./DynamicField";
import { FileUpload } from "./FileUpload";

interface DistributionFormCardProps {
  name: string;
  elementSchema: ZodType;
  index: number;
  onRemove: () => void;
}

export function DistributionFormCard({
  name,
  elementSchema,
  index,
  onRemove,
}: DistributionFormCardProps) {
  const { getValues } = useFormContext<DatasetFormValues>();

  const innerSchema = getUnwrappedObjectSchema(elementSchema);
  if (!innerSchema) {
    return null;
  }
  const innerShape = innerSchema.shape;

  const handleRemove = async () => {
    const datasetId = getValues("id");
    const uploadPath = getValues(`${name}.uploadPath` as any) as
      | string
      | undefined;

    if (datasetId && uploadPath) {
      try {
        await deleteFile(datasetId, uploadPath);
      } catch (error) {
        console.error("Failed to delete uploaded distribution file:", error);
      }
    }

    onRemove();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribution {index + 1}</CardTitle>
        <CardAction>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove distribution"
            onClick={handleRemove}
          >
            <Trash2 className="size-4" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-6">
        <FileUpload namePrefix={name} />

        {Object.keys(innerShape)
          .filter((innerKey) => innerKey !== "uploadPath")
          .map((innerKey) => (
            <DynamicField
              key={innerKey}
              name={innerKey}
              schema={innerShape[innerKey]}
              prefix={name}
            />
          ))}
      </CardContent>
    </Card>
  );
}
