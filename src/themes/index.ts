import { HammerTheme } from "./hammerhai";
import { KiAllianzTheme } from "./ki-allianz";
import { ProjectTheme } from "./types";

const themeMap: Record<string, ProjectTheme> = {
  hammerhai: HammerTheme,
  kiallianz: KiAllianzTheme,
};

export function getTheme(): ProjectTheme {
  const projectId = process.env.NEXT_PUBLIC_DEFAULT_THEME || "kiallianz";
  return themeMap[projectId] || KiAllianzTheme;
}
