import { ZodType } from "zod";
import {
  datasetFormSchema,
  editorMetadataRegistry,
  DatasetFormValues,
  getUnwrappedObjectSchema,
} from "./DatasetFormSchema";

/**
 * Recursively parses a JSON-LD value for a given Zod schema field back into form values.
 */
export function parseJsonLdFieldValue(schema: ZodType, jsonLdValue: any): any {
  if (jsonLdValue === undefined || jsonLdValue === null) return undefined;

  const meta = editorMetadataRegistry.get(schema);
  if (!meta) return jsonLdValue;

  if (meta.component === "multilingual-input") {
    const entries = Array.isArray(jsonLdValue) ? jsonLdValue : [jsonLdValue];
    const result: Record<string, string> = {};

    for (const entry of entries) {
      if (entry && typeof entry === "object") {
        const lang = entry["@language"];
        const val = entry["@value"];
        if (lang && typeof val === "string") {
          result[lang] = val;
        }
      } else if (typeof entry === "string") {
        result["en"] = entry;
      }
    }
    return Object.keys(result).length > 0 ? result : undefined;
  }

  if (meta.component === "temporal") {
    if (typeof jsonLdValue === "object" && jsonLdValue !== null) {
      return jsonLdValue["@value"] || "";
    }
    return typeof jsonLdValue === "string" ? jsonLdValue : "";
  }

  if (meta.component === "object") {
    let innerSchema = getUnwrappedObjectSchema(schema);

    if (!innerSchema) {
      console.error(`Expected ZodObject, but got`, schema);
      return null;
    }

    const innerShape = innerSchema.shape;
    const parsedObjectData: Record<string, any> = {};

    for (const [subKey, subSchema] of Object.entries(innerShape)) {
      const subMeta = editorMetadataRegistry.get(subSchema as ZodType);
      if (!subMeta || !subMeta.rdfProperty) continue;

      const rawSubValue = jsonLdValue[subMeta.rdfProperty];

      let targetSubVal = rawSubValue;
      if (
        rawSubValue &&
        typeof rawSubValue === "object" &&
        "@id" in rawSubValue &&
        Object.keys(rawSubValue).length === 1
      ) {
        targetSubVal = rawSubValue["@id"];
      }

      const parsedSubVal = parseJsonLdFieldValue(
        subSchema as ZodType,
        targetSubVal,
      );

      if (parsedSubVal !== undefined) {
        parsedObjectData[subKey] = parsedSubVal;
      }
    }

    return Object.keys(parsedObjectData).length > 0
      ? parsedObjectData
      : undefined;
  }

  if (
    typeof jsonLdValue === "object" &&
    jsonLdValue !== null &&
    "@id" in jsonLdValue
  ) {
    return jsonLdValue["@id"];
  }

  return jsonLdValue;
}

/**
 * Parses an entire Piveau JSON-LD document into initial DatasetFormValues
 */
export function parseDatasetJsonLd(
  jsonLdData: Record<string, any>,
): Partial<DatasetFormValues> {
  const shape = datasetFormSchema.shape;
  const formValues: Record<string, any> = {};

  for (const [key, fieldSchema] of Object.entries(shape)) {
    const meta = editorMetadataRegistry.get(fieldSchema);
    if (!meta || !meta.rdfProperty) continue;

    const rawValue = jsonLdData[meta.rdfProperty];
    let parsedValue = parseJsonLdFieldValue(fieldSchema, rawValue);

    if (parsedValue !== undefined) {
      if (meta.rdfProperty == "@id") {
        parsedValue = parsedValue.replace("https://piveau.io/set/data/", "");
      }
      formValues[key] = parsedValue;
    }
  }

  return formValues;
}
