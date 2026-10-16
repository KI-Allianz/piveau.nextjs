import { ZodType } from "zod";
import {
  datasetFormSchema,
  editorMetadataRegistry,
  DatasetFormValues,
} from "./schema";
import { serializeField } from "./codecs";
import { PREFIXES } from "./prefixes";

const PIVEAU_DATASET_URI_PREFIX = "https://piveau.io/set/data/";

/**
 * Serializes a single form field (or nested object/array) into JSON-LD.
 */
export function buildPiveauJsonLd(schema: ZodType, value: any): any {
  return serializeField(schema, value, { prefixes: PREFIXES });
}

export function generateDatasetJsonLd(formValues: DatasetFormValues) {
  const shape = datasetFormSchema.shape;
  const graphProperties: Record<string, any> = {};

  for (const [key, fieldSchema] of Object.entries(shape)) {
    const meta = editorMetadataRegistry.get(fieldSchema);
    if (!meta || !meta.rdfProperty) continue;

    const val = formValues[key as keyof DatasetFormValues];
    const serialized = serializeField(fieldSchema, val, { prefixes: PREFIXES });

    if (serialized !== undefined) {
      graphProperties[meta.rdfProperty] =
        meta.rdfProperty === "@id"
          ? PIVEAU_DATASET_URI_PREFIX + serialized
          : serialized;
    }
  }

  return {
    "@context": { ...PREFIXES },
    "@type": ["http://www.w3.org/ns/dcat#Dataset"],
    ...graphProperties,
  };
}
