import * as z from "zod";

import {
  createMultilingualListSchema,
  createMultilingualSchema,
  createObjectListSchema,
  createStringListSchema,
  createTemporalSchema,
  createTypedLiteralSchema,
} from "./factories";
import {
  createAdmsIdentifierObjectSchema,
  createAgentObjectSchema,
  createContactPointObjectSchema,
  createDateRangeObjectSchema,
  createLabeledResourceObjectSchema,
  createPageObjectSchema,
} from "./objects";
import { distributionSchema } from "./distribution";
import { editorMetadataRegistry } from "./registry";
import { EditorMetadata } from "./types";

const ISO_TEMPORAL_PLACEHOLDER = "2009-10-10 or 2009-10-10T12:00:00Z";

export const datasetFormSchema = z.object({
  id: z
    .string()
    .lowercase()
    .min(1, "ID is required")
    .register(editorMetadataRegistry, {
      label: "Dataset Identifier",
      component: "input",
      valueType: "literal",
      description: "A unique identifier for the dataset.",
      placeholder: "e.g. air-quality-berlin",
      rdfProperty: "@id",
    }),

  title: createMultilingualSchema(true, {
    label: "Title",
    component: "multilingual-input",
    valueType: "multiLang",
    description: "A name given to the dataset.",
    placeholder: "e.g. Air Quality Measurements Berlin",
    rdfProperty: "dct:title",
  }),

  description: createMultilingualSchema(true, {
    label: "Description",
    component: "multilingual-rich-text",
    valueType: "multiLang",
    description: "A brief summary of the dataset. Supports rich text and HTML.",
    placeholder:
      "e.g. This dataset contains air quality measurements from Berlin.",
    rdfProperty: "dct:description",
  }),

  keywords: createMultilingualListSchema({
    label: "Keywords",
    component: "repeatable-multilingual",
    valueType: "multiLangList",
    description: "Keywords describing the dataset.",
    placeholder: "e.g. air quality",
    rdfProperty: "dcat:keyword",
  }),

  publisher: createAgentObjectSchema()
    .optional()
    .register(editorMetadataRegistry, {
      label: "Publisher",
      component: "object",
      valueType: "agent",
      description: "The entity responsible for making the dataset available.",
      rdfProperty: "dct:publisher",
    }),

  contactPoint: createObjectListSchema(
    createContactPointObjectSchema().register(editorMetadataRegistry, {
      label: "Contact Point",
      component: "object",
      valueType: "contactPoint",
      rdfProperty: "dcat:contactPoint",
    } satisfies EditorMetadata),
    {
      label: "Contact Points",
      description: "Contact information for inquiries about the dataset.",
      rdfProperty: "dcat:contactPoint",
    },
  ),

  issued: createTemporalSchema({
    label: "Issued Date",
    component: "temporal",
    valueType: "temporal",
    description: "Supports Year, Year-Month, Date, or full DateTime.",
    placeholder: ISO_TEMPORAL_PLACEHOLDER,
    rdfProperty: "dct:issued",
  }),

  modified: createTemporalSchema({
    label: "Modified Date",
    component: "temporal",
    valueType: "temporal",
    description: "Supports Year, Year-Month, Date, or full DateTime.",
    placeholder: ISO_TEMPORAL_PLACEHOLDER,
    rdfProperty: "dct:modified",
  }),

  identifier: createStringListSchema("literal", {
    label: "Identifier",
    description: "Identifying codes or numbers for the dataset.",
    placeholder: "e.g. 123456789",
    rdfProperty: "dct:identifier",
  }),

  versionInfo: z.string().optional().register(editorMetadataRegistry, {
    label: "Version Info",
    component: "input",
    valueType: "literal",
    description: "A version indicator for the dataset.",
    placeholder: "e.g. 1.0.0",
    rdfProperty: "owl:versionInfo",
  }),

  versionNotes: createMultilingualSchema(false, {
    label: "Version Notes",
    component: "multilingual-input",
    valueType: "multiLang",
    description: "A description of the differences between versions.",
    placeholder: "e.g. Initial release",
    rdfProperty: "adms:versionNotes",
  }),

  hasVersion: createStringListSchema("resource", {
    label: "Has Version",
    description: "Versions of this dataset.",
    placeholder: "https://...",
    rdfProperty: "dct:hasVersion",
  }),

  isVersionOf: createStringListSchema("resource", {
    label: "Is Version Of",
    description: "The dataset this is a version of.",
    placeholder: "https://...",
    rdfProperty: "dct:isVersionOf",
  }),

  source: createStringListSchema("resource", {
    label: "Source",
    description: "The dataset this one is derived from.",
    placeholder: "https://...",
    rdfProperty: "dct:source",
  }),

  isReferencedBy: createStringListSchema("resource", {
    label: "Is Referenced By",
    description: "Resources that reference this dataset.",
    placeholder: "https://...",
    rdfProperty: "dct:isReferencedBy",
  }),

  qualifiedAttribution: createStringListSchema("resource", {
    label: "Qualified Attribution",
    description: "Attributions of the dataset to agents.",
    placeholder: "https://...",
    rdfProperty: "prov:qualifiedAttribution",
  }),

  applicableLegislation: createStringListSchema("resource", {
    label: "Applicable Legislation",
    description: "Legislation mandating the dataset.",
    placeholder: "https://...",
    rdfProperty: "dcatap:applicableLegislation",
  }),

  relation: createStringListSchema("resource", {
    label: "Relation",
    description: "Related resources.",
    placeholder: "https://...",
    rdfProperty: "dct:relation",
  }),

  sample: createStringListSchema("resource", {
    label: "Sample",
    description: "A sample distribution of the dataset.",
    placeholder: "https://...",
    rdfProperty: "adms:sample",
  }),

  wasGeneratedBy: createStringListSchema("resource", {
    label: "Was Generated By",
    description: "The activity that generated the dataset.",
    placeholder: "https://...",
    rdfProperty: "prov:wasGeneratedBy",
  }),

  temporalResolution: createTypedLiteralSchema("duration", {
    label: "Temporal Resolution",
    description: "The minimum time period resolvable (xsd:duration).",
    placeholder: "e.g. P1D",
    rdfProperty: "dcat:temporalResolution",
  }),

  spatialResolutionInMeters: createTypedLiteralSchema("decimal", {
    label: "Spatial Resolution (m)",
    description: "The minimum spatial separation resolvable, in meters.",
    placeholder: "e.g. 10",
    rdfProperty: "dcat:spatialResolutionInMeters",
  }),

  temporal: createObjectListSchema(
    createDateRangeObjectSchema().register(editorMetadataRegistry, {
      label: "Temporal Coverage",
      component: "object",
      valueType: "dateRange",
      rdfProperty: "dct:temporal",
    } satisfies EditorMetadata),
    {
      label: "Temporal Coverage",
      description: "The time period covered by the dataset.",
      rdfProperty: "dct:temporal",
    },
  ),

  provenance: createObjectListSchema(
    createLabeledResourceObjectSchema().register(editorMetadataRegistry, {
      label: "Provenance",
      component: "object",
      valueType: "labeledResource",
      rdfType: "dct:ProvenanceStatement",
      rdfProperty: "dct:provenance",
    } satisfies EditorMetadata),
    {
      label: "Provenance",
      description: "Statements about the origin of the dataset.",
      rdfProperty: "dct:provenance",
    },
  ),

  conformsTo: createObjectListSchema(
    createLabeledResourceObjectSchema().register(editorMetadataRegistry, {
      label: "Conforms To",
      component: "object",
      valueType: "labeledResource",
      rdfType: "dct:Standard",
      rdfProperty: "dct:conformsTo",
    } satisfies EditorMetadata),
    {
      label: "Conforms To",
      description: "Standards the dataset conforms to.",
      rdfProperty: "dct:conformsTo",
    },
  ),

  landingPage: createObjectListSchema(
    createPageObjectSchema().register(editorMetadataRegistry, {
      label: "Landing Page",
      component: "object",
      valueType: "page",
      rdfProperty: "dcat:landingPage",
    } satisfies EditorMetadata),
    {
      label: "Landing Pages",
      description: "Web pages that give access to the dataset.",
      rdfProperty: "dcat:landingPage",
    },
  ),

  page: createObjectListSchema(
    createPageObjectSchema().register(editorMetadataRegistry, {
      label: "Page",
      component: "object",
      valueType: "page",
      rdfProperty: "foaf:page",
    } satisfies EditorMetadata),
    {
      label: "Pages",
      description: "Documentation pages for the dataset.",
      rdfProperty: "foaf:page",
    },
  ),

  admsIdentifier: createObjectListSchema(
    createAdmsIdentifierObjectSchema().register(editorMetadataRegistry, {
      label: "ADMS Identifier",
      component: "object",
      valueType: "admsIdentifier",
      rdfProperty: "adms:identifier",
    } satisfies EditorMetadata),
    {
      label: "ADMS Identifiers",
      description: "Structured identifiers for the dataset.",
      rdfProperty: "adms:identifier",
    },
  ),

  distributions: z
    .array(distributionSchema)
    .optional()
    .register(editorMetadataRegistry, {
      label: "Distributions",
      component: "distributions",
      valueType: "object",
      description: "Files that make the dataset available.",
      rdfProperty: "dcat:distribution",
      rdfType: "dcat:Distribution",
    }),
});

export const datasetFormDefaults = {
  id: "",
  title: {
    en: "",
    de: "",
  },
  description: {
    en: "",
    de: "",
  },
  identifier: [] as string[],
  keywords: [] as Record<string, string>[],
  contactPoint: [] as Record<string, any>[],
  hasVersion: [] as string[],
  isVersionOf: [] as string[],
  source: [] as string[],
  isReferencedBy: [] as string[],
  qualifiedAttribution: [] as string[],
  applicableLegislation: [] as string[],
  relation: [] as string[],
  sample: [] as string[],
  wasGeneratedBy: [] as string[],
  temporal: [] as Record<string, any>[],
  provenance: [] as Record<string, any>[],
  conformsTo: [] as Record<string, any>[],
  landingPage: [] as Record<string, any>[],
  page: [] as Record<string, any>[],
  admsIdentifier: [] as Record<string, any>[],
  distributions: [] as z.output<typeof distributionSchema>[],
};

export type DatasetFormValues = z.output<typeof datasetFormSchema>;
