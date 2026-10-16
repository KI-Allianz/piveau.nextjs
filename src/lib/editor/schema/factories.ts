import * as z from "zod";

import {
  editorLanguageLabels,
  editorLanguages,
  requiredEditorLanguages,
  temporalRegex,
  XSD,
} from "./constants";
import { editorMetadataRegistry } from "./registry";
import { EditorMetadata } from "./types";

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

export const createMultilingualSchema = (
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

/**
 * A repeatable multilingual value (e.g. keywords). Each element is a fresh
 * multilingual object; the array field is registered with `meta`.
 */
export const createMultilingualListSchema = (meta: EditorMetadata) => {
  return z
    .array(baseMultilingualSchema.extend({}))
    .optional()
    .register(editorMetadataRegistry, meta);
};

export const createTemporalSchema = (meta: EditorMetadata) => {
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

export type LeafMeta = Pick<
  EditorMetadata,
  "label" | "description" | "placeholder" | "rdfProperty"
>;

/**
 * A repeatable list of plain strings, either literals (`identifier`) or
 * resource IRIs (`has_version`, `source`, ...).
 */
export const createStringListSchema = (
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
export const createTypedLiteralSchema = (dataType: string, meta: LeafMeta) => {
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
export const createObjectListSchema = (
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
