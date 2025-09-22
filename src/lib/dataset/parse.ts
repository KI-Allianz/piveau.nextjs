import { z } from "zod";

const dcatSchema = z.object({
  "@graph": z.array(z.object({})), // Simplified for brevity
  "@context": z.any(),
})

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


export function parseRawDCAT(data: DCATRoot) {
  if (!data || !data["@graph"] || !Array.isArray(data["@graph"])) {
    throw new Error("Invalid DCAT data: Missing or malformed '@graph' property.");
  }

  let parsed = {}

  const graph = data["@graph"];

  for (const item of graph) {

  }

  return parsed;
}