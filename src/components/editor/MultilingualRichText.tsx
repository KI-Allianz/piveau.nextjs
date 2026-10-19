"use client";

import { Controller, useFormContext } from "react-hook-form";

import {
  editorLanguageLabels,
  editorLanguages,
} from "@/lib/editor/schema";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { RichTextEditor } from "./RichTextEditor";

interface MultilingualRichTextProps {
  namePrefix: string;
  label: string;
  description?: string;
  placeholder?: string;
}

export function MultilingualRichText({
  namePrefix,
  label,
  description,
  placeholder,
}: MultilingualRichTextProps) {
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
                  <RichTextEditor
                    id={`${namePrefix}-${lang}`}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    invalid={fieldState.invalid}
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
