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

interface ListInputProps {
  value?: string[];
  onChange: (value: string[]) => void;
  label: string;
  description?: string;
  placeholder?: string;
  error?: unknown;
}

/**
 * Repeatable list of plain string values (literals or resource IRIs).
 */
export function ListInput({
  value,
  onChange,
  label,
  description,
  placeholder,
  error,
}: ListInputProps) {
  const items = value ?? [];

  const updateItem = (index: number, itemValue: string) => {
    const next = [...items];
    next[index] = itemValue;
    onChange(next);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const addItem = () => {
    onChange([...items, ""]);
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
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              placeholder={placeholder}
              onChange={(event) => updateItem(index, event.target.value)}
            />
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
