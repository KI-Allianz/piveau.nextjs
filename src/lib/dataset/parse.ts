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
const MultipleLocalizedStringSchema = z.record(z.string(), z.array(z.string()))
  .transform((obj) => {
    const languages = Object.keys(obj);
    if (languages.length === 0) return [];

    // Find maximum length (in case languages have uneven arrays)
    const maxLength = Math.max(...languages.map((lang) => obj[lang].length));

    const result: Record<string, string>[] = [];

    for (let i = 0; i < maxLength; i++) {
      const item: Record<string, string> = {};
      for (const lang of languages) {
        const value = obj[lang][i];
        if (value) item[lang] = value;
      }
      result.push(item);
    }

    return result;
  });
const DateStringSchema = z
  .string()
  .refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Invalid date format. Expected ISO 8601 string." }
  )
  .transform((val) => new Date(val));
const IntegerStringSchema = z
  .union([z.string(), z.number()])
  .transform((val) => (typeof val === "string" ? Number(val) : val));
const RawDatasetScheme = z.object({
  creator: z.object({
    name: LocalizedStringSchema,
    // TODO: homepage
  }),
  description: LocalizedStringSchema,
  id: z.string(),
  title: LocalizedStringSchema,
  issued: DateStringSchema,
  modified: DateStringSchema,
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
    issued: DateStringSchema,
    modified: DateStringSchema,
    license: z.object({
      prefLabel: MultipleLocalizedStringSchema
    }),
    accessUrl: z.url(),
    // TODO: byteSize: IntegerStringSchema,
  }),
  keyword: MultipleLocalizedStringSchema,
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
      userInteractionCount: IntegerStringSchema,
      // TODO: interactionType,
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
      title: { "@id": "title", "@container": "@language" },
      description: { "@id": "description", "@container": "@language" },

      label: { "@id": "rdfs:label", "@container": "@language" },
      uiLabel: { "@id": "s:name", "@container": "@language" },
      prefLabel: { "@id": "skos:prefLabel", "@container": "@language" },
      note: { "@id": "skos:note", "@container": "@language" },
      name: { "@id": "f:name", "@container": "@language" },
      fullName: "vc:fn",
      contact: "dt:contactPoint",
      keyword: { "@id": "dt:keyword", "@container": "@language" },
      theme: "dt:theme",

      interactionStatistic: "s:interactionStatistic",
      interactionType: "s:interactionType",
      userInteractionCount: { "@id": "s:userInteractionCount", "@type": "xml:integer" },
      page: "f:page",
      accessURL: { "@id": "dt:accessURL", "@type": "@id" },
      landingPage: { "@id": "dt:landingPage", "@type": "@id" },
      byteSize: { "@id": "dt:byteSize", "@type": "xml:integer" },

      modified: { "@id": "modified", "@type": "xml:dateTime" },
      issued: { "@id": "issued", "@type": "xml:dateTime" },
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
    },
  });
  // console.log("Framed DCAT:", JSON.stringify(framed, null, 2));

  return framed
}

export function parseIntoDataset(schema: NodeObject) {
  // schema = fixLanguages(schema);
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