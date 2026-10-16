"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  buildDatasetFormDefaults,
  datasetFormSchema,
  DatasetFormValues,
  defaultOpenSectionKeys,
  formSections,
} from "@/lib/editor/DatasetFormSchema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DynamicSectionElement } from "./DynamicSectionElement";
import { EditorContext } from "./EditorContext";
import { Accordion } from "../ui/accordion";
import { generateDatasetJsonLd } from "@/lib/editor/buildJsonLD";
import { useMemo } from "react";
import { trpc } from "@/app/_trpc/client";

interface DatasetFormProps {
  currentDraft: Partial<DatasetFormValues> | null;
  catalogueId: string;
}

export function DatasetForm({ currentDraft, catalogueId }: DatasetFormProps) {
  const defaultValues = useMemo(
    () => buildDatasetFormDefaults(currentDraft),
    [currentDraft],
  );

  const form = useForm<DatasetFormValues>({
    resolver: zodResolver(datasetFormSchema),
    defaultValues,
  });
  const createDraft = trpc.dataset.draft.create.useMutation();

  function onSubmit(data: DatasetFormValues) {
    const jsonLd = generateDatasetJsonLd(data);
    console.log("Draft Payload:", data);
    console.log("JSON-LD Output:", jsonLd);
    createDraft.mutate({
      id: data.id,
      catalogueId: catalogueId,
      dataset: jsonLd,
    });
  }

  return (
    <EditorContext.Provider value={{ catalogueId }}>
      <FormProvider {...form}>
        <Card className="max-w-3xl mx-auto my-8">
          <CardHeader>
            <CardTitle>Create Dataset Draft</CardTitle>
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
                  onClick={() => form.reset()}
                >
                  Reset
                </Button>
                <Button type="submit">Create Draft</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </FormProvider>
    </EditorContext.Provider>
  );
}
