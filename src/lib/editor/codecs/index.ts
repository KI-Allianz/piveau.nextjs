import { ZodArray, ZodNullable, ZodOptional, ZodType } from "zod";
import {
  EditorMetadata,
  editorMetadataRegistry,
  getArrayElementSchema,
  getUnwrappedObjectSchema,
} from "../DatasetFormSchema";
import { getProperty } from "../prefixes";
import { CodecContext, FieldCodec } from "./types";
import { literalCodec } from "./literal";
import { multiLangCodec } from "./multiLang";
import { temporalCodec } from "./temporal";

/**
 * Leaf codecs keyed by `EditorMetadata.valueType`. Container types (`object`
 * and arrays) are handled by the dispatcher below, not by a codec.
 */
export const CODECS: Record<string, FieldCodec> = {
  literal: literalCodec,
  multiLang: multiLangCodec,
  temporal: temporalCodec,
};

function unwrapSchema(schema: ZodType): ZodType {
  let inner = schema;
  while (
    inner instanceof ZodOptional ||
    inner instanceof ZodNullable
  ) {
    inner = inner.unwrap() as ZodType;
  }
  return inner;
}

function isArraySchema(schema: ZodType): boolean {
  return unwrapSchema(schema) instanceof ZodArray;
}

function serializeObject(
  schema: ZodType,
  value: any,
  meta: EditorMetadata,
  ctx: CodecContext,
): any {
  const innerSchema = getUnwrappedObjectSchema(schema);
  if (!innerSchema) {
    console.error(`Expected ZodObject, but got`, schema);
    return null;
  }

  const graphProperties: Record<string, any> = {};

  if (meta.rdfType) {
    graphProperties["@type"] = meta.rdfType;
  }

  for (const [subKey, subSchema] of Object.entries(innerSchema.shape)) {
    const subMeta = editorMetadataRegistry.get(subSchema as ZodType);
    if (!subMeta || !subMeta.rdfProperty) continue;

    const serializedSubValue = serializeField(
      subSchema as ZodType,
      value?.[subKey],
      ctx,
    );

    if (serializedSubValue !== undefined) {
      graphProperties[subMeta.rdfProperty] = serializedSubValue;
    }
  }

  return Object.keys(graphProperties).length > 1 ? graphProperties : undefined;
}

function deserializeObject(
  schema: ZodType,
  jsonLdValue: any,
  ctx: CodecContext,
): any {
  const innerSchema = getUnwrappedObjectSchema(schema);
  if (!innerSchema) {
    console.error(`Expected ZodObject, but got`, schema);
    return null;
  }

  const parsedObjectData: Record<string, any> = {};

  for (const [subKey, subSchema] of Object.entries(innerSchema.shape)) {
    const subMeta = editorMetadataRegistry.get(subSchema as ZodType);
    if (!subMeta || !subMeta.rdfProperty) continue;

    const rawSubValue = getProperty(
      jsonLdValue,
      subMeta.rdfProperty,
      ctx.prefixes,
    );

    let targetSubVal = rawSubValue;
    if (
      rawSubValue &&
      typeof rawSubValue === "object" &&
      "@id" in rawSubValue &&
      Object.keys(rawSubValue).length === 1
    ) {
      targetSubVal = rawSubValue["@id"];
    }

    const parsedSubVal = deserializeField(
      subSchema as ZodType,
      targetSubVal,
      ctx,
    );

    if (parsedSubVal !== undefined) {
      parsedObjectData[subKey] = parsedSubVal;
    }
  }

  return Object.keys(parsedObjectData).length > 0
    ? parsedObjectData
    : undefined;
}

/**
 * Serializes a single form field (or array of fields) into JSON-LD.
 */
export function serializeField(
  schema: ZodType,
  value: any,
  ctx: CodecContext,
): any {
  if (value === undefined || value === null || value === "") return undefined;

  const meta = editorMetadataRegistry.get(schema);
  if (!meta) return value;

  if (isArraySchema(schema)) {
    const elementSchema = getArrayElementSchema(schema);
    if (!elementSchema) return undefined;

    const items = (Array.isArray(value) ? value : [value])
      .map((item) => serializeField(elementSchema, item, ctx))
      .filter((item) => item !== undefined);

    return items.length > 0 ? items : undefined;
  }

  if (meta.valueType === "object") {
    return serializeObject(schema, value, meta, ctx);
  }

  const codec = CODECS[meta.valueType];
  if (!codec) return value;

  return codec.toRdf(value, meta, ctx);
}

/**
 * Deserializes a single JSON-LD value (or array of values) into a form field.
 */
export function deserializeField(
  schema: ZodType,
  jsonLdValue: any,
  ctx: CodecContext,
): any {
  if (jsonLdValue === undefined || jsonLdValue === null) return undefined;

  const meta = editorMetadataRegistry.get(schema);
  if (!meta) return jsonLdValue;

  if (isArraySchema(schema)) {
    const elementSchema = getArrayElementSchema(schema);
    if (!elementSchema) return undefined;

    const entries = Array.isArray(jsonLdValue) ? jsonLdValue : [jsonLdValue];
    const items = entries
      .map((entry) => deserializeField(elementSchema, entry, ctx))
      .filter((item) => item !== undefined);

    return items.length > 0 ? items : undefined;
  }

  if (meta.valueType === "object") {
    return deserializeObject(schema, jsonLdValue, ctx);
  }

  const codec = CODECS[meta.valueType];
  if (!codec) return jsonLdValue;

  return codec.fromRdf(jsonLdValue, meta, ctx);
}
