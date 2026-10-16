import { getProperty, Prefixes } from "../prefixes";
import { compactType, readIri } from "./helpers";
import { FieldCodec } from "./types";

const CONTACT_TYPES = ["Individual", "Organization", "Kind"];

function typeFromRdf(node: any, prefixes: Prefixes): string {
  const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
  for (const type of types) {
    if (typeof type !== "string") continue;
    const name = compactType(type, prefixes);
    if (CONTACT_TYPES.includes(name)) return name;
  }
  return "Kind";
}

function readAddress(value: any, prefixes: Prefixes): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (typeof value !== "object") return undefined;

  const parts = [
    "vcard:street-address",
    "vcard:locality",
    "vcard:postal-code",
    "vcard:country-name",
  ]
    .map((prop) => getProperty(value, prop, prefixes))
    .filter((part) => typeof part === "string");

  return parts.length > 0 ? parts.join(", ") : undefined;
}

/**
 * vcard:Kind / vcard:Individual / vcard:Organization, e.g. dcat:contactPoint.
 */
export const contactPointCodec: FieldCodec = {
  toRdf: (value) => {
    if (!value || typeof value !== "object") return value;

    const node: Record<string, any> = {};

    if (value.resource) node["@id"] = value.resource;

    const types = ["vcard:Kind"];
    if (value.type && value.type !== "Kind") types.push(`vcard:${value.type}`);
    node["@type"] = types;

    if (value.name) node["vcard:fn"] = value.name;
    if (value.email) node["vcard:hasEmail"] = value.email;
    if (value.telephone) node["vcard:hasTelephone"] = value.telephone;
    if (value.address) node["vcard:hasAddress"] = value.address;

    return Object.keys(node).length > 1 ? node : undefined;
  },
  fromRdf: (value, _meta, ctx) => {
    if (!value || typeof value !== "object") return value;

    const result: Record<string, any> = {};

    if (value["@id"]) result.resource = value["@id"];
    result.type = typeFromRdf(value, ctx.prefixes);

    const name = getProperty(value, "vcard:fn", ctx.prefixes);
    if (name) result.name = name;

    const email = readIri(getProperty(value, "vcard:hasEmail", ctx.prefixes));
    if (email) result.email = email;

    const telephone = readIri(
      getProperty(value, "vcard:hasTelephone", ctx.prefixes),
    );
    if (telephone) result.telephone = telephone;

    const address = readAddress(
      getProperty(value, "vcard:hasAddress", ctx.prefixes),
      ctx.prefixes,
    );
    if (address) result.address = address;

    return result;
  },
};
