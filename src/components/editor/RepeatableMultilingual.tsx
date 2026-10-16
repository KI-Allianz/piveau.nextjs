"use client";

import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  editorLanguageLabels,
  editorLanguages,
} from "@/lib/editor/DatasetFormSchema";

interface RepeatableMultilingualProps {
  value?: Record<string, string>[];
  onChange: (value: Record<string, string>[]) => void;
  label: string;
  description?: string;
  placeholder?: string;
  error?: unknown;
}

/**
 * Repeatable list of multilingual strings, e.g. keywords. Each entry exposes
 * one language at a time via inline tabs (like `MultilingualInput`).
 */
export function RepeatableMultilingual({
  value,
  onChange,
  label,
  description,
  placeholder,
  error,
}: RepeatableMultilingualProps) {
  const items = value ?? [];

  const updateItem = (index: number, lang: string, itemValue: string) => {
    onChange(
      items.map((item, i) =>
        i === index ? { ...item, [lang]: itemValue } : item,
      ),
    );
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const addItem = () => {
    onChange([...items, {}]);
  };

  return (
    <Field data-invalid={!!error}>
      <FieldLabel>{label}</FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}

      <div className="mt-1 space-y-2">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">No entries yet.</p>
        )}

        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Tabs
              defaultValue={editorLanguages[0]}
              className="flex flex-1 flex-row items-center gap-2"
            >
              <TabsList className="shrink-0">
                {editorLanguages.map((lang) => (
                  <TabsTrigger key={lang} value={lang}>
                    {editorLanguageLabels[lang] ?? lang.toUpperCase()}
                  </TabsTrigger>
                ))}
              </TabsList>

              {editorLanguages.map((lang) => (
                <TabsContent key={lang} value={lang} className="mt-0">
                  <Input
                    value={item[lang] ?? ""}
                    placeholder={`${placeholder ?? ""} (${editorLanguageLabels[lang] ?? lang.toUpperCase()})`}
                    onChange={(event) =>
                      updateItem(index, lang, event.target.value)
                    }
                  />
                </TabsContent>
              ))}
            </Tabs>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Remove entry"
              onClick={() => removeItem(index)}
            >
              <X className="size-4" />
            </Button>
          </div>
        ))}

        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <Plus className="size-4" />
          Add
        </Button>
      </div>

      {error ? <FieldError errors={[error as any]} /> : null}
    </Field>
  );
}
