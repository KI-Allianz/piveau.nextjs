"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import {
  datasetFormSchema,
  formSections,
} from "@/lib/editor/DatasetFormSchema";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { CheckCircle2, AlertCircle } from "lucide-react"; // Icons for check/error
import DynamicField from "./DynamicField";

export function DynamicSectionElement({
  sectionKey,
}: {
  sectionKey: keyof typeof formSections;
}) {
  const { trigger } = useFormContext();
  const section = formSections[sectionKey];

  const [hasValidated, setHasValidated] = React.useState(false);
  const [hasErrors, setHasErrors] = React.useState(false);

  const validateSection = async () => {
    // validated only the fields in this section
    const isValid = await trigger(section.keys as any);
    setHasValidated(true);
    setHasErrors(!isValid);
  };

  return (
    <AccordionItem value={sectionKey}>
      <AccordionTrigger
        onClick={() => {
          validateSection();
        }}
      >
        <div className="flex items-center justify-between w-full pr-4">
          <div>
            <h2 className="text-lg font-semibold">{section.title}</h2>
            <p className="text-sm text-muted-foreground">
              {section.description}
            </p>
          </div>

          {hasValidated && (
            <div className="flex items-center hover:no-underline!">
              {hasErrors ? (
                <span className="flex items-center text-destructive text-sm gap-1 font-medium">
                  <AlertCircle className="w-4 h-4" />
                  Needs attention
                </span>
              ) : (
                <span className="flex items-center text-emerald-600 text-sm gap-1 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Complete
                </span>
              )}
            </div>
          )}
        </div>
      </AccordionTrigger>

      <AccordionContent>
        <div className="space-y-6 pt-2">
          {section.keys.map((key) => (
            <DynamicField
              key={key}
              name={key}
              schema={datasetFormSchema.shape[key]}
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
