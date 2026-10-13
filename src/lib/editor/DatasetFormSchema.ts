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
  | "object"
  | "array";

export type EditorMetadata = {
  label: string;
  component: EditorComponentType;
  description?: string;
  placeholder?: string;
  rdfProperty: string;
  rdfType?: string;
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

export const distributionSchema = z
  .object({
    title: createMultilingualSchema(false, {
      label: "Title",
      component: "multilingual-input",
      description: "A name given to the distribution.",
      placeholder: "e.g. Air Quality Measurements 2023 (CSV)",
      rdfProperty: "dct:title",
    }),
    description: createMultilingualSchema(false, {
      label: "Description",
      component: "multilingual-input",
      description: "A brief summary of the distribution.",
      placeholder: "e.g. CSV file containing the measurements.",
      rdfProperty: "dct:description",
    }),
    format: z.string().optional().register(editorMetadataRegistry, {
      label: "Format",
      component: "input",
      description: "The file format.",
      placeholder: "e.g. CSV",
      rdfProperty: "dct:format",
    }),
    mediaType: z.string().optional().register(editorMetadataRegistry, {
      label: "Media Type",
      component: "input",
      description: "The IANA media type of the file.",
      placeholder: "e.g. text/csv",
      rdfProperty: "dcat:mediaType",
    }),
    downloadURL: z.string().optional().register(editorMetadataRegistry, {
      label: "Download URL",
      component: "input",
      description: "Direct link to the file. Filled in automatically on upload.",
      placeholder: "https://...",
      rdfProperty: "dcat:downloadURL",
    }),
    accessURL: z.string().optional().register(editorMetadataRegistry, {
      label: "Access URL",
      component: "input",
      description: "A URL that gives access to the distribution.",
      placeholder: "https://...",
      rdfProperty: "dcat:accessURL",
    }),
    byteSize: z.string().optional().register(editorMetadataRegistry, {
      label: "Byte Size",
      component: "input",
      description: "The size of the file in bytes. Filled in automatically.",
      placeholder: "e.g. 1024",
      rdfProperty: "dcat:byteSize",
    }),
    license: z.string().optional().register(editorMetadataRegistry, {
      label: "License",
      component: "input",
      description: "A link to the license under which the file is available.",
      placeholder: "https://...",
      rdfProperty: "dct:license",
    }),
    issued: createTemporalSchema({
      label: "Issued Date",
      component: "temporal",
      description: "Supports Year, Year-Month, Date, or full DateTime.",
      placeholder: "2009-10-10 or 2009-10-10T12:00:00Z",
      rdfProperty: "dct:issued",
    }),
    modified: createTemporalSchema({
      label: "Modified Date",
      component: "temporal",
      description: "Supports Year, Year-Month, Date, or full DateTime.",
      placeholder: "2009-10-10 or 2009-10-10T12:00:00Z",
      rdfProperty: "dct:modified",
    }),
    uploadPath: z.string().optional().register(editorMetadataRegistry, {
      label: "Upload Path",
      component: "input",
      description: "Internal uploader path (not published).",
      rdfProperty: "",
    }),
  })
  .register(editorMetadataRegistry, {
    label: "Distribution",
    component: "object",
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
      description: "A unique identifier for the dataset.",
      placeholder: "e.g. air-quality-berlin",
      rdfProperty: "@id",
    }),

  title: createMultilingualSchema(true, {
    label: "Title",
    component: "multilingual-input",
    description: "A name given to the dataset.",
    placeholder: "e.g. Air Quality Measurements Berlin",
    rdfProperty: "dct:title",
  }),

  description: createMultilingualSchema(true, {
    label: "Description",
    component: "multilingual-input",
    description: "A brief summary of the dataset.",
    placeholder:
      "e.g. This dataset contains air quality measurements from Berlin.",
    rdfProperty: "dct:description",
  }),

  contactPoint: z
    .object({
      fn: z
        .string()
        .min(1, "Full name is required")
        .optional()
        .register(editorMetadataRegistry, {
          label: "Full Name",
          component: "input",
          description: "The name of the organization or person.",
          placeholder: "e.g. Statistisches Bundesamt",
          rdfProperty: "vcard:fn",
        }),
      email: z.string().optional().register(editorMetadataRegistry, {
        label: "Email",
        component: "input",
        description: "A web address or email for contacting.",
        placeholder: "e.g. https://www.destatis.de/kontakt",
        rdfProperty: "vcard:hasEmail",
      }),
    })
    .optional()
    .register(editorMetadataRegistry, {
      label: "Contact Point",
      component: "object",
      description: "Contact information for inquiries about the dataset.",
      rdfProperty: "dcat:contactPoint",
      rdfType: "vcard:Organization",
    }),

  issued: createTemporalSchema({
    label: "Issued Date",
    component: "temporal",
    description: "Supports Year, Year-Month, Date, or full DateTime.",
    placeholder: "2009-10-10 or 2009-10-10T12:00:00Z",
    rdfProperty: "dct:issued",
  }),

  modified: createTemporalSchema({
    label: "Modified Date",
    component: "temporal",
    description: "Supports Year, Year-Month, Date, or full DateTime.",
    placeholder: "2009-10-10 or 2009-10-10T12:00:00Z",
    rdfProperty: "dct:issued",
  }),

  distributions: z
    .array(distributionSchema)
    .optional()
    .register(editorMetadataRegistry, {
      label: "Distributions",
      component: "array",
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

  keys: (keyof DatasetFormValues)[];
}

export const formSections = {
  identification: {
    title: "Identification",
    description: "Basic identification information for the dataset.",
    keys: ["id"],
  },
  basicInfo: {
    title: "Basic Information",
    description: "General information about the dataset.",
    keys: ["title", "description", "contactPoint", "issued", "modified"],
  },
  distributions: {
    title: "Distributions",
    description: "Files that make the dataset available.",
    keys: ["distributions"],
  },
} as Record<string, FormSection>;
