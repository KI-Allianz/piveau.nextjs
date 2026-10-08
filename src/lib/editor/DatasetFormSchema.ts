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
  | "object";

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
  contactPoint: {
    fn: "",
  },
};

export type DatasetFormValues = z.output<typeof datasetFormSchema>;

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
} as Record<string, FormSection>;
