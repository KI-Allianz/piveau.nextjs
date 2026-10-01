"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // Assuming standard shadcn tabs

interface MultilingualInputProps {
  languages?: string[]; // e.g. ["en", "de"]
  languageLabels?: Record<string, string>; // e.g. { en: "English", de: "German" }
  namePrefix: string; // e.g. "title" or "description"
  label: string;
  description?: string;
  placeholder?: string;
}

export function MultilingualInput({
  languages,
  languageLabels,
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

      <Tabs defaultValue="en" className="w-full">
        <TabsList className="grid w-fit grid-cols-2">
          {languages?.map((lang) => (
            <TabsTrigger key={lang} value={lang}>
              {languageLabels?.[lang] || lang.toUpperCase()}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="en">
          <Controller
            name={`${namePrefix}.en`}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  id={`${namePrefix}-en`}
                  aria-invalid={fieldState.invalid}
                  placeholder={`${placeholder} (EN)`}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </TabsContent>

        <TabsContent value="de">
          <Controller
            name={`${namePrefix}.de`}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  id={`${namePrefix}-de`}
                  aria-invalid={fieldState.invalid}
                  placeholder={`${placeholder} (DE)`}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
