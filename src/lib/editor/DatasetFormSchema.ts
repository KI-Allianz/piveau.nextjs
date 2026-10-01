import * as z from "zod";

export const editorLanguages = ["en", "de"];
export const editorLanguageLabels: Record<string, string> = {
  en: "English",
  de: "German",
};
export const requiredEditorLanguages = ["en"];

export type EditorComponentType =
  "input" | "multilingual-input" | "select" | "checkbox" | "textarea";

export const editorMetadataRegistry = z.registry<{
  label: string;
  component: EditorComponentType;
  description?: string;
  placeholder?: string;
}>();

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
  });

const requiredMultilingualSchema = baseMultilingualSchema.extend(
  requiredEditorLanguages.reduce(
    (acc, lang) => {
      acc[lang] = z
        .string()
        .min(1, `${editorLanguageLabels[lang]} value is required`);
      return acc;
    },
    {} as Record<string, z.ZodType>,
  ),
);

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
    }),

  title: requiredMultilingualSchema.register(editorMetadataRegistry, {
    label: "Dataset Title",
    component: "multilingual-input",
    description: "A name given to the dataset.",
    placeholder: "e.g. Air Quality Measurements Berlin",
  }),

  description: requiredMultilingualSchema.register(editorMetadataRegistry, {
    label: "Dataset Description",
    component: "multilingual-input",
    description: "A brief summary of the dataset.",
    placeholder:
      "e.g. This dataset contains air quality measurements from Berlin.",
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
    keys: ["title", "description"],
  },
} as Record<string, FormSection>;
