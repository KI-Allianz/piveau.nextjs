import { z } from "zod";

/**
 * Equivalent of `LooseAutocomplete<'AND' | 'OR'>`
 * Allows the known literals but also any string.
 */
const AndOrLooseSchema = z.union([
  z.literal("AND"),
  z.literal("OR"),
  z.string(),
]);

export const SearchParamsBaseSchema = z.object({
  q: z.string().nullable().optional(),
  page: z.number().nullable().optional(),
  limit: z.number().nullable().optional(),
  fields: z.string().nullable().optional(),
  minDate: z.string().nullable().optional(),
  maxDate: z.string().nullable().optional(),
  boost: z.string().nullable().optional(),
  globalAggregation: z.boolean().nullable().optional(),
  facetOperator: AndOrLooseSchema.nullable().optional(),
  facetGroupOperator: AndOrLooseSchema.nullable().optional(),
  bboxMinLon: z.number().nullable().optional(),
  bboxMaxLon: z.number().nullable().optional(),
  bboxMaxLat: z.number().nullable().optional(),
  bboxMinLat: z.number().nullable().optional(),
  sort: z.string().nullable().optional(),
  filterDistributions: z.boolean().nullable().optional(),
  aggregation: z.boolean().nullable().optional(),
  // includes: z.array(z.string()).nullable().optional(), // handled on server side
  scroll: z.boolean().nullable().optional(),
  minScoring: z.number().nullable().optional(),
  maxScoring: z.number().nullable().optional(),
  aggregationAllFields: z.boolean().nullable().optional(),
  aggregationFields: z.string().nullable().optional(),
  countryData: z.boolean().nullable().optional(),
  showScore: z.boolean().nullable().optional(),
  vocabulary: z.string().nullable().optional(),
  dataServices: z.boolean().nullable().optional(),
  autocomplete: z.boolean().nullable().optional(),
  superCatalogue: z.string().nullable().optional(),
});

export const SearchParamsWithFacetsSchema = SearchParamsBaseSchema.extend({
  facets: z
    .record(z.string(), z.union([z.string(), z.array(z.string())]))
    .optional(),
});

export const SearchParamsSchema = SearchParamsWithFacetsSchema.extend({
  /**
   * Single or multiple document types
   * @deprecated Handled on server side
   */
  // filters: z.union([z.string(), z.array(z.string())]).optional(),
});
