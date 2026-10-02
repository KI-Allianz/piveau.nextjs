import {
  datasetFormSchema,
  editorMetadataRegistry,
  DatasetFormValues,
} from "./DatasetFormSchema";

export function buildJsonLd(values: DatasetFormValues) {
  const shape = datasetFormSchema.shape;
  const graphProperties: Record<string, any> = {};

  // Loop through all keys present in the form values
  for (const key of Object.keys(values) as Array<keyof DatasetFormValues>) {
    const fieldSchema = shape[key];
    if (!fieldSchema) continue;

    const meta = editorMetadataRegistry.get(fieldSchema);
    if (!meta || !meta.rdfProperty) continue;

    console.log(`Processing field: ${key}, RDF Property: ${meta.rdfProperty}`);

    const value = values[key];
    if (
      value === undefined ||
      value === "" ||
      (typeof value === "object" && Object.keys(value).length === 0)
    ) {
      continue; // Skip empty fields
    }

    if (meta.component === "multilingual-input" && typeof value === "object") {
      const localizedEntries = Object.entries(value)
        .filter(([_, val]) => Boolean(val))
        .map(([lang, val]) => ({
          "@language": lang,
          "@value": val,
        }));

      if (localizedEntries.length > 0) {
        graphProperties[meta.rdfProperty] = localizedEntries;
      }
    } else {
      graphProperties[meta.rdfProperty] = value;
    }
  }

  return {
    "@context": {
      schema: "https://schema.org/",
      dcatap: "http://data.europa.eu/r5r/",
      dct: "http://purl.org/dc/terms/",
      rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      owl: "http://www.w3.org/2002/07/owl#",
      skos: "http://www.w3.org/2004/02/skos/core#",
      rdfs: "http://www.w3.org/2000/01/rdf-schema#",
      dcat: "http://www.w3.org/ns/dcat#",
      foaf: "http://xmlns.com/foaf/0.1/",
    },
    "@type": "dcat:Dataset",
    ...graphProperties,
  };
}
