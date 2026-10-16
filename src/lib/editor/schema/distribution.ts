import * as z from "zod";

import { createMultilingualSchema, createTemporalSchema } from "./factories";
import { editorMetadataRegistry } from "./registry";

export const distributionSchema = z
  .object({
    title: createMultilingualSchema(false, {
      label: "Title",
      component: "multilingual-input",
      valueType: "multiLang",
      description: "A name given to the distribution.",
      placeholder: "e.g. Air Quality Measurements 2023 (CSV)",
      rdfProperty: "dct:title",
    }),
    description: createMultilingualSchema(false, {
      label: "Description",
      component: "multilingual-input",
      valueType: "multiLang",
      description: "A brief summary of the distribution.",
      placeholder: "e.g. CSV file containing the measurements.",
      rdfProperty: "dct:description",
    }),
    format: z.string().optional().register(editorMetadataRegistry, {
      label: "Format",
      component: "input",
      valueType: "literal",
      description: "The file format.",
      placeholder: "e.g. CSV",
      rdfProperty: "dct:format",
    }),
    mediaType: z.string().optional().register(editorMetadataRegistry, {
      label: "Media Type",
      component: "input",
      valueType: "literal",
      description: "The IANA media type of the file.",
      placeholder: "e.g. text/csv",
      rdfProperty: "dcat:mediaType",
    }),
    downloadURL: z.string().optional().register(editorMetadataRegistry, {
      label: "Download URL",
      component: "input",
      valueType: "literal",
      description:
        "Direct link to the file. Filled in automatically on upload.",
      placeholder: "https://...",
      rdfProperty: "dcat:downloadURL",
    }),
    accessURL: z.string().optional().register(editorMetadataRegistry, {
      label: "Access URL",
      component: "input",
      valueType: "literal",
      description: "A URL that gives access to the distribution.",
      placeholder: "https://...",
      rdfProperty: "dcat:accessURL",
    }),
    byteSize: z.string().optional().register(editorMetadataRegistry, {
      label: "Byte Size",
      component: "input",
      valueType: "literal",
      description: "The size of the file in bytes. Filled in automatically.",
      placeholder: "e.g. 1024",
      rdfProperty: "dcat:byteSize",
    }),
    license: z.string().optional().register(editorMetadataRegistry, {
      label: "License",
      component: "input",
      valueType: "literal",
      description: "A link to the license under which the file is available.",
      placeholder: "https://...",
      rdfProperty: "dct:license",
    }),
    issued: createTemporalSchema({
      label: "Issued Date",
      component: "temporal",
      valueType: "temporal",
      description: "Supports Year, Year-Month, Date, or full DateTime.",
      placeholder: "2009-10-10 or 2009-10-10T12:00:00Z",
      rdfProperty: "dct:issued",
    }),
    modified: createTemporalSchema({
      label: "Modified Date",
      component: "temporal",
      valueType: "temporal",
      description: "Supports Year, Year-Month, Date, or full DateTime.",
      placeholder: "2009-10-10 or 2009-10-10T12:00:00Z",
      rdfProperty: "dct:modified",
    }),
    uploadPath: z.string().optional().register(editorMetadataRegistry, {
      label: "Upload Path",
      component: "input",
      valueType: "literal",
      description: "Internal uploader path (not published).",
      rdfProperty: "",
    }),
  })
  .register(editorMetadataRegistry, {
    label: "Distribution",
    component: "object",
    valueType: "object",
    description: "A file that makes the dataset available.",
    rdfProperty: "dcat:distribution",
    rdfType: "dcat:Distribution",
  });

export const distributionFormDefaults = {
  title: { en: "", de: "" },
  description: { en: "", de: "" },
} as Partial<z.output<typeof distributionSchema>>;
