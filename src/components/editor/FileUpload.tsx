"use client";

import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { UploadCloud } from "lucide-react";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { DatasetFormValues } from "@/lib/editor/DatasetFormSchema";
import { generateDatasetJsonLd } from "@/lib/editor/buildJsonLD";
import { uploadFile, UploaderApiError } from "@/lib/repo/uploader/api";
import { buildDownloadUrl } from "@/lib/repo/uploader/paths";
import { useEditorContext } from "./EditorContext";

interface FileUploadProps {
  namePrefix: string;
}

export function FileUpload({ namePrefix }: FileUploadProps) {
  const { getValues, setValue, watch } = useFormContext<DatasetFormValues>();
  const { catalogueId } = useEditorContext();

  const createDraft = trpc.dataset.draft.create.useMutation();
  const utils = trpc.useUtils();

  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const downloadURL = watch(`${namePrefix}.downloadURL` as any) as
    | string
    | undefined;

  const saveDraft = async (datasetId: string) => {
    const values = getValues();
    const jsonLd = generateDatasetJsonLd(values);

    await createDraft.mutateAsync({
      id: datasetId,
      catalogueId,
      dataset: jsonLd,
    });
  };

  const ensureDraft = async (datasetId: string) => {
    await saveDraft(datasetId);

    // The uploader asks hub-search about the dataset, so wait until it is
    // indexed before the first upload.
    for (let attempt = 0; attempt < 10; attempt++) {
      try {
        await utils.dataset.get.fetch({ id: datasetId });
        return;
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    throw new Error(
      "Draft was saved but is not available in search yet. Please retry in a moment.",
    );
  };

  const handleFile = async (file: File) => {
    setError(null);
    setIsUploading(true);
    setProgress(0);

    try {
      const datasetId = getValues("id");
      if (!datasetId) {
        throw new Error("Please set a dataset ID before uploading files.");
      }

      await ensureDraft(datasetId);

      const path = file.name;
      const result = await uploadFile(file, datasetId, path, {
        onProgress: (uploaded, total) =>
          setProgress(total ? Math.round((uploaded / total) * 100) : 0),
      });

      setValue(
        `${namePrefix}.downloadURL` as any,
        buildDownloadUrl(datasetId, result.path, window.location.origin),
        { shouldDirty: true },
      );
      setValue(`${namePrefix}.uploadPath` as any, result.path, {
        shouldDirty: true,
      });
      setValue(`${namePrefix}.byteSize` as any, String(result.size), {
        shouldDirty: true,
      });

      const currentMediaType = getValues(`${namePrefix}.mediaType` as any) as
        | string
        | undefined;
      if (!currentMediaType && file.type) {
        setValue(`${namePrefix}.mediaType` as any, file.type, {
          shouldDirty: true,
        });
      }

      // Persist the updated distribution so a reload or a later re-upload
      // sees the new download URL.
      try {
        await saveDraft(datasetId);
      } catch (saveError) {
        setError(
          saveError instanceof Error
            ? `File uploaded, but saving the draft failed: ${saveError.message}`
            : "File uploaded, but saving the draft failed.",
        );
      }
    } catch (err) {
      if (err instanceof UploaderApiError) {
        setError(`${err.message} (${err.code})`);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Upload failed");
      }
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <Field>
      <FieldLabel>File</FieldLabel>
      <FieldDescription>
        The file is uploaded to the data platform and linked as the download
        URL.
      </FieldDescription>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? <Spinner /> : <UploadCloud className="size-4" />}
          {isUploading
            ? `Uploading… ${progress}%`
            : downloadURL
              ? "Replace file"
              : "Upload file"}
        </Button>
        {downloadURL && !isUploading && (
          <span className="text-xs text-muted-foreground">Uploaded</span>
        )}
      </div>

      {isUploading && (
        <div className="h-1.5 w-full overflow-hidden rounded bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && <FieldError errors={[{ message: error }]} />}
    </Field>
  );
}
