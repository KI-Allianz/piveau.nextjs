import * as jsonld from 'jsonld';

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
      "vc": "http://www.w3.org/2006/vcard/ns#"
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
  console.log("Framed DCAT:", JSON.stringify(framed, null, 2));
}