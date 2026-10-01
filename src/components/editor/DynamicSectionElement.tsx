"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import {
  datasetFormSchema,
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
import { CheckCircle2, AlertCircle } from "lucide-react"; // Icons for check/error

export function DynamicSectionElement({
  sectionKey,
}: {
  sectionKey: keyof typeof formSections;
}) {
  const { control, trigger } = useFormContext();
  const section = formSections[sectionKey];

  const [hasValidated, setHasValidated] = React.useState(false);
  const [hasErrors, setHasErrors] = React.useState(false);

  const validateSection = async () => {
    // validated only the fields in this section
    const isValid = await trigger(section.keys as any);
    setHasValidated(true);
    setHasErrors(!isValid);
  };

  return (
    <AccordionItem value={sectionKey}>
      <AccordionTrigger
        onClick={() => {
          validateSection();
        }}
      >
        <div className="flex items-center justify-between w-full pr-4">
          <div>
            <h2 className="text-lg font-semibold">{section.title}</h2>
            <p className="text-sm text-muted-foreground">
              {section.description}
            </p>
          </div>

          {hasValidated && (
            <div className="flex items-center hover:no-underline!">
              {hasErrors ? (
                <span className="flex items-center text-destructive text-sm gap-1 font-medium">
                  <AlertCircle className="w-4 h-4" />
                  Needs attention
                </span>
              ) : (
                <span className="flex items-center text-emerald-600 text-sm gap-1 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Complete
                </span>
              )}
            </div>
          )}
        </div>
      </AccordionTrigger>

      <AccordionContent>
        <div className="space-y-6 pt-2">
          {section.keys.map((key) => {
            const meta = editorMetadataRegistry.get(
              datasetFormSchema.shape[key],
            );

            if (!meta) return null;

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
