import { DatasetFormValues, datasetFormDefaults } from "./dataset";

function isPlainObject(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Builds complete form defaults by merging the static defaults with a parsed
 * draft, deep-merging nested objects (e.g. title, description) so that missing
 * keys fall back to their defaults.
 */
export function buildDatasetFormDefaults(
  draft?: Partial<DatasetFormValues> | null,
): Partial<DatasetFormValues> {
  const merged: Record<string, any> = {
    ...datasetFormDefaults,
    ...(draft ?? {}),
  };

  for (const [key, defaultValue] of Object.entries(datasetFormDefaults)) {
    const draftValue = (draft as Record<string, any> | null | undefined)?.[key];
    if (isPlainObject(defaultValue) && isPlainObject(draftValue)) {
      merged[key] = { ...defaultValue, ...draftValue };
    }
  }

  return merged;
}
