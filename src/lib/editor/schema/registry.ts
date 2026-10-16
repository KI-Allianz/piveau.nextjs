import * as z from "zod";

import { EditorMetadata } from "./types";

/**
 * Metadata registry keyed by schema object identity. Every editor field must
 * register its `EditorMetadata` here so the serializer/parser/UI can look it up.
 */
export const editorMetadataRegistry = z.registry<EditorMetadata>();
