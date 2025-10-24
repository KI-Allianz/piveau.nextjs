import * as jsonld from 'jsonld';
import {Dataset} from "@/lib/utils";
import { NodeObject } from 'jsonld';

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


export async function parseRawDCAT(data: DCATRoot) {


  const framed = await jsonld.frame(data, {
    "@context": {
      "@vocab": "http://purl.org/dc/terms/",
      //"dct": "http://purl.org/dc/terms/",
      "dt": "http://www.w3.org/ns/dcat#",
      "dp": "http://dcat-ap.de/def/dcatde/",
      "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      "f": "http://xmlns.com/foaf/0.1/",
      "vc": "http://www.w3.org/2006/vcard/ns#",
      "skos": "http://www.w3.org/2004/02/skos/core#",
      "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
      "xml": "http://www.w3.org/2001/XMLSchema#",
      "s": "https://schema.org/"
    },
    "@type": "dt:Dataset",
    "creator": {
      "@embed": "@always"
    },
    "temporal": {
      "@embed": "@always"
    },
    "dt:distribution": {
      "@embed": "@always"
    }
  });
  // console.log("Framed DCAT:", JSON.stringify(framed, null, 2));

  return framed
}

export function parseIntoDataset(schema: NodeObject): Dataset {
  schema = fixLanguages(schema);

  console.log("Fixed DCAT:", JSON.stringify(schema, null, 2));

  return schema
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