import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { parse, parseISO } from "date-fns";

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

export const aiModelFormats = ["ONNX"];

export type UrlCollection = {
  SEARCH: string;
  REPO: string;
};
