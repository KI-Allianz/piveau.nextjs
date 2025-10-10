"use client";

import React, { useCallback, useMemo, useState } from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useLocale} from "@/hooks/useLocale";
import {Card, CardContent, CardDescription} from "@/components/ui/card";
import {Dataset} from "@/lib/utils";

type ApiResponse =
  | { response?: string; [k: string]: any }
  | string
  | null;

type Props = {
  dataset: Dataset;
  className?: string;
};

export default function DatasetDetailsChatbot({ dataset, className }: Props) {
  const [userInput, setUserInput] = useState("");
  const {translations} = useLocale()
  const [response, setResponse] = useState<ApiResponse>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formattedResponse = useMemo(() => {
    if (!response) return "";
    if (typeof response === "object" && "response" in response) {
      const raw = String((response as any).response ?? "");
      return raw
        .replace(/\n/g, "<br>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    }
    return typeof response === "string" ? response : JSON.stringify(response);
  }, [response]);

  const submitQuestion = useCallback(
    async (ds: Dataset) => {
      if (!userInput.trim() || isLoading) return;

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("https://ask.ki-allianz.de/metadataassistant/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_input: userInput,
            json_data: JSON.stringify(ds),
          }),
        });

        if (!res.ok) {
          const maybeJson = await res.json().catch(() => null);
          const detail = (maybeJson as any)?.detail || res.statusText || `HTTP ${res.status}`;
          throw new Error(detail);
        }

        const data = (await res.json()) as ApiResponse;
        setResponse(data);
        // console.log("API Response:", data);
      } catch (e: any) {
        setError("Error: " + (e?.message ?? "Unknown error"));
        setResponse(null);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, userInput]
  );

  return (
    <div className="space-y-2">
      <h5 className="text-sm font-medium text-neutral-700">
        {translations.dataset.assistant.header}
      </h5>
      <div className="flex w-full">
        <Input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submitQuestion(dataset).then();
          }}
          placeholder={translations.dataset.assistant.placeholder}
          className="flex-1 h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus-visible:ring-0 rounded-r-none"
        />

        <Button
          onClick={() => submitQuestion(dataset)}
          disabled={isLoading || !userInput.trim()}
          className="inline-flex items-center justify-center h-10 whitespace-nowrap rounded-md bg-[var(--main-accent)] text-sm font-medium text-white shadow-sm transition-colors hover:bg-[var(--main-accent)]/90 disabled:cursor-not-allowed disabled:opacity-60 rounded-l-none px-6"
        >
          {isLoading && (
            <svg
              className="mr-2 h-4 w-4 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}
          {isLoading ? translations.dataset.assistant.processing : translations.dataset.assistant.ask}
        </Button>
      </div>

      {/* Answer */}
      {response && (
        <Card className="pt-3">
          <CardContent>
            <h3 className="text-lg font-bold">
              {translations.dataset.assistant.answer}
            </h3>
            <CardDescription>
              <p
                className="[&>strong]:font-semibold text-lg"
                dangerouslySetInnerHTML={{ __html: formattedResponse }}
              />
            </CardDescription>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <div
          className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}
