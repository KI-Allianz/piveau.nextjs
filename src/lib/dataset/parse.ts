import * as jsonld from 'jsonld';
import { NodeObject } from 'jsonld';
import {z} from "zod";

interface DCATRoot {
  "@graph": DCATModel[];
  "@context": any;
}

interface DCATModel {
  "@id": string;
  "@type": string | string[] | undefined;
  [key: string]: DCATEntry | DCATEntry[] | DCATModel[] | string | string[] | undefined;
}

interface DCATEntry {
  "value"?: string | string[] | DCATEntry[] | DCATModel | DCATModel[];
  "@id"?: string;
  "@type"?: string | string[];
  [key: string]: any;
}

const LocalizedStringSchema = z.record(z.string(), z.string())
const RawDatasetScheme = z.object({
  creator: z.object({
    name: z.string(),
    // TODO: homepage
  }),
  description: LocalizedStringSchema,
  id: z.string(),
  title: LocalizedStringSchema,
  // TODO: issued
  // TODO: modified
  language: z.object({
    prefLabel: LocalizedStringSchema
  }),
  provenance: z.object({
    label: LocalizedStringSchema
  }),
  publisher: z.object({
    name: LocalizedStringSchema,
    // TODO: homepage
  }),
  spatial: z.object({
    prefLabel: LocalizedStringSchema
  }),
  contact: z.object({
    fullName: z.string(),
    // TODO: hasEmail, hasTelephone, hasURL
  }),
  distribution: z.object({
    description: LocalizedStringSchema,
    format: z.object({
      label: LocalizedStringSchema,
      note: LocalizedStringSchema,
    }),
    id: z.string(),
    title: LocalizedStringSchema,
    // TODO: issued
    // TODO: modified
    license: z.object({
      prefLabel: LocalizedStringSchema
    }),
    // TODO: accessURL, byteSize
  }),
  keyword: LocalizedStringSchema,
  // TODO: landingPage,
  theme: z.object({
    prefLabel: LocalizedStringSchema,
  }),
  page: z.object({
    description: LocalizedStringSchema,
    title: LocalizedStringSchema,
    label: LocalizedStringSchema,
  }),
  interactionStatistic: z.array(
    z.object({
      uiLabel: LocalizedStringSchema,
      // TODO: userInteractionCount,
    })
  )
})


export async function parseRawDCAT(data: DCATRoot) {


  const framed = await jsonld.frame(data, {
    "@context": {
      "@vocab": "http://purl.org/dc/terms/",
      //"dct": "http://purl.org/dc/terms/",
      dt: "http://www.w3.org/ns/dcat#",
      dp: "http://dcat-ap.de/def/dcatde/",
      rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      f: "http://xmlns.com/foaf/0.1/",
      vc: "http://www.w3.org/2006/vcard/ns#",
      skos: "http://www.w3.org/2004/02/skos/core#",
      rdfs: "http://www.w3.org/2000/01/rdf-schema#",
      xml: "http://www.w3.org/2001/XMLSchema#",
      s: "https://schema.org/",

      id: "identifier",
      distribution: "dt:distribution",

      label: "rdfs:label",
      uiLabel: "s:name",
      prefLabel: "skos:prefLabel",
      note: "skos:note",
      name: "f:name",
      fullName: "vc:fn",
      contact: "dt:contactPoint",
      accessURL: "dt:accessURL",
      keyword: "dt:keyword",
      landingPage: "dt:landingPage",
      theme: "dt:theme",

      interactionStatistic: "s:interactionStatistic",
      interactionType: "s:interactionType",
      userInteractionCount: "s:userInteractionCount",
      page: "f:page"
    },
    "@type": "dt:Dataset",
    creator: {
      "@embed": "@always"
    },
    temporal: {
      "@embed": "@always"
    },
    distribution: {
      "@embed": "@always"
    }
  });
  // console.log("Framed DCAT:", JSON.stringify(framed, null, 2));

  return framed
}

export function parseIntoDataset(schema: NodeObject) {
  schema = fixLanguages(schema);
  console.log("Fixed DCAT:", JSON.stringify(schema, null, 2));
  const parsed = RawDatasetScheme.parse(schema);

  console.log("Parsed DCAT:", JSON.stringify(parsed, null, 2));

  return parsed
}

export function fixLanguages(schema: NodeObject): NodeObject {
  // Iterate over all properties and fix language tags
  for (const key in schema) {
    const value = schema[key];
    if (Array.isArray(value)) {
      let newDict: {[key: string] : string} = {};

      // Transform array of language-tagged values into a dictionary
      for (const item of value) {
        if (typeof item === 'object' && item !== null && '@language' in item && '@value' in item && item['@language'] && typeof item['@language'] === 'string' && item['@value'] && typeof item['@value'] === 'string') {
          newDict[item['@language']] = item['@value'];
        } else if (typeof item === 'object' && item !== null) {
          schema[key] = fixLanguages(schema[key] as NodeObject);
        }
      }

      // Only assign if newDict is not empty
      if (Object.keys(newDict).length > 0) {
        schema[key] = newDict;
      }
    }
    else if (typeof value === 'object' && value !== null) {
      // Recursively fix nested objects
      schema[key] = fixLanguages(value as NodeObject);
    }
  }

  return schema;
}