"use client";

import {
  DatasetFormValues,
  editorMetadataRegistry,
  getUnwrappedObjectSchema,
  getArrayElementSchema,
} from "@/lib/editor/schema";
import { MultilingualInput } from "@/components/editor/MultilingualInput";
import { Controller, useFormContext } from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TemporalInput } from "./TemporalInput";
import { DistributionsField } from "./DistributionsField";
import { ListInput } from "./ListInput";
import { RepeatableObjectField } from "./RepeatableObjectField";
import { RepeatableMultilingual } from "./RepeatableMultilingual";
import { ZodType } from "zod";

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

  const fieldPath = prefix ? `${prefix}.${name}` : name;

  switch (meta.component) {
    case "multilingual-input":
      return (
        <MultilingualInput
          key={name}
          namePrefix={fieldPath}
          label={meta.label}
          description={meta.description}
          placeholder={meta.placeholder}
        />
      );
    case "temporal":
      return (
        <Controller
          key={name}
          name={fieldPath}
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
    case "select":
      return (
        <Controller
          key={name}
          name={fieldPath}
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>{meta.label}</FieldLabel>
              {meta.description && (
                <FieldDescription>{meta.description}</FieldDescription>
              )}
              <Select
                value={field.value ?? ""}
                onValueChange={field.onChange}
              >
                <SelectTrigger aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder={meta.placeholder ?? "Select…"} />
                </SelectTrigger>
                <SelectContent>
                  {meta.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      );
    case "list":
      return (
        <Controller
          key={name}
          name={fieldPath}
          control={control}
          render={({ field, fieldState }) => (
            <ListInput
              label={meta.label}
              description={meta.description}
              placeholder={meta.placeholder}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error}
            />
          )}
        />
      );
    case "repeatable-multilingual":
      return (
        <Controller
          key={name}
          name={fieldPath}
          control={control}
          render={({ field, fieldState }) => (
            <RepeatableMultilingual
              label={meta.label}
              description={meta.description}
              placeholder={meta.placeholder}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error}
            />
          )}
        />
      );
    case "repeatable-object": {
      const elementSchema = getArrayElementSchema(schema);

      if (!elementSchema) {
        console.error(`Expected ZodArray for field ${name}, but got`, schema);
        return null;
      }

      return (
        <RepeatableObjectField
          key={name}
          name={fieldPath}
          elementSchema={elementSchema}
          addLabel={`Add ${meta.label}`}
        />
      );
    }
    case "distributions": {
      const elementSchema = getArrayElementSchema(schema);

      if (!elementSchema) {
        console.error(`Expected ZodArray for field ${name}, but got`, schema);
        return null;
      }

      return (
        <DistributionsField
          key={name}
          name={fieldPath}
          elementSchema={elementSchema}
        />
      );
    }
    case "object": {
      const innerSchema = getUnwrappedObjectSchema(schema);

      if (!innerSchema) {
        console.error(`Expected ZodObject for field ${name}, but got`, schema);
        return null;
      }

      const visibleKeys = Object.keys(innerSchema.shape).filter((innerKey) => {
        const innerMeta = editorMetadataRegistry.get(
          innerSchema.shape[innerKey],
        );
        return Boolean(innerMeta?.rdfProperty);
      });

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
            {visibleKeys.map((innerKey) => (
              <DynamicField
                key={innerKey}
                name={`${innerKey}` as keyof DatasetFormValues}
                schema={innerSchema.shape[innerKey]}
                prefix={fieldPath}
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
          name={fieldPath}
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
