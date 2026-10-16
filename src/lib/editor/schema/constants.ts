export const editorLanguages = ["en", "de"];

export const editorLanguageLabels: Record<string, string> = {
  en: "English",
  de: "German",
};

export const requiredEditorLanguages = ["en"];

export const XSD = "http://www.w3.org/2001/XMLSchema#";

export const temporalRegex = {
  gYear: /^\d{4}$/,
  gYearMonth: /^\d{4}-\d{2}$/,
  date: /^\d{4}-\d{2}-\d{2}$/,
  dateTime: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/,
};
