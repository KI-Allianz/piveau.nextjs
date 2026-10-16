import { getProperty } from "../prefixes";
import { compactType, readIri } from "./helpers";
import { FieldCodec } from "./types";

const AGENT_TYPES: Record<string, string> = {
  Agent: "foaf:Agent",
  Organization: "foaf:Organization",
  Person: "foaf:Person",
};

function typeFromRdf(node: any, prefixes: Record<string, string>): string {
  const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
  for (const type of types) {
    if (typeof type !== "string") continue;
    const name = compactType(type, prefixes);
    if (name in AGENT_TYPES) return name;
  }
  return "Agent";
}

/**
 * foaf:Agent / foaf:Organization, e.g. dct:publisher.
 */
export const agentCodec: FieldCodec = {
  toRdf: (value) => {
    if (!value || typeof value !== "object") return value;

    const node: Record<string, any> = {};

    if (value.resource) node["@id"] = value.resource;
    node["@type"] = AGENT_TYPES[value.type] ?? "foaf:Agent";

    if (value.name) node["foaf:name"] = value.name;
    if (value.email) node["foaf:mbox"] = value.email;
    if (value.homepage) node["foaf:homepage"] = value.homepage;

    return Object.keys(node).length > 1 ? node : undefined;
  },
  fromRdf: (value, _meta, ctx) => {
    if (!value || typeof value !== "object") return value;

    const result: Record<string, any> = {};

    if (value["@id"]) result.resource = value["@id"];
    result.type = typeFromRdf(value, ctx.prefixes);

    const name = getProperty(value, "foaf:name", ctx.prefixes);
    if (name) result.name = name;

    const email = readIri(getProperty(value, "foaf:mbox", ctx.prefixes));
    if (email) result.email = email;

    const homepage = readIri(getProperty(value, "foaf:homepage", ctx.prefixes));
    if (homepage) result.homepage = homepage;

    return result;
  },
};
