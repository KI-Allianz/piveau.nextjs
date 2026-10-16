import * as z from "zod";

import { createMultilingualSchema, createTemporalSchema } from "./factories";
import { editorMetadataRegistry } from "./registry";
import { EditorMetadata } from "./types";

export const createAgentObjectSchema = () =>
  z.object({
    type: z
      .enum(["Agent", "Organization", "Person"])
      .optional()
      .register(editorMetadataRegistry, {
        label: "Type",
        component: "select",
        valueType: "literal",
        description: "The kind of agent.",
        rdfProperty: "@type",
        options: [
          { label: "Agent", value: "Agent" },
          { label: "Organization", value: "Organization" },
          { label: "Person", value: "Person" },
        ],
      } satisfies EditorMetadata),
    name: z.string().optional().register(editorMetadataRegistry, {
      label: "Name",
      component: "input",
      valueType: "literal",
      description: "The name of the agent.",
      placeholder: "e.g. Fraunhofer FOKUS",
      rdfProperty: "foaf:name",
    }),
    email: z.string().optional().register(editorMetadataRegistry, {
      label: "Email",
      component: "input",
      valueType: "literal",
      description: "An email address.",
      placeholder: "e.g. info@example.org",
      rdfProperty: "foaf:mbox",
    }),
    homepage: z.string().optional().register(editorMetadataRegistry, {
      label: "Homepage",
      component: "input",
      valueType: "literal",
      description: "Homepage of the agent.",
      placeholder: "https://...",
      rdfProperty: "foaf:homepage",
    }),
    resource: z.string().optional().register(editorMetadataRegistry, {
      label: "Resource",
      component: "input",
      valueType: "literal",
      description: "A URI identifying the agent.",
      placeholder: "https://...",
      rdfProperty: "@id",
    }),
  });

export const createContactPointObjectSchema = () =>
  z.object({
    type: z
      .enum(["Kind", "Individual", "Organization"])
      .optional()
      .register(editorMetadataRegistry, {
        label: "Type",
        component: "select",
        valueType: "literal",
        description: "The kind of contact.",
        rdfProperty: "@type",
        options: [
          { label: "Kind", value: "Kind" },
          { label: "Individual", value: "Individual" },
          { label: "Organization", value: "Organization" },
        ],
      } satisfies EditorMetadata),
    name: z.string().optional().register(editorMetadataRegistry, {
      label: "Full Name",
      component: "input",
      valueType: "literal",
      description: "The name of the organization or person.",
      placeholder: "e.g. Statistisches Bundesamt",
      rdfProperty: "vcard:fn",
    }),
    address: z.string().optional().register(editorMetadataRegistry, {
      label: "Address",
      component: "input",
      valueType: "literal",
      description: "A postal address.",
      placeholder: "e.g. 111 Lake Drive, Australia",
      rdfProperty: "vcard:hasAddress",
    }),
    email: z.string().optional().register(editorMetadataRegistry, {
      label: "Email",
      component: "input",
      valueType: "literal",
      description: "A contact email address.",
      placeholder: "e.g. info@example.org",
      rdfProperty: "vcard:hasEmail",
    }),
    telephone: z.string().optional().register(editorMetadataRegistry, {
      label: "Telephone",
      component: "input",
      valueType: "literal",
      description: "A contact telephone.",
      placeholder: "e.g. +61755555555",
      rdfProperty: "vcard:hasTelephone",
    }),
    resource: z.string().optional().register(editorMetadataRegistry, {
      label: "Resource",
      component: "input",
      valueType: "literal",
      description: "A URI identifying the contact point.",
      placeholder: "https://...",
      rdfProperty: "@id",
    }),
  });

export const createDateRangeObjectSchema = () =>
  z.object({
    gte: createTemporalSchema({
      label: "Start",
      component: "temporal",
      valueType: "temporal",
      description: "Start of the period.",
      placeholder: "2009-10-10 or 2009-10-10T12:00:00Z",
      rdfProperty: "dcat:startDate",
    }),
    lte: createTemporalSchema({
      label: "End",
      component: "temporal",
      valueType: "temporal",
      description: "End of the period.",
      placeholder: "2010-10-10 or 2010-10-10T12:00:00Z",
      rdfProperty: "dcat:endDate",
    }),
  });

export const createPageObjectSchema = () =>
  z.object({
    resource: z.string().optional().register(editorMetadataRegistry, {
      label: "Resource",
      component: "input",
      valueType: "literal",
      description: "The URI of the document.",
      placeholder: "https://...",
      rdfProperty: "@id",
    }),
    title: createMultilingualSchema(false, {
      label: "Title",
      component: "multilingual-input",
      valueType: "multiLang",
      description: "The title of the document.",
      placeholder: "e.g. Documentation",
      rdfProperty: "dct:title",
    }),
    description: createMultilingualSchema(false, {
      label: "Description",
      component: "multilingual-input",
      valueType: "multiLang",
      description: "A description of the document.",
      placeholder: "e.g. API documentation",
      rdfProperty: "dct:description",
    }),
    format: z.string().optional().register(editorMetadataRegistry, {
      label: "Format",
      component: "input",
      valueType: "literal",
      description: "The file format URI of the document.",
      placeholder: "https://...",
      rdfProperty: "dct:format",
    }),
  });

export const createAdmsIdentifierObjectSchema = () =>
  z.object({
    identifier: z.string().optional().register(editorMetadataRegistry, {
      label: "Identifier",
      component: "input",
      valueType: "literal",
      description: "The identifier value.",
      placeholder: "e.g. 10.1234/5678",
      rdfProperty: "skos:notation",
    }),
    scheme: z.string().optional().register(editorMetadataRegistry, {
      label: "Scheme",
      component: "input",
      valueType: "literal",
      description: "The URI of the identifier scheme.",
      placeholder: "e.g. http://purl.org/spar/datacite/doi",
      rdfProperty: "@type",
    }),
    resource: z.string().optional().register(editorMetadataRegistry, {
      label: "Resource",
      component: "input",
      valueType: "literal",
      description: "A URI identifying the identifier.",
      placeholder: "https://...",
      rdfProperty: "@id",
    }),
  });

export const createLabeledResourceObjectSchema = () =>
  z.object({
    resource: z.string().optional().register(editorMetadataRegistry, {
      label: "Resource",
      component: "input",
      valueType: "literal",
      description: "A URI for the referenced resource.",
      placeholder: "https://...",
      rdfProperty: "@id",
    }),
    label: z.string().optional().register(editorMetadataRegistry, {
      label: "Label",
      component: "input",
      valueType: "literal",
      description: "A label, used when no resource URI is given.",
      placeholder: "e.g. Conforms To",
      rdfProperty: "rdfs:label",
    }),
  });
