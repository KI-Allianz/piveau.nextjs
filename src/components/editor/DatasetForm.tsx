"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";

import {
  buildDatasetFormDefaults,
  datasetFormSchema,
  DatasetFormValues,
  defaultOpenSectionKeys,
  formSections,
} from "@/lib/editor/schema";
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
                defaultValue={defaultOpenSectionKeys}
              >
                {Object.keys(formSections).map((sectionKey) => (
                  <DynamicSectionElement
                    key={sectionKey}
                    sectionKey={sectionKey}
                  />
                ))}
              </Accordion>

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
