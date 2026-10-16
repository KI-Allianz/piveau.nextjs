"use client";

import type { ReactNode } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { ZodType } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DatasetFormValues,
  editorMetadataRegistry,
  getUnwrappedObjectSchema,
} from "@/lib/editor/DatasetFormSchema";

import DynamicField from "./DynamicField";

interface RepeatableObjectFieldProps {
  name: string;
  elementSchema: ZodType;
  addLabel?: string;
  defaultItem?: Record<string, any>;
  renderLeading?: (itemName: string, index: number) => ReactNode;
  onRemoveItem?: (index: number) => void | Promise<void>;
}

/**
 * Generic repeatable list of structured objects. Each item renders its own
 * sub-fields via `DynamicField`; internal fields without an `rdfProperty`
 * (e.g. uploadPath) are not shown.
 */
export function RepeatableObjectField({
  name,
  elementSchema,
  addLabel = "Add entry",
  defaultItem,
  renderLeading,
  onRemoveItem,
}: RepeatableObjectFieldProps) {
  const { control } = useFormContext<DatasetFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as any,
  });

  const innerSchema = getUnwrappedObjectSchema(elementSchema);
  if (!innerSchema) {
    console.error(
      `Expected ZodObject for field ${name}, but got`,
      elementSchema,
    );
    return null;
  }

  const meta = editorMetadataRegistry.get(elementSchema);
  const itemLabel = meta?.label ?? "Entry";

  const visibleKeys = Object.keys(innerSchema.shape).filter((key) => {
    const keyMeta = editorMetadataRegistry.get(innerSchema.shape[key]);
    return Boolean(keyMeta?.rdfProperty);
  });

  const handleRemove = async (index: number) => {
    await onRemoveItem?.(index);
    remove(index);
  };

  return (
    <div className="space-y-4">
      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground">No entries yet.</p>
      )}

      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardHeader>
            <CardTitle className="text-base">
              {itemLabel} {index + 1}
            </CardTitle>
            <CardAction>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Remove ${itemLabel}`}
                onClick={() => handleRemove(index)}
              >
                <Trash2 className="size-4" />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderLeading?.(`${name}.${index}`, index)}
            {visibleKeys.map((innerKey) => (
              <DynamicField
                key={innerKey}
                name={innerKey}
                schema={innerSchema.shape[innerKey]}
                prefix={`${name}.${index}`}
              />
            ))}
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append((defaultItem ?? {}) as any)}
      >
        <Plus className="size-4" />
        {addLabel}
      </Button>
    </div>
  );
}
