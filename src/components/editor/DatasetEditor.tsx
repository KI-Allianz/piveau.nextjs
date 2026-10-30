"use client";

import { useEffect, useState, type ReactNode } from "react";
import { signIn } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, RefreshCw } from "lucide-react";

import { trpc } from "@/app/_trpc/client";
import { AUTH_DISABLED } from "@/lib/auth-config";
import { DatasetFormValues } from "@/lib/editor/schema";
import { useLocale } from "@/hooks/useLocale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatasetForm } from "./DatasetForm";
import { DraftList } from "./DraftList";

interface EditorNoticeProps {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: ReactNode;
}

function EditorNotice({ icon, title, message, action }: EditorNoticeProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center">
        {icon ?? <AlertCircle className="size-6 text-muted-foreground" />}
        <p className="font-medium text-foreground">{title}</p>
        {message && (
          <p className="max-w-md text-sm text-muted-foreground">{message}</p>
        )}
        {action && <div className="mt-2">{action}</div>}
      </CardContent>
    </Card>
  );
}

export default function DatasetEditor() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useLocale();

  const [currentDraft, setCurrentDraft] =
    useState<Partial<DatasetFormValues> | null>(null);
  const [draftVersion, setDraftVersion] = useState(0);
  const [selectedCatalogueId, setSelectedCatalogueId] = useState<string | null>(
    searchParams.get("catalogueId"),
  );

  const catalogues = trpc.catalogue.mine.useQuery(undefined, {
    enabled: !AUTH_DISABLED,
    staleTime: 60_000,
  });

  const catalogueParam = searchParams.get("catalogueId");

  useEffect(() => {
    if (catalogueParam) {
      setSelectedCatalogueId(catalogueParam);
    }
  }, [catalogueParam]);

  const availableCatalogues = catalogues.data ?? [];

  const catalogueId = AUTH_DISABLED
    ? (catalogueParam ?? "catalog1")
    : selectedCatalogueId &&
        availableCatalogues.some((c) => c.id === selectedCatalogueId)
      ? selectedCatalogueId
      : availableCatalogues[0]?.id;

  const handleDraftChange = (draft: Partial<DatasetFormValues> | null) => {
    setCurrentDraft(draft);
    setDraftVersion((version) => version + 1);
  };

  const handleCatalogueChange = (id: string) => {
    setSelectedCatalogueId(id);
    setCurrentDraft(null);
    setDraftVersion((version) => version + 1);

    const params = new URLSearchParams(searchParams.toString());
    params.set("catalogueId", id);
    params.delete("draftId");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (!AUTH_DISABLED && catalogues.isPending) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-96 w-full max-w-3xl mx-auto" />
      </div>
    );
  }

  if (!AUTH_DISABLED && catalogues.isError) {
    const unauthorized =
      catalogues.error.data?.httpStatus === 401 ||
      catalogues.error.data?.code === "UNAUTHORIZED";

    if (unauthorized) {
      return (
        <EditorNotice
          title="Sign in required"
          message="Sign in to view and create dataset drafts."
          action={
            <Button
              onClick={() =>
                signIn("keycloak", {
                  callbackUrl: `/${locale}/editor`,
                })
              }
            >
              Sign in
            </Button>
          }
        />
      );
    }

    return (
      <EditorNotice
        title="Could not load your catalogues"
        message={
          catalogues.error.message ||
          "Fetching the catalogue permissions from Keycloak failed."
        }
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => catalogues.refetch()}
          >
            <RefreshCw className="size-4" />
            Try again
          </Button>
        }
      />
    );
  }

  if (!catalogueId) {
    return (
      <EditorNotice
        title="No catalogue permissions"
        message="Your user is not assigned to a catalogue yet. Please contact an administrator."
      />
    );
  }

  return (
    <div>
      {availableCatalogues.length > 1 && (
        <div className="mb-4 flex items-center gap-3">
          <label
            htmlFor="catalogue-select"
            className="text-sm font-medium text-muted-foreground"
          >
            Catalogue
          </label>
          <Select value={catalogueId} onValueChange={handleCatalogueChange}>
            <SelectTrigger id="catalogue-select" className="w-64">
              <SelectValue placeholder="Select a catalogue" />
            </SelectTrigger>
            <SelectContent>
              {availableCatalogues.map((catalogue) => (
                <SelectItem key={catalogue.id} value={catalogue.id}>
                  {catalogue.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <DraftList
        key={catalogueId}
        setCurrentDraft={handleDraftChange}
        catalogueId={catalogueId}
      />
      <DatasetForm
        key={`${catalogueId}-${draftVersion}`}
        currentDraft={currentDraft}
        catalogueId={catalogueId}
      />
    </div>
  );
}
