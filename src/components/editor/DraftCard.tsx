"use client";

import { CheckCircle2, FileText, Trash2 } from "lucide-react";

import HtmlSnippet from "@/components/HTMLSnippet";
import { useLocale } from "@/hooks/useLocale";
import { DraftSummary } from "@/lib/editor/parseJsonLD";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface DraftCardProps {
  draft: DraftSummary;
  selected: boolean;
  isLoading?: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function DraftCard({
  draft,
  selected,
  isLoading = false,
  onSelect,
  onDelete,
}: DraftCardProps) {
  const { translateDict } = useLocale();

  const title = draft.title
    ? translateDict(draft.title as Record<string, string>)
    : draft.id;
  const description = draft.description
    ? translateDict(draft.description as Record<string, string>)
    : undefined;

  return (
    <div className="flex items-stretch gap-2">
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={cn(
          "group flex flex-1 cursor-pointer items-start gap-4 rounded-xl border bg-card p-4 text-left transition-all duration-200",
          "hover:border-primary hover:bg-muted/40",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          selected && "border-primary bg-muted/40 ring-2 ring-primary/40",
        )}
      >
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/40 text-muted-foreground transition-colors",
            selected && "border-primary/40 text-primary",
          )}
        >
          <FileText className="size-5" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium">{title}</span>
            {/* Draft badge hidden for now
            <Badge variant="secondary" className="shrink-0">
              Draft
            </Badge>
            */}
          </div>
          {description && (
            <HtmlSnippet
              html={description}
              className="line-clamp-2 text-sm text-muted-foreground [&_*]:m-0 [&_*]:inline"
            />
          )}
          <span className="truncate text-xs text-muted-foreground/70">
            {draft.id}
          </span>
        </div>

        {isLoading ? (
          <Spinner className="mt-1 size-4 shrink-0 text-muted-foreground" />
        ) : selected ? (
          <CheckCircle2 className="mt-1 size-5 shrink-0 text-primary" />
        ) : null}
      </button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Delete dataset"
        title="Delete dataset"
        onClick={onDelete}
        className="self-center text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
