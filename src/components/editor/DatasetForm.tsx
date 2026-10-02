"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  datasetFormDefaults,
  datasetFormSchema,
  DatasetFormValues,
  formSections,
} from "@/lib/editor/DatasetFormSchema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DynamicSectionElement } from "./DynamicSectionElement";
import { Accordion } from "../ui/accordion";
import { buildJsonLd } from "@/lib/editor/buildJsonLD";

export function DatasetForm() {
  const form = useForm<DatasetFormValues>({
    resolver: zodResolver(datasetFormSchema),
    defaultValues: datasetFormDefaults,
  });

  function onSubmit(data: DatasetFormValues) {
    const jsonLd = buildJsonLd(data);
    console.log("Draft Payload:", data);
    console.log("JSON-LD Output:", jsonLd);
  }

  return (
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
            <Accordion type="multiple" defaultValue={Object.keys(formSections)}>
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
  );
}
