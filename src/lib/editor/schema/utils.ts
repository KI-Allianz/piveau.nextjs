import * as z from "zod";

/**
 * Unwraps optional/nullable wrappers until a ZodObject is reached.
 */
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

/**
 * Unwraps optional/nullable wrappers until a ZodArray is reached and returns
 * its element schema.
 */
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
