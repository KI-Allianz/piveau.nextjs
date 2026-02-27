"use client";

import { SupportedTheme } from ".";
import { HammerHaiFunctions } from "./hammerhai/client";
import { KiAllianzFunctions } from "./ki-allianz/client";
import { ProjectClientTheme } from "./types";

const functions: Record<SupportedTheme, ProjectClientTheme> = {
  hammerhai: HammerHaiFunctions,
  kiallianz: KiAllianzFunctions,
};

export function getClientTheme(themeId: SupportedTheme) {
  return functions[themeId];
}
