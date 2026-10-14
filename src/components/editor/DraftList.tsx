"use client";

import { trpc } from "@/app/_trpc/client";
import { useLocale } from "@/hooks/useLocale";
import { DatasetFormValues } from "@/lib/editor/DatasetFormSchema";
import { DraftSummary, parseDatasetJsonLd } from "@/lib/editor/parseJsonLD";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertCircle, Inbox, RefreshCw, Trash2 } from "lucide-react";

import { DraftCard } from "./DraftCard";
import DraftCardSkeleton from "./DraftCardSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

interface DraftListProps {
  setCurrentDraft: (draft: Partial<DatasetFormValues> | null) => void;
  catalogueId: string;
}

interface ErrorStateProps {
  title: string;
  message?: string;
  onRetry: () => void;
}

function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  return (
    <Card className="border-destructive/40">
      <CardContent className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
        <div className="flex flex-1 flex-col gap-1">
          <p className="font-medium text-foreground">{title}</p>
          {message && (
            <p className="text-sm text-muted-foreground">{message}</p>
          )}
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-fit"
            onClick={onRetry}
          >
            <RefreshCw className="size-4" />
            Try again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground">
        <Inbox className="size-6" />
        <p className="font-medium text-foreground">No drafts yet</p>
        <p className="text-sm">Create a dataset draft to see it here.</p>
      </CardContent>
    </Card>
  );
}

export function DraftList({ setCurrentDraft, catalogueId }: DraftListProps) {
  const router = useRouter();
  const { locale, translateDict } = useLocale();

  const getDrafts = trpc.dataset.draft.getAll.useQuery({ id: catalogueId });
  const deleteDraft = trpc.dataset.draft.delete.useMutation();

  const [draftId, setDraftId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<DraftSummary | null>(null);

  const getDraft = trpc.dataset.draft.get.useQuery(
    { id: draftId || "", catalogueId: catalogueId },
    {
      enabled: !!draftId,
    },
  );

  useEffect(() => {
    const error = getDrafts.error || getDraft.error;
    if (error?.data?.httpStatus === 401 || error?.data?.httpStatus === 403) {
      router.push(
        `/auth/signin?callbackUrl=/${locale}/editor?catalogueId=${catalogueId}&draftId=${draftId}`,
      );
    }
  }, [getDrafts.error, getDraft.error, locale]);

  useEffect(() => {
    if (getDraft.data) {
      setCurrentDraft(parseDatasetJsonLd(getDraft.data));
    }
  }, [getDraft.data]);

  const drafts = getDrafts.data;

  const pendingDeleteTitle = pendingDelete?.title
    ? translateDict(pendingDelete.title as Record<string, string>)
    : pendingDelete?.id;

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;

    try {
      await deleteDraft.mutateAsync({
        id: pendingDelete.id,
        catalogueId,
      });

      if (draftId === pendingDelete.id) {
        setDraftId(null);
        setCurrentDraft(null);
      }

      setPendingDelete(null);
      await getDrafts.refetch();
    } catch {
      // Error is surfaced inside the dialog; keep it open for a retry.
    }
  };

  return (
    <div className="mx-auto my-8 max-w-3xl">
      <div className="mb-4 flex items-baseline justify-between">
        <h1 className="text-2xl font-bold">Drafts</h1>
        {drafts && drafts.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {drafts.length} {drafts.length === 1 ? "draft" : "drafts"}
          </span>
        )}
      </div>

      {getDrafts.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <DraftCardSkeleton key={index} />
          ))}
        </div>
      ) : getDrafts.isError ? (
        <ErrorState
          title="Couldn't load drafts"
          message={getDrafts.error.message}
          onRetry={() => getDrafts.refetch()}
        />
      ) : drafts && drafts.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="space-y-2">
          {drafts?.map((draft) => (
            <li key={draft.id}>
              <DraftCard
                draft={draft}
                selected={draftId === draft.id}
                isLoading={draftId === draft.id && getDraft.isFetching}
                onSelect={() => setDraftId(draft.id)}
                onDelete={() => setPendingDelete(draft)}
              />
            </li>
          ))}
        </ul>
      )}

      {draftId && getDraft.isFetching && (
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner />
          Loading draft…
        </div>
      )}

      {draftId && getDraft.isError && (
        <div className="mt-4">
          <ErrorState
            title="Couldn't load draft"
            message={getDraft.error.message}
            onRetry={() => getDraft.refetch()}
          />
        </div>
      )}

      <Dialog
        open={!!pendingDelete}
        onOpenChange={(open) => {
          if (!open && !deleteDraft.isPending) {
            setPendingDelete(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete dataset</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{pendingDeleteTitle}"? This
              also removes its files and cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {deleteDraft.isError && (
            <p className="text-sm text-destructive">
              {deleteDraft.error.message}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={deleteDraft.isPending}
              onClick={() => setPendingDelete(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteDraft.isPending}
              onClick={handleConfirmDelete}
            >
              {deleteDraft.isPending ? (
                <Spinner />
              ) : (
                <Trash2 className="size-4" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
