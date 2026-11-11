"use client";

import { CheckCircle2, EyeOff, FileText, Globe, Trash2 } from "lucide-react";

import HtmlSnippet from "@/components/HTMLSnippet";
import { useLocale } from "@/hooks/useLocale";
import { DraftSummary } from "@/lib/editor/parseJsonLD";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type PendingPublication = "publish" | "unpublish";

interface DraftCardProps {
  draft: DraftSummary;
  selected: boolean;
  isLoading?: boolean;
  pendingPublication?: PendingPublication | null;
  onSelect: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
  onDelete: () => void;
}

export function DraftCard({
  draft,
  selected,
  isLoading = false,
  pendingPublication = null,
  onSelect,
  onPublish,
  onUnpublish,
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
          "group flex min-w-0 flex-1 cursor-pointer items-start gap-4 rounded-xl border bg-card p-4 text-left transition-all duration-200",
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
          <div className="flex min-w-0 items-center gap-2">
            <span className="min-w-0 flex-1 truncate font-medium" title={title}>
              {title}
            </span>
            {/* Draft badge hidden for now
            <Badge variant="secondary" className="shrink-0">
              Draft
            </Badge>
            */}
          </div>
          {description && (
            <HtmlSnippet
              html={description}
              className="line-clamp-2 break-words text-sm text-muted-foreground [&_*]:m-0 [&_*]:inline"
            />
          )}
          <span
            className="w-full min-w-0 truncate text-xs text-muted-foreground/70"
            title={draft.id}
          >
            {draft.id}
          </span>
        </div>

        {isLoading ? (
          <Spinner className="mt-1 size-4 shrink-0 text-muted-foreground" />
        ) : selected ? (
          <CheckCircle2 className="mt-1 size-5 shrink-0 text-primary" />
        ) : null}
      </button>

      <div className="flex shrink-0 items-center gap-1 self-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Publish dataset"
          title="Publish dataset"
          onClick={onPublish}
          disabled={!!pendingPublication}
          className="text-muted-foreground hover:text-primary"
        >
          {pendingPublication === "publish" ? (
            <Spinner className="size-4" />
          ) : (
            <Globe className="size-4" />
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Unpublish dataset"
          title="Unpublish dataset"
          onClick={onUnpublish}
          disabled={!!pendingPublication}
          className="text-muted-foreground hover:text-primary"
        >
          {pendingPublication === "unpublish" ? (
            <Spinner className="size-4" />
          ) : (
            <EyeOff className="size-4" />
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Delete dataset"
          title="Delete dataset"
          onClick={onDelete}
          disabled={!!pendingPublication}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}
