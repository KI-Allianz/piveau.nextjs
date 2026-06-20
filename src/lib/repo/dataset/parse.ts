import * as jsonld from 'jsonld';
import {ContextDefinition, NodeObject} from 'jsonld';
import {z} from "zod";
import {Frame} from "jsonld/jsonld-spec";

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

const FormatSchema = z.union([
  z.object({
    label: LocalizedStringSchema,
    note: LocalizedStringSchema.optional(),
  }),
  z.string().transform((val) => ({
    label: LocalizedStringSchema.parse({ de: val }),
  })),
])

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

const RawDistributionScheme = z.object({
  itemId: z.string(),
  id: z.url(),
  title: LocalizedStringSchema,
  description: LocalizedStringSchema,
  issued: DateStringSchema,
  modified: DateStringSchema,
  accessURL: z.url(),
  byteSize: IntegerStringSchema,
  format: FormatSchema,
  license: z.object({
    id: z.url(),
    prefLabel: MultipleLocalizedStringSchema.optional()
  }),
})

const RawDatasetScheme = z.object({
  itemId: z.string(),
  id: z.string(),
  title: LocalizedStringSchema,
  description: LocalizedStringSchema,
  issued: DateStringSchema,
  modified: DateStringSchema,
  language: z.object({
    id: z.url(),
    prefLabel: LocalizedStringSchema.optional()
  }).optional(),
  provenance: z.object({
    label: LocalizedStringSchema
  }).optional(),
  publisher: z.object({
    id: z.url(),
    name: LocalizedStringSchema,
    homepage: z.url().optional(),
  }),
  maintainer: z.object({
    name: LocalizedStringSchema,
    homepage: z.url().optional(),
    mail: z.string().optional(),
  }).optional(),
  creator: z.object({
    name: LocalizedStringSchema,
    homepage: z.url().optional(),
    mail: z.string().optional(),
  }),
  spatial: z.object({
    id: z.url(),
    prefLabel: LocalizedStringSchema.optional()
  }).optional(),
  contact: z.object({
    fullName: z.string(),
    hasEmail: z.string().optional(),
    hasTelephone: z.string().optional(),
    hasURL: z.string().optional(),
  }),
  distributions: z.array(
    RawDistributionScheme
  ),
  keyword: z.record(z.string(), z.array(z.string())),
  landingPage: z.object({
    id: z.url()
  }),
  theme: z.array(z.object({
    id: z.url(),
    prefLabel: LocalizedStringSchema.optional(),
  })),
  page: z.object({
    description: LocalizedStringSchema,
    title: LocalizedStringSchema,
    label: LocalizedStringSchema,
  }).optional(),
  interactionStatistic: z.array(
    z.object({
      uiLabel: LocalizedStringSchema,
      userInteractionCount: IntegerStringSchema,
      interactionType: z.enum(["s:LikeAction", "s:ViewAction", "s:DownloadAction"]),
    })
  ).optional(),
})


export async function parseRawDCAT(data: DCATRoot) {

  // Fix xml:decimal / xml:nonNegativeInteger types
  const fixedData = JSON.parse(JSON.stringify(data)
    .replaceAll('nonNegativeInteger', 'decimal'))

  const frame = {
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

      itemId: "identifier",
      id: "@id",
      distributions: { "@id": "dt:distribution", "@container": "@set" },
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
      theme: { "@id": "dt:theme", "@container": "@set" },

      interactionStatistic: "s:interactionStatistic",
      interactionType: { "@id": "s:interactionType", "@type": "@id" },
      userInteractionCount: { "@id": "s:userInteractionCount", "@type": "xml:integer" },
      page: "f:page",
      accessURL: { "@id": "dt:accessURL", "@type": "@id" },
      homepage: { "@id": "f:homepage", "@type": "@id" },
      landingPage: "dt:landingPage",
      byteSize: { "@id": "dt:byteSize", "@type":"xml:decimal" },

      modified: { "@id": "modified", "@type": "xml:dateTime" },
      issued: { "@id": "issued", "@type": "xml:dateTime" },

      maintainer: "dp:maintainer",
      mail: "f:mbox",
      hasEmail: { "@id": "vc:hasEmail", "@type": "@id" },
      hasTelephone: { "@id": "vc:hasTelephone", "@type": "@id" },
      hasURL: { "@id": "vc:hasURL", "@type": "@id" },

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
  }

  const framed = await jsonld.frame(fixedData, frame as Frame);
  // console.log("Framed DCAT:", JSON.stringify(framed, null, 2));
  return jsonld.compact(framed, frame['@context'] as ContextDefinition)
}

export function parseIntoDataset(schema: NodeObject) {
  schema = fixLanguages(schema);
  console.log("Fixed DCAT:", JSON.stringify(schema, null, 2));
  const parsed = RawDatasetScheme.parse(schema);

  console.log("Parsed DCAT:", JSON.stringify(parsed, null, 2));

  return parsed
}

export function fixLanguages(schema: NodeObject): NodeObject {
  return JSON.parse(JSON.stringify(schema).replaceAll("@none", "de"));
}