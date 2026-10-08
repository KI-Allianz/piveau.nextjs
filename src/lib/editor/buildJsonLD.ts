import { ZodObject, ZodType } from "zod";
import {
  datasetFormSchema,
  editorMetadataRegistry,
  DatasetFormValues,
  temporalRegex,
} from "./DatasetFormSchema";

export function buildPiveauJsonLd(schema: ZodType, value: any): any {
  if (value === undefined || value === null || value === "") return undefined;

  const meta = editorMetadataRegistry.get(schema);
  if (!meta) return value;

  if (meta.component === "multilingual-input" && typeof value === "object") {
    const localizedEntries = Object.entries(value)
      .filter(([_, val]) => Boolean(val))
      .map(([lang, val]) => ({
        "@language": lang,
        "@value": val,
      }));

    return localizedEntries.length > 0 ? localizedEntries : undefined;
  } else if (meta.component === "temporal" && typeof value === "string") {
    let xsdType = "http://www.w3.org/2001/XMLSchema#date"; // default fallback

    if (temporalRegex.dateTime.test(value)) {
      xsdType = "http://www.w3.org/2001/XMLSchema#dateTime";
    } else if (temporalRegex.date.test(value)) {
      xsdType = "http://www.w3.org/2001/XMLSchema#date";
    } else if (temporalRegex.gYearMonth.test(value)) {
      xsdType = "http://www.w3.org/2001/XMLSchema#gYearMonth";
    } else if (temporalRegex.gYear.test(value)) {
      xsdType = "http://www.w3.org/2001/XMLSchema#gYear";
    }

    return {
      "@value": value,
      "@type": xsdType,
    };
  } else if (meta.component === "object") {
    if (!(schema instanceof ZodObject)) {
      console.error(`Expected ZodObject but got`, schema);
      return null;
    }
    const innerShape = schema.shape;
    const graphProperties: Record<string, any> = {};

    if (meta.rdfType) {
      graphProperties["@type"] = meta.rdfType;
    }

    for (const [subKey, subSchema] of Object.entries(innerShape)) {
      const subMeta = editorMetadataRegistry.get(subSchema as ZodType);
      if (!subMeta || !subMeta.rdfProperty) continue;

      const subValue = value[subKey];
      const serializedSubValue = buildPiveauJsonLd(
        subSchema as ZodType,
        subValue,
      );

      if (serializedSubValue !== undefined) {
        graphProperties[subMeta.rdfProperty] = serializedSubValue;
      }
    }

    return Object.keys(graphProperties).length > 0
      ? graphProperties
      : undefined;
  }

  return value;
}

export function generateDatasetJsonLd(formValues: DatasetFormValues) {
  const shape = datasetFormSchema.shape;
  const graphProperties: Record<string, any> = {};

  for (const [key, fieldSchema] of Object.entries(shape)) {
    const meta = editorMetadataRegistry.get(fieldSchema);
    if (!meta || !meta.rdfProperty) continue;

    const val = formValues[key as keyof DatasetFormValues];
    const serialized = buildPiveauJsonLd(fieldSchema, val);

    if (serialized !== undefined) {
      graphProperties[meta.rdfProperty] = serialized;
    }
  }

  return {
    "@context": {
      dct: "http://purl.org/dc/terms/",
      dcat: "http://www.w3.org/ns/dcat#",
      vcard: "http://www.w3.org/2006/vcard/ns#",
    },
    "@type": "dcat:Dataset",
    ...graphProperties,
  };
}
