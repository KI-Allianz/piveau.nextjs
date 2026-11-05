import { ZodType } from "zod";

import {
  DatasetFormValues,
  datasetFormSchema,
  editorLanguageLabels,
  editorMetadataRegistry,
  formSections,
  getArrayElementSchema,
  getUnwrappedObjectSchema,
} from "./schema";

export interface FormErrorItem {
  path: string;
  sectionKey: string | null;
  sectionTitle: string;
  label: string;
  message: string;
}

interface FlatFormError {
  path: string[];
  message: string;
}

function flattenErrors(error: unknown, path: string[] = []): FlatFormError[] {
  if (!error || typeof error !== "object") return [];

  const record = error as Record<string, unknown>;

  if (typeof record.message === "string") {
    return [{ path, message: record.message }];
  }

  return Object.entries(record).flatMap(([key, value]) => {
    if (key === "ref" || key === "type" || key === "types") return [];
    return flattenErrors(value, [...path, key]);
  });
}

function resolveFieldLabel(path: string[]): string {
  let schema: ZodType = datasetFormSchema;
  const labels: string[] = [];

  for (const segment of path) {
    if (/^\d+$/.test(segment)) {
      const elementSchema = getArrayElementSchema(schema);
      if (!elementSchema) break;
      schema = elementSchema;
      continue;
    }

    const objectSchema = getUnwrappedObjectSchema(schema);
    if (!objectSchema) break;

    const nextSchema = objectSchema.shape[segment];
    if (!nextSchema) break;

    const meta = editorMetadataRegistry.get(nextSchema);
    if (meta?.label) {
      labels.push(meta.label);
    } else if (editorLanguageLabels[segment]) {
      labels.push(editorLanguageLabels[segment]);
    }

    schema = nextSchema;
  }

  return labels.length > 0 ? labels.join(" → ") : path.join(".");
}

/**
 * Flattens nested react-hook-form errors into readable entries for the summary
 * shown next to the submit actions.
 */
export function collectFormErrors(
  errors: Partial<Record<keyof DatasetFormValues, unknown>>,
): FormErrorItem[] {
  const sectionOrder = new Map(
    Object.keys(formSections).map((key, index) => [key, index]),
  );

  const seen = new Set<string>();
  const items: FormErrorItem[] = [];

  for (const error of flattenErrors(errors)) {
    const [rootKey] = error.path;
    const sectionEntry = Object.entries(formSections).find(([, section]) =>
      (section.keys as string[]).includes(rootKey),
    );

    const dedupeKey = `${error.path.join(".")}::${error.message}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    items.push({
      path: error.path.join("."),
      sectionKey: sectionEntry?.[0] ?? null,
      sectionTitle: sectionEntry?.[1].title ?? "General",
      label: resolveFieldLabel(error.path),
      message: error.message,
    });
  }

  return items.sort((a, b) => {
    const aOrder = a.sectionKey ? (sectionOrder.get(a.sectionKey) ?? 0) : -1;
    const bOrder = b.sectionKey ? (sectionOrder.get(b.sectionKey) ?? 0) : -1;
    return aOrder - bOrder;
  });
}
