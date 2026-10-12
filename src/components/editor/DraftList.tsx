"use client";

import { trpc } from "@/app/_trpc/client";
import { useLocale } from "@/hooks/useLocale";
import { DatasetFormValues } from "@/lib/editor/DatasetFormSchema";
import { parseDatasetJsonLd } from "@/lib/editor/parseJsonLD";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DraftListProps {
  currentDraft: Partial<DatasetFormValues> | null;
  setCurrentDraft: (draftId: Partial<DatasetFormValues> | null) => void;
  catalogueId: string;
}

export function DraftList({
  currentDraft,
  setCurrentDraft,
  catalogueId,
}: DraftListProps) {
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

  // useEffect(() => {
  //   if (getDrafts.data && getDrafts.data.length > 0 && !draftId) {
  //     setDraftId(getDrafts.data[0]);
  //   }
  //   if (getDraft.data) {
  //     setCurrentDraft(parseDatasetJsonLd(getDraft.data));
  //   }
  // }, [getDrafts.data, draftId]);

  useEffect(() => {
    if (getDraft.data) {
      setCurrentDraft(parseDatasetJsonLd(getDraft.data));
    }
  }, [getDraft.data]);

  return (
    <div className="max-w-3xl mx-auto my-8">
      <h1 className="text-2xl font-bold mb-4">Drafts</h1>
      {getDrafts.isLoading && <p>Loading drafts...</p>}
      {getDrafts.isError && (
        <p className="text-red-500">
          Error loading drafts: {getDrafts.error.message}
        </p>
      )}
      {getDrafts.data && getDrafts.data.length === 0 && <p>No drafts found.</p>}
      {getDrafts.data && getDrafts.data.length > 0 && (
        <ul className="space-y-2">
          {getDrafts.data.map((draft) => (
            <li
              key={draft}
              className="p-4 border rounded-lg bg-muted/10"
              onClick={() => setDraftId(draft)}
            >
              <h2 className="text-lg font-semibold">{draft}</h2>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Draft Details</h2>
        {getDraft.isLoading && <p>Loading draft details...</p>}
        {getDraft.isError && (
          <p className="text-red-500">
            Error loading draft details: {getDraft.error.message}
          </p>
        )}
      </div>
    </div>
  );
}
