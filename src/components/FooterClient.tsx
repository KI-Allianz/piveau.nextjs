"use client";

import Link from "next/link";
import { GitCommitHorizontal } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import { useLocale } from "@/hooks/useLocale";
import { ThemeToggle } from "./ThemeToggle";
import { fixThemeUrl, useTheme } from "@/hooks/useTheme";
import { getClientTheme } from "@/themes/client";

const deploymentDotClasses: Record<string, string> = {
  blue: "bg-blue-500",
  green: "bg-green-500",
};

function DeploymentIndicator({ deployment }: { deployment: string }) {
  const dotClass =
    deploymentDotClasses[deployment.toLowerCase()] ?? "bg-muted-foreground/50";

  return (
    <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
      <span aria-hidden className={`size-2 rounded-full ${dotClass}`} />
      {deployment}
    </span>
  );
}

export default function FooterClient({ deployment }: { deployment: string }) {
  const { locale, translations } = useLocale();
  const theme = useTheme();
  const functions = getClientTheme(theme.id);

  const commitHash = process.env.NEXT_PUBLIC_GIT_COMMIT_HASH || "development";
  const shortHash = commitHash.slice(0, 7);

  return (
    <footer className="">
      <div className="pt-4 mx-4 justify-center flex">
        <nav className="flex flex-row items-center justify-between w-full max-w-[1440px] h-20 pt-28 pb-20">
          <Link
            className="dark:invert"
            href={fixThemeUrl(`/${locale}?theme=${theme.id}`, theme)}
          >
            <functions.components.Logo />
          </Link>

          <div className="flex flex-wrap gap-3">
            {functions.footer.buildFooterLinks(translations).map((link) => (
              <Link key={link.href} href={link.href}>
                <span className="hover:text-muted-foreground">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {theme.footer.enableThemeToggle && <ThemeToggle />}
            {theme.footer.enableLanguageSelector && <LanguageSelector />}
          </div>
        </nav>
      </div>

      <div className="mt-4 border-t border-border/60">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:justify-start">
            <span className="inline-flex items-center gap-2">
              <span className="uppercase tracking-wider">deployment</span>
              <DeploymentIndicator deployment={deployment} />
            </span>

            <span
              aria-hidden
              className="hidden h-3 w-px bg-border sm:block"
            />

            <a
              href={`https://gitlab.gwdg.de/hammerhai/data/catalog/catalog-frontend/-/commit/${commitHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono transition-colors hover:text-foreground"
            >
              <GitCommitHorizontal aria-hidden className="size-3.5" />
              {shortHash}
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 sm:justify-end">
            <span>powered by</span>
            <a
              href="https://github.com/KI-Allianz/piveau.nextjs"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              piveau-next
            </a>
            <span aria-hidden>·</span>
            <a
              href="https://gitlab.com/piveau/hub"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              piveau-hub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
