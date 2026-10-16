"use client";

import { createContext, useContext } from "react";

interface EditorContextValue {
  catalogueId: string;
}

export const EditorContext = createContext<EditorContextValue>({
  catalogueId: "",
});

export function useEditorContext() {
  return useContext(EditorContext);
}
