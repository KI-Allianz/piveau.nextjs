const BASE = "/api/uploader";

export interface UploadSession {
  uploadId: string;
  key: string;
  partSize: number;
}

export interface RemoteFile {
  path: string;
  size: number;
  etag: string;
  lastModified: string;
}

export interface UploadResult {
  path: string;
  key: string;
  size: number;
}

export class UploaderApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = "UploaderApiError";
    this.code = code;
    this.status = status;
  }
}

async function throwResponseError(response: Response): Promise<never> {
  let code = "unknown_error";
  let message = `Uploader request failed with status ${response.status}`;

  try {
    const body = await response.json();
    if (body?.error) {
      code = body.error.code ?? code;
      message = body.error.message ?? message;
    }
  } catch {
    // response had no JSON body
  }

  throw new UploaderApiError(message, code, response.status);
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);

  if (!response.ok) {
    return throwResponseError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function createUpload(
  datasetId: string,
  path: string,
): Promise<UploadSession> {
  return requestJson<UploadSession>(`${BASE}/uploads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ datasetId, path }),
  });
}

export function getUpload(
  uploadId: string,
  datasetId: string,
  path: string,
): Promise<{
  uploadId: string;
  parts: { partNumber: number; etag: string; size: number }[];
}> {
  const params = new URLSearchParams({ datasetId, path });
  return requestJson(
    `${BASE}/uploads/${encodeURIComponent(uploadId)}?${params.toString()}`,
  );
}

export function putPart(
  uploadId: string,
  partNumber: number,
  datasetId: string,
  path: string,
  body: Blob,
  options?: {
    onProgress?: (loaded: number) => void;
    signal?: AbortSignal;
  },
): Promise<{ partNumber: number; etag: string }> {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({ datasetId, path });
    const xhr = new XMLHttpRequest();

    xhr.open(
      "PUT",
      `${BASE}/uploads/${encodeURIComponent(uploadId)}/parts/${partNumber}?${params.toString()}`,
    );
    xhr.responseType = "json";

    const onAbort = () => xhr.abort();
    options?.signal?.addEventListener("abort", onAbort);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        options?.onProgress?.(event.loaded);
      }
    };

    xhr.onload = () => {
      options?.signal?.removeEventListener("abort", onAbort);

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response ?? { partNumber, etag: "" });
      } else {
        const error = xhr.response?.error;
        reject(
          new UploaderApiError(
            error?.message ?? "Failed to upload part",
            error?.code ?? "part_failed",
            xhr.status,
          ),
        );
      }
    };

    xhr.onerror = () => {
      options?.signal?.removeEventListener("abort", onAbort);
      reject(
        new UploaderApiError(
          "Network error while uploading part",
          "network_error",
          0,
        ),
      );
    };

    xhr.onabort = () => {
      options?.signal?.removeEventListener("abort", onAbort);
      reject(new DOMException("Upload aborted", "AbortError"));
    };

    xhr.send(body);
  });
}

export function completeUpload(
  uploadId: string,
  datasetId: string,
  path: string,
): Promise<{ key: string; size: number }> {
  return requestJson<{ key: string; size: number }>(
    `${BASE}/uploads/${encodeURIComponent(uploadId)}/complete`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ datasetId, path }),
    },
  );
}

export async function abortUpload(
  uploadId: string,
  datasetId: string,
  path: string,
): Promise<void> {
  const params = new URLSearchParams({ datasetId, path });
  const response = await fetch(
    `${BASE}/uploads/${encodeURIComponent(uploadId)}?${params.toString()}`,
    { method: "DELETE" },
  );

  if (!response.ok && response.status !== 404) {
    return throwResponseError(response);
  }
}

export function listFiles(
  datasetId: string,
): Promise<{ datasetId: string; files: RemoteFile[] }> {
  return requestJson(`${BASE}/datasets/${encodeURIComponent(datasetId)}/files`);
}

export async function deleteFile(
  datasetId: string,
  path: string,
): Promise<void> {
  const params = new URLSearchParams({ path });
  const response = await fetch(
    `${BASE}/datasets/${encodeURIComponent(datasetId)}/files?${params.toString()}`,
    { method: "DELETE" },
  );

  if (!response.ok && response.status !== 404) {
    return throwResponseError(response);
  }
}

export async function uploadFile(
  file: File,
  datasetId: string,
  path: string,
  options?: {
    onProgress?: (uploaded: number, total: number) => void;
    signal?: AbortSignal;
  },
): Promise<UploadResult> {
  const session = await createUpload(datasetId, path);
  const partSize = session.partSize || 32 * 1024 * 1024;
  const total = file.size;

  try {
    const totalParts = Math.max(1, Math.ceil(total / partSize));
    let uploaded = 0;

    for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
      const start = (partNumber - 1) * partSize;
      const end = Math.min(start + partSize, total);
      const chunk = file.slice(start, end);
      const baseUploaded = uploaded;

      await putPart(session.uploadId, partNumber, datasetId, path, chunk, {
        signal: options?.signal,
        onProgress: (loaded) =>
          options?.onProgress?.(baseUploaded + loaded, total),
      });

      uploaded = end;
      options?.onProgress?.(uploaded, total);
    }

    const completed = await completeUpload(session.uploadId, datasetId, path);
    return { path, key: completed.key, size: completed.size };
  } catch (error) {
    try {
      await abortUpload(session.uploadId, datasetId, path);
    } catch {
      // best effort cleanup
    }
    throw error;
  }
}
