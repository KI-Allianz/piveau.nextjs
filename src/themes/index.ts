import { HammerTheme } from "./hammerhai";
import { KiAllianzTheme } from "./ki-allianz";
import { ProjectTheme } from "./types";

export const SupportedThemes = ["hammerhai", "kiallianz"];
export type SupportedTheme = (typeof SupportedThemes)[number];
export const DefaultTheme: SupportedTheme =
  (process.env.NEXT_PUBLIC_DEFAULT_THEME as SupportedTheme) ?? "kiallianz";
const THEME_SWITCHING_ENABLED =
  process.env.NEXT_PUBLIC_DISABLE_THEME_SWITCHING !== "true";

const themeMap: Record<SupportedTheme, ProjectTheme> = {
  hammerhai: HammerTheme,
  kiallianz: KiAllianzTheme,
};

export function getTheme(themeId: string | null): ProjectTheme {
  if (!THEME_SWITCHING_ENABLED) {
    return themeMap[DefaultTheme] || KiAllianzTheme;
  }

  if (themeId && SupportedThemes.includes(themeId as SupportedTheme)) {
    console.log(`Selected theme: ${JSON.stringify(themeMap)}`);
    return themeMap[themeId as SupportedTheme];
  }

  return themeMap[DefaultTheme] || KiAllianzTheme;
}
