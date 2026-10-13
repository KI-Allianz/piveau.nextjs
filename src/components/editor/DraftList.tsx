"use client";

import { trpc } from "@/app/_trpc/client";
import { useLocale } from "@/hooks/useLocale";
import { DatasetFormValues } from "@/lib/editor/DatasetFormSchema";
import { parseDatasetJsonLd } from "@/lib/editor/parseJsonLD";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertCircle, Inbox, RefreshCw } from "lucide-react";

import { DraftCard } from "./DraftCard";
import DraftCardSkeleton from "./DraftCardSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  const { locale } = useLocale();

  const getDrafts = trpc.dataset.draft.getAll.useQuery({ id: catalogueId });

  const [draftId, setDraftId] = useState<string | null>(null);
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
    </div>
  );
}
