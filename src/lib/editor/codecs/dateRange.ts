import { getProperty } from "../prefixes";
import { readValue, temporalNode } from "./helpers";
import { FieldCodec } from "./types";

/**
 * dct:PeriodOfTime with dcat:startDate / dcat:endDate, e.g. dct:temporal.
 * Form shape: `{ gte, lte }`.
 */
export const dateRangeCodec: FieldCodec = {
  toRdf: (value) => {
    if (!value || typeof value !== "object") return value;

    const node: Record<string, any> = { "@type": "dct:PeriodOfTime" };

    if (value.gte) node["dcat:startDate"] = temporalNode(value.gte);
    if (value.lte) node["dcat:endDate"] = temporalNode(value.lte);

    return Object.keys(node).length > 1 ? node : undefined;
  },
  fromRdf: (value, _meta, ctx) => {
    if (!value || typeof value !== "object") return undefined;

    const gte = readValue(getProperty(value, "dcat:startDate", ctx.prefixes));
    const lte = readValue(getProperty(value, "dcat:endDate", ctx.prefixes));

    return gte || lte ? { gte, lte } : undefined;
  },
};
