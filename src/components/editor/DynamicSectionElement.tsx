"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import {
  datasetFormDefaults,
  datasetFormSchema,
  DatasetFormValues,
  editorMetadataRegistry,
  formSections,
} from "@/lib/editor/DatasetFormSchema";
import { MultilingualInput } from "@/components/editor/MultilingualInput";
import { Controller } from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export function DynamicSectionElement({
  sectionKey,
}: {
  sectionKey: keyof typeof formSections;
}) {
  const { control } = useFormContext();

  const section = formSections[sectionKey];

  return (
    <AccordionItem value={sectionKey}>
      <AccordionTrigger>
        <div>
          <h2 className="text-lg font-semibold">{section.title}</h2>
          <p className="text-sm text-muted-foreground">{section.description}</p>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-6">
          {section.keys.map((key) => {
            const meta = editorMetadataRegistry.get(
              datasetFormSchema.shape[key],
            );

            if (!meta) return null;

            // Render dynamically based on the component type specified in metadata
            switch (meta.component) {
              case "multilingual-input":
                return (
                  <MultilingualInput
                    languages={["en", "de"]}
                    languageLabels={{ en: "English", de: "German" }}
                    key={key}
                    namePrefix={key}
                    label={meta.label}
                    description={meta.description}
                    placeholder={meta.placeholder}
                  />
                );

              case "input":
              default:
                return (
                  <Controller
                    key={key}
                    name={key as any}
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>{meta.label}</FieldLabel>
                        {meta.description && (
                          <FieldDescription>
                            {meta.description}
                          </FieldDescription>
                        )}
                        <Input {...field} aria-invalid={fieldState.invalid} />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                );
            }
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
