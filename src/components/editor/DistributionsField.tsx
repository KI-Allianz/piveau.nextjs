"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus } from "lucide-react";
import { ZodType } from "zod";

import { Button } from "@/components/ui/button";
import {
  DatasetFormValues,
  distributionFormDefaults,
} from "@/lib/editor/DatasetFormSchema";

import { DistributionFormCard } from "./DistributionFormCard";

interface DistributionsFieldProps {
  name: string;
  elementSchema: ZodType;
}

export function DistributionsField({
  name,
  elementSchema,
}: DistributionsFieldProps) {
  const { control } = useFormContext<DatasetFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as any,
  });

  return (
    <div className="space-y-4">
      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground">No distributions yet.</p>
      )}

      {fields.map((field, index) => (
        <DistributionFormCard
          key={field.id}
          name={`${name}.${index}`}
          elementSchema={elementSchema}
          index={index}
          onRemove={() => remove(index)}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ ...distributionFormDefaults } as any)}
      >
        <Plus className="size-4" />
        Add distribution
      </Button>
    </div>
  );
}
