"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  datasetFormSchema,
  editorLanguageLabels,
  editorLanguages,
  editorMetadataRegistry,
  formSections,
} from "@/lib/editor/DatasetFormSchema";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // Assuming standard shadcn tabs

interface MultilingualInputProps {
  namePrefix: string; // e.g. "title" or "description"
  label: string;
  description?: string;
  placeholder?: string;
}

export function MultilingualInput({
  namePrefix,
  label,
  description,
  placeholder,
}: MultilingualInputProps) {
  const { control } = useFormContext();

  return (
    <div className="space-y-2">
      <FieldLabel>{label}</FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}

      <Tabs defaultValue={editorLanguages[0]} className="w-full">
        <TabsList className="grid w-fit grid-cols-2">
          {editorLanguages.map((lang) => (
            <TabsTrigger key={lang} value={lang}>
              {editorLanguageLabels[lang] || lang.toUpperCase()}
            </TabsTrigger>
          ))}
        </TabsList>

        {editorLanguages.map((lang) => (
          <TabsContent key={lang} value={lang}>
            <Controller
              name={`${namePrefix}.${lang}`}
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    id={`${namePrefix}-${lang}`}
                    aria-invalid={fieldState.invalid}
                    placeholder={`${placeholder} (${lang.toUpperCase()})`}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
