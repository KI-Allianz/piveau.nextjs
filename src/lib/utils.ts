import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { parse, parseISO } from "date-fns";
import {StandardSchemaV1} from "@standard-schema/spec";
import {schemaDataset} from "@piveau/sdk-core/model";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseDate(dateString: string | undefined | null): Date | null {
  if (!dateString) {
    return new Date("2000-01-01");
  }

  let date = parseISO(dateString);
  if (!isNaN(date.getTime())) {
    return date;
  }

  return parse(dateString, "yyyy-MM-dd", new Date());
}

export function formatString(str: string, ...replacements: string[]): string {
  return str.replace(/{(\d+)}/g, function(match, number) {
    return typeof replacements[number] != "undefined"
      ? replacements[number]
      : match;
  });
}

export type Dataset = StandardSchemaV1.InferOutput<typeof schemaDataset>

export const aiModelFormats = ["ONNX"];
export const aiModelKeywords = ["ai-model"];

export function isAIModel(dataset: Dataset): boolean {

  if (dataset.keywords && dataset.keywords?.map((keyword) => keyword.id)
    .filter((keyword) => keyword && aiModelKeywords.includes(keyword))?.length > 0) {
    return true
  }
  else if (dataset.distributions && dataset.distributions?.map((dist) => dist.format?.id)
    .filter((format) => format && aiModelFormats.includes(format))?.length > 0) {
    return true
  }

  return false
}

export type UrlCollection = {
  SEARCH: string;
  REPO: string;
};

export enum SortMode {
  LAST_MODIFIED = "modified+desc, relevance+desc, title.en+asc",
  RELEVANCE = "relevance+desc, modified+desc, title.en+asc",
  NAME_ASC = "title.en+asc, relevance+desc, modified+desc",
  NAME_DESC = "title.en+desc, relevance+desc, modified+desc",
  LAST_ISSUED = "issued+desc, relevance+desc, title.en+asc",
}
export const sortModeTypes = {
  [SortMode.LAST_MODIFIED]: "desc",
  [SortMode.RELEVANCE]: "desc",
  [SortMode.NAME_ASC]: "asc",
  [SortMode.NAME_DESC]: "desc",
  [SortMode.LAST_ISSUED]: "desc",
}