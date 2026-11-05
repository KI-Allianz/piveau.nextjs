"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useMemo, useState } from "react";

import {
  buildDatasetFormDefaults,
  datasetFormSchema,
  DatasetFormValues,
  defaultOpenSectionKeys,
  formSections,
} from "@/lib/editor/schema";
import { collectFormErrors } from "@/lib/editor/formErrors";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { DynamicSectionElement } from "./DynamicSectionElement";
import { EditorContext } from "./EditorContext";
import { Accordion } from "../ui/accordion";
import { generateDatasetJsonLd } from "@/lib/editor/buildJsonLD";
import { trpc } from "@/app/_trpc/client";

interface DatasetFormProps {
  currentDraft: Partial<DatasetFormValues> | null;
  catalogueId: string;
}

export function DatasetForm({ currentDraft, catalogueId }: DatasetFormProps) {
  const isEditing = currentDraft !== null;

  const defaultValues = useMemo(
    () => buildDatasetFormDefaults(currentDraft),
    [currentDraft],
  );

  const form = useForm<DatasetFormValues>({
    resolver: zodResolver(datasetFormSchema),
    defaultValues,
  });
  const errorItems = collectFormErrors(form.formState.errors);

  const [openSections, setOpenSections] = useState<string[]>([
    ...defaultOpenSectionKeys,
  ]);

  const saveDraft = trpc.dataset.draft.create.useMutation();
  const utils = trpc.useUtils();

  function onSubmit(data: DatasetFormValues) {
    const jsonLd = generateDatasetJsonLd(data);
    console.log("Draft Payload:", data);
    console.log("JSON-LD Output:", jsonLd);
    saveDraft.mutate(
      {
        id: data.id,
        catalogueId: catalogueId,
        dataset: jsonLd,
      },
      {
        onSuccess: () => {
          void utils.dataset.draft.getAll.invalidate({ id: catalogueId });
        },
      },
    );
  }

  function revealSection(sectionKey: string | null) {
    if (!sectionKey) return;

    setOpenSections((sections) =>
      sections.includes(sectionKey) ? sections : [...sections, sectionKey],
    );

    requestAnimationFrame(() => {
      document
        .getElementById(`editor-section-${sectionKey}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <EditorContext.Provider value={{ catalogueId }}>
      <FormProvider {...form}>
        <Card className="max-w-3xl mx-auto my-8">
          <CardHeader>
            <CardTitle>
              {isEditing ? "Edit Dataset Draft" : "Create Dataset Draft"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              id="piveau-upload-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <Accordion
                type="multiple"
                value={openSections}
                onValueChange={setOpenSections}
              >
                {Object.keys(formSections).map((sectionKey) => (
                  <DynamicSectionElement
                    key={sectionKey}
                    sectionKey={sectionKey}
                  />
                ))}
              </Accordion>

              {errorItems.length > 0 && (
                <div
                  role="alert"
                  className="rounded-xl border border-destructive/40 bg-destructive/5 p-4"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                    <div className="flex-1 space-y-2">
                      <p className="text-sm font-medium text-destructive">
                        {errorItems.length === 1
                          ? "1 validation issue must be fixed before saving"
                          : `${errorItems.length} validation issues must be fixed before saving`}
                      </p>
                      <ul className="space-y-1 text-sm">
                        {errorItems.map((item) => {
                          const content = (
                            <>
                              <span className="font-medium text-foreground">
                                {item.sectionTitle} · {item.label}
                              </span>
                              <span className="text-muted-foreground">
                                {" "}
                                — {item.message}
                              </span>
                            </>
                          );

                          return (
                            <li key={`${item.path}:${item.message}`}>
                              {item.sectionKey ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    revealSection(item.sectionKey)
                                  }
                                  className="w-full rounded-sm text-left hover:underline focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                                >
                                  {content}
                                </button>
                              ) : (
                                <span>{content}</span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  disabled={saveDraft.isPending}
                  onClick={() => form.reset()}
                >
                  Reset
                </Button>
                <Button type="submit" disabled={saveDraft.isPending}>
                  {saveDraft.isPending && <Spinner />}
                  {isEditing ? "Save Draft" : "Create Draft"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </FormProvider>
    </EditorContext.Provider>
  );
}
