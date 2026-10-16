import * as z from "zod";
import { ZodIssueCode } from "zod/v3";

export const editorLanguages = ["en", "de"];
export const editorLanguageLabels: Record<string, string> = {
  en: "English",
  de: "German",
};
export const requiredEditorLanguages = ["en"];

export type EditorComponentType =
  | "input"
  | "multilingual-input"
  | "select"
  | "checkbox"
  | "textarea"
  | "temporal"
  | "list"
  | "repeatable-object"
  | "repeatable-multilingual"
  | "object"
  | "distributions";

/**
 * Serialization strategy for a field. Leaf types are implemented as codecs in
 * `./codecs`; `object` (and any array schema) is handled generically by the
 * dispatcher.
 */
export type FieldValueType =
  | "literal"
  | "multiLang"
  | "multiLangList"
  | "temporal"
  | "typedLiteral"
  | "resource"
  | "list"
  | "labeledResource"
  | "skosConcept"
  | "agent"
  | "contactPoint"
  | "dateRange"
  | "page"
  | "admsIdentifier"
  | "object";

export type EditorMetadata = {
  label: string;
  component: EditorComponentType;
  /** Serialization strategy (see `./codecs`). */
  valueType: FieldValueType;
  description?: string;
  placeholder?: string;
  rdfProperty: string;
  rdfType?: string;
  /** xsd datatype IRI for `typedLiteral` values. */
  dataType?: string;
  /** Vocabulary id (see `@/lib/vocabularies`) for `skosConcept` values. */
  vocabulary?: string;
  /** Options for `select` components. */
  options?: { label: string; value: string }[];
};

export const editorMetadataRegistry = z.registry<EditorMetadata>();

const baseMultilingualSchema = z
  .object(
    editorLanguages.reduce(
      (acc, lang) => {
        acc[lang] = z.string().optional();
        return acc;
      },
      {} as Record<string, z.ZodType>,
    ),
  )
  .register(editorMetadataRegistry, {
    label: "Multilingual String",
    component: "multilingual-input",
    valueType: "multiLang",
    description: "A string that can have values in multiple languages.",
    placeholder: "e.g. text here",
    rdfProperty: "http://www.w3.org/2000/01/rdf-schema#label",
  });

const createMultilingualSchema = (
  isRequired: boolean = false,
  meta: EditorMetadata,
) => {
  const base = requiredEditorLanguages.reduce(
    (acc, lang) => {
      acc[lang] = z
        .string()
        .min(1, `${editorLanguageLabels[lang]} ${meta.label} is required`);
      return acc;
    },
    {} as Record<string, z.ZodType>,
  );

  let schema = baseMultilingualSchema;

  if (isRequired) {
    schema = baseMultilingualSchema.extend(base);
  } else {
    // Always create a fresh schema instance: the metadata registry is keyed by
    // schema object identity, so sharing `baseMultilingualSchema` would make
    // all non-required multilingual fields collide.
    schema = baseMultilingualSchema.extend({});
  }

  return schema.register(editorMetadataRegistry, meta);
};

export const temporalRegex = {
  gYear: /^\d{4}$/,
  gYearMonth: /^\d{4}-\d{2}$/,
  date: /^\d{4}-\d{2}-\d{2}$/,
  dateTime: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/,
};

const createTemporalSchema = (meta: EditorMetadata) => {
  return z
    .union([
      z
        .string()
        .regex(
          temporalRegex.dateTime,
          "Invalid dateTime (e.g. 2009-10-10T12:00:00-05:00)",
        ),
      z.string().regex(temporalRegex.date, "Invalid date (e.g. 2009-10-10)"),
      z
        .string()
        .regex(temporalRegex.gYearMonth, "Invalid year-month (e.g. 2009-10)"),
      z.string().regex(temporalRegex.gYear, "Invalid year (e.g. 2009)"),
    ])
    .optional()
    .register(editorMetadataRegistry, meta);
};

const XSD = "http://www.w3.org/2001/XMLSchema#";

type LeafMeta = Pick<
  EditorMetadata,
  "label" | "description" | "placeholder" | "rdfProperty"
>;

/**
 * A repeatable list of plain strings, either literals (`identifier`) or
 * resource IRIs (`has_version`, `source`, ...).
 */
const createStringListSchema = (
  valueType: "literal" | "resource",
  meta: LeafMeta,
) => {
  const elementSchema = z.string().register(editorMetadataRegistry, {
    label: meta.label,
    component: "input",
    valueType,
    rdfProperty: meta.rdfProperty,
  } satisfies EditorMetadata);

  return z
    .array(elementSchema)
    .optional()
    .register(editorMetadataRegistry, {
      label: meta.label,
      component: "list",
      valueType: "list",
      description: meta.description,
      placeholder: meta.placeholder,
      rdfProperty: meta.rdfProperty,
    } satisfies EditorMetadata);
};

/**
 * A single typed literal, e.g. `xsd:duration` or `xsd:decimal`.
 */
const createTypedLiteralSchema = (dataType: string, meta: LeafMeta) => {
  return z
    .string()
    .optional()
    .register(editorMetadataRegistry, {
      label: meta.label,
      component: "input",
      valueType: "typedLiteral",
      dataType: `${XSD}${dataType}`,
      description: meta.description,
      placeholder: meta.placeholder,
      rdfProperty: meta.rdfProperty,
    } satisfies EditorMetadata);
};

/**
 * Repeatable list of structured objects. The element schema carries the leaf
 * `valueType` (codec); the array itself uses the generic `list` strategy.
 */
const createObjectListSchema = (
  elementSchema: z.ZodType,
  meta: Omit<EditorMetadata, "component" | "valueType">,
) => {
  return z
    .array(elementSchema)
    .optional()
    .register(editorMetadataRegistry, {
      ...meta,
      component: "repeatable-object",
      valueType: "list",
    } satisfies EditorMetadata);
};

const createAgentObjectSchema = () =>
  z.object({
    type: z
      .enum(["Agent", "Organization", "Person"])
      .optional()
      .register(editorMetadataRegistry, {
        label: "Type",
        component: "select",
        valueType: "literal",
        description: "The kind of agent.",
        rdfProperty: "@type",
        options: [
          { label: "Agent", value: "Agent" },
          { label: "Organization", value: "Organization" },
          { label: "Person", value: "Person" },
        ],
      } satisfies EditorMetadata),
    name: z.string().optional().register(editorMetadataRegistry, {
      label: "Name",
      component: "input",
      valueType: "literal",
      description: "The name of the agent.",
      placeholder: "e.g. Fraunhofer FOKUS",
      rdfProperty: "foaf:name",
    }),
    email: z.string().optional().register(editorMetadataRegistry, {
      label: "Email",
      component: "input",
      valueType: "literal",
      description: "An email address.",
      placeholder: "e.g. info@example.org",
      rdfProperty: "foaf:mbox",
    }),
    homepage: z.string().optional().register(editorMetadataRegistry, {
      label: "Homepage",
      component: "input",
      valueType: "literal",
      description: "Homepage of the agent.",
      placeholder: "https://...",
      rdfProperty: "foaf:homepage",
    }),
    resource: z.string().optional().register(editorMetadataRegistry, {
      label: "Resource",
      component: "input",
      valueType: "literal",
      description: "A URI identifying the agent.",
      placeholder: "https://...",
      rdfProperty: "@id",
    }),
  });

const createContactPointObjectSchema = () =>
  z.object({
    type: z
      .enum(["Kind", "Individual", "Organization"])
      .optional()
      .register(editorMetadataRegistry, {
        label: "Type",
        component: "select",
        valueType: "literal",
        description: "The kind of contact.",
        rdfProperty: "@type",
        options: [
          { label: "Kind", value: "Kind" },
          { label: "Individual", value: "Individual" },
          { label: "Organization", value: "Organization" },
        ],
      } satisfies EditorMetadata),
    name: z.string().optional().register(editorMetadataRegistry, {
      label: "Full Name",
      component: "input",
      valueType: "literal",
      description: "The name of the organization or person.",
      placeholder: "e.g. Statistisches Bundesamt",
      rdfProperty: "vcard:fn",
    }),
    address: z.string().optional().register(editorMetadataRegistry, {
      label: "Address",
      component: "input",
      valueType: "literal",
      description: "A postal address.",
      placeholder: "e.g. 111 Lake Drive, Australia",
      rdfProperty: "vcard:hasAddress",
    }),
    email: z.string().optional().register(editorMetadataRegistry, {
      label: "Email",
      component: "input",
      valueType: "literal",
      description: "A contact email address.",
      placeholder: "e.g. info@example.org",
      rdfProperty: "vcard:hasEmail",
    }),
    telephone: z.string().optional().register(editorMetadataRegistry, {
      label: "Telephone",
      component: "input",
      valueType: "literal",
      description: "A contact telephone.",
      placeholder: "e.g. +61755555555",
      rdfProperty: "vcard:hasTelephone",
    }),
    resource: z.string().optional().register(editorMetadataRegistry, {
      label: "Resource",
      component: "input",
      valueType: "literal",
      description: "A URI identifying the contact point.",
      placeholder: "https://...",
      rdfProperty: "@id",
    }),
  });

const createDateRangeObjectSchema = () =>
  z.object({
    gte: createTemporalSchema({
      label: "Start",
      component: "temporal",
      valueType: "temporal",
      description: "Start of the period.",
      placeholder: "2009-10-10 or 2009-10-10T12:00:00Z",
      rdfProperty: "dcat:startDate",
    }),
    lte: createTemporalSchema({
      label: "End",
      component: "temporal",
      valueType: "temporal",
      description: "End of the period.",
      placeholder: "2010-10-10 or 2010-10-10T12:00:00Z",
      rdfProperty: "dcat:endDate",
    }),
  });

const createPageObjectSchema = () =>
  z.object({
    resource: z.string().optional().register(editorMetadataRegistry, {
      label: "Resource",
      component: "input",
      valueType: "literal",
      description: "The URI of the document.",
      placeholder: "https://...",
      rdfProperty: "@id",
    }),
    title: createMultilingualSchema(false, {
      label: "Title",
      component: "multilingual-input",
      valueType: "multiLang",
      description: "The title of the document.",
      placeholder: "e.g. Documentation",
      rdfProperty: "dct:title",
    }),
    description: createMultilingualSchema(false, {
      label: "Description",
      component: "multilingual-input",
      valueType: "multiLang",
      description: "A description of the document.",
      placeholder: "e.g. API documentation",
      rdfProperty: "dct:description",
    }),
    format: z.string().optional().register(editorMetadataRegistry, {
      label: "Format",
      component: "input",
      valueType: "literal",
      description: "The file format URI of the document.",
      placeholder: "https://...",
      rdfProperty: "dct:format",
    }),
  });

const createAdmsIdentifierObjectSchema = () =>
  z.object({
    identifier: z.string().optional().register(editorMetadataRegistry, {
      label: "Identifier",
      component: "input",
      valueType: "literal",
      description: "The identifier value.",
      placeholder: "e.g. 10.1234/5678",
      rdfProperty: "skos:notation",
    }),
    scheme: z.string().optional().register(editorMetadataRegistry, {
      label: "Scheme",
      component: "input",
      valueType: "literal",
      description: "The URI of the identifier scheme.",
      placeholder: "e.g. http://purl.org/spar/datacite/doi",
      rdfProperty: "@type",
    }),
    resource: z.string().optional().register(editorMetadataRegistry, {
      label: "Resource",
      component: "input",
      valueType: "literal",
      description: "A URI identifying the identifier.",
      placeholder: "https://...",
      rdfProperty: "@id",
    }),
  });

const createLabeledResourceObjectSchema = () =>
  z.object({
    resource: z.string().optional().register(editorMetadataRegistry, {
      label: "Resource",
      component: "input",
      valueType: "literal",
      description: "A URI for the referenced resource.",
      placeholder: "https://...",
      rdfProperty: "@id",
    }),
    label: z.string().optional().register(editorMetadataRegistry, {
      label: "Label",
      component: "input",
      valueType: "literal",
      description: "A label, used when no resource URI is given.",
      placeholder: "e.g. Conforms To",
      rdfProperty: "rdfs:label",
    }),
  });

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
    component: "multilingual-input",
    valueType: "multiLang",
    description: "A brief summary of the dataset.",
    placeholder:
      "e.g. This dataset contains air quality measurements from Berlin.",
    rdfProperty: "dct:description",
  }),

  keywords: z
    .array(baseMultilingualSchema.extend({}))
    .optional()
    .register(editorMetadataRegistry, {
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

export const distributionFormDefaults = {
  title: { en: "", de: "" },
  description: { en: "", de: "" },
} as Partial<z.output<typeof distributionSchema>>;

function isPlainObject(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Builds complete form defaults by merging the static defaults with a parsed
 * draft, deep-merging nested objects (e.g. title, description) so that missing
 * keys fall back to their defaults.
 */
export function buildDatasetFormDefaults(
  draft?: Partial<DatasetFormValues> | null,
): Partial<DatasetFormValues> {
  const merged: Record<string, any> = {
    ...datasetFormDefaults,
    ...(draft ?? {}),
  };

  for (const [key, defaultValue] of Object.entries(datasetFormDefaults)) {
    const draftValue = (draft as Record<string, any> | null | undefined)?.[key];
    if (isPlainObject(defaultValue) && isPlainObject(draftValue)) {
      merged[key] = { ...defaultValue, ...draftValue };
    }
  }

  return merged;
}

export function formatForPiveau(data: DatasetFormValues) {
  return {
    id: data.id,
    title: {
      en: data.title.en,
      ...(data.title.de ? { de: data.title.de } : {}),
    },
    description: {
      en: data.description.en,
      ...(data.description.de ? { de: data.description.de } : {}),
    },
  };
}

export function getUnwrappedObjectSchema(
  schema: z.ZodType,
): z.ZodObject<any> | null {
  let innerSchema: z.ZodType = schema;
  while (innerSchema) {
    if (innerSchema instanceof z.ZodObject) break;
    if (
      innerSchema instanceof z.ZodOptional ||
      innerSchema instanceof z.ZodNullable
    ) {
      innerSchema = innerSchema.unwrap() as z.ZodType;
    } else {
      break;
    }
  }

  if (!(innerSchema instanceof z.ZodObject)) {
    console.error(`Expected ZodObject, but got`, schema);
    return null;
  }

  return innerSchema;
}

export function getArrayElementSchema(schema: z.ZodType): z.ZodType | null {
  let innerSchema: z.ZodType = schema;
  while (innerSchema) {
    if (innerSchema instanceof z.ZodArray) {
      return innerSchema.element as z.ZodType;
    }
    if (
      innerSchema instanceof z.ZodOptional ||
      innerSchema instanceof z.ZodNullable
    ) {
      innerSchema = innerSchema.unwrap() as z.ZodType;
    } else {
      break;
    }
  }

  console.error(`Expected ZodArray, but got`, schema);
  return null;
}

export interface FormSection {
  title: string;
  description: string;
  hidden?: boolean;

  keys: (keyof DatasetFormValues)[];
}

export const formSections = {
  identification: {
    title: "Identification",
    description: "Basic identification information for the dataset.",
    keys: ["id", "identifier"],
  },
  basicInfo: {
    title: "Basic Information",
    description: "General information about the dataset.",
    keys: [
      "title",
      "description",
      "keywords",
      "publisher",
      "contactPoint",
      "issued",
      "modified",
    ],
  },
  versioning: {
    title: "Versioning",
    description: "Version information and relationships between versions.",
    hidden: true,
    keys: [
      "versionInfo",
      "versionNotes",
      "hasVersion",
      "isVersionOf",
      "isReferencedBy",
      "admsIdentifier",
    ],
  },
  relations: {
    title: "Relations",
    description: "Related resources and provenance.",
    hidden: true,
    keys: [
      "relation",
      "source",
      "qualifiedAttribution",
      "applicableLegislation",
      "sample",
      "wasGeneratedBy",
      "provenance",
      "conformsTo",
      "landingPage",
      "page",
    ],
  },
  coverage: {
    title: "Coverage Resolution",
    description: "Temporal and spatial coverage and resolution.",
    hidden: true,
    keys: ["temporal", "temporalResolution", "spatialResolutionInMeters"],
  },
  distributions: {
    title: "Distributions",
    description: "Files that make the dataset available.",
    keys: ["distributions"],
  },
} as Record<string, FormSection>;

/**
 * Section keys that should be expanded by default.
 */
export const defaultOpenSectionKeys = Object.entries(formSections)
  .filter(([, section]) => !section.hidden)
  .map(([key]) => key);
