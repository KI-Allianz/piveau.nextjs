import { EditorMetadata } from "../schema";
import { Prefixes } from "../prefixes";

export interface CodecContext {
  prefixes: Prefixes;
}

/**
 * A leaf codec converts a single form value to/from its JSON-LD representation.
 * Container handling (objects, arrays) lives in the dispatcher in `index.ts`.
 */
export interface FieldCodec {
  toRdf: (value: any, meta: EditorMetadata, ctx: CodecContext) => any;
  fromRdf: (value: any, meta: EditorMetadata, ctx: CodecContext) => any;
}
