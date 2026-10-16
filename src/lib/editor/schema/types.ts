export type EditorComponentType =
  | "input"
  | "multilingual-input"
  | "select"
  | "checkbox"
  | "textarea"
  | "temporal"
  | "list"
  | "repeatable-object"
  | "repeatable-multilingual"
  | "object"
  | "distributions";

/**
 * Serialization strategy for a field. Leaf types are implemented as codecs in
 * `../codecs`; `object` (and any array schema) is handled generically by the
 * dispatcher.
 */
export type FieldValueType =
  | "literal"
  | "multiLang"
  | "multiLangList"
  | "temporal"
  | "typedLiteral"
  | "resource"
  | "list"
  | "labeledResource"
  | "skosConcept"
  | "agent"
  | "contactPoint"
  | "dateRange"
  | "page"
  | "admsIdentifier"
  | "object";

export type EditorMetadata = {
  label: string;
  component: EditorComponentType;
  /** Serialization strategy (see `../codecs`). */
  valueType: FieldValueType;
  description?: string;
  placeholder?: string;
  rdfProperty: string;
  rdfType?: string;
  /** xsd datatype IRI for `typedLiteral` values. */
  dataType?: string;
  /** Vocabulary id (see `@/lib/vocabularies`) for `skosConcept` values. */
  vocabulary?: string;
  /** Options for `select` components. */
  options?: { label: string; value: string }[];
};

/**
 * A group of form fields rendered as an accordion section. `keys` is generic so
 * that `FormSection` can be declared without importing `DatasetFormValues`.
 */
export interface FormSection<K extends string = string> {
  title: string;
  description: string;
  hidden?: boolean;
  keys: K[];
}
