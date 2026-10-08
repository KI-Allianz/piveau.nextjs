"use client";

import {
  DatasetFormValues,
  editorMetadataRegistry,
} from "@/lib/editor/DatasetFormSchema";
import { MultilingualInput } from "@/components/editor/MultilingualInput";
import { Controller, useFormContext } from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { TemporalInput } from "./TemporalInput";
import { ZodObject, ZodType } from "zod";

interface DynamicFieldProps {
  name: string;
  schema: ZodType;
  prefix?: string;
}

export default function DynamicField({
  name,
  schema,
  prefix = "",
}: DynamicFieldProps) {
  const { control } = useFormContext();

  const meta = editorMetadataRegistry.get(schema);

  if (!meta) return null;

  switch (meta.component) {
    case "multilingual-input":
      return (
        <MultilingualInput
          key={name}
          namePrefix={`${prefix}.${name}`}
          label={meta.label}
          description={meta.description}
          placeholder={meta.placeholder}
        />
      );
    case "temporal":
      return (
        <Controller
          key={name}
          name={`${prefix}.${name}`}
          control={control}
          render={({ field, fieldState }) => (
            <TemporalInput
              label={meta.label}
              description={meta.description}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error}
            />
          )}
        />
      );
    case "object": {
      if (!(schema instanceof ZodObject)) {
        console.error(`Expected ZodObject for field ${name}, but got`, schema);
        return null;
      }
      const innerShape = schema.shape;

      return (
        <div key={name} className="p-4 border rounded-xl bg-muted/10">
          <div>
            <h3 className="font-semibold text-base">{meta.label}</h3>
            {meta.description && (
              <p className="text-xs text-muted-foreground">
                {meta.description}
              </p>
            )}
          </div>
          <div className="space-y-6 pl-4 border-l-2 border-primary/20 mt-2">
            {Object.keys(innerShape).map((innerKey) => (
              <DynamicField
                key={innerKey}
                name={`${innerKey}` as keyof DatasetFormValues}
                schema={innerShape[innerKey]}
                prefix={`${prefix}.${name}`}
              />
            ))}
          </div>
        </div>
      );
    }

    case "input":
    default:
      return (
        <Controller
          key={name}
          name={`${prefix}.${name}`}
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>{meta.label}</FieldLabel>
              {meta.description && (
                <FieldDescription>{meta.description}</FieldDescription>
              )}
              <Input {...field} aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      );
  }
}
