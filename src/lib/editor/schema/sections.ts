import { DatasetFormValues } from "./dataset";
import { FormSection } from "./types";

export const formSections = {
  identification: {
    title: "Identification",
    description: "Basic identification information for the dataset.",
    keys: ["id", "identifier"],
  },
  basicInfo: {
    title: "Basic Information",
    description: "General information about the dataset.",
    keys: [
      "title",
      "description",
      "keywords",
      "publisher",
      "contactPoint",
      "issued",
      "modified",
    ],
  },
  versioning: {
    title: "Versioning",
    description: "Version information and relationships between versions.",
    hidden: true,
    keys: [
      "versionInfo",
      "versionNotes",
      "hasVersion",
      "isVersionOf",
      "isReferencedBy",
      "admsIdentifier",
    ],
  },
  relations: {
    title: "Relations",
    description: "Related resources and provenance.",
    hidden: true,
    keys: [
      "relation",
      "source",
      "qualifiedAttribution",
      "applicableLegislation",
      "sample",
      "wasGeneratedBy",
      "provenance",
      "conformsTo",
      "landingPage",
      "page",
    ],
  },
  coverage: {
    title: "Coverage Resolution",
    description: "Temporal and spatial coverage and resolution.",
    hidden: true,
    keys: ["temporal", "temporalResolution", "spatialResolutionInMeters"],
  },
  distributions: {
    title: "Distributions",
    description: "Files that make the dataset available.",
    keys: ["distributions"],
  },
} as Record<string, FormSection<keyof DatasetFormValues>>;

/**
 * Section keys that should be expanded by default. Hidden sections are
 * collapsed so they don't overwhelm mainstream users.
 */
export const defaultOpenSectionKeys = Object.entries(formSections)
  .filter(([, section]) => !section.hidden)
  .map(([key]) => key);
