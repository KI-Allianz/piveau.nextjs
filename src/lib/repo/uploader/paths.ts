export const DOWNLOAD_ROUTE_PREFIX = "/api/uploader/download";

function encodePath(path: string): string {
  return path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function decodePath(path: string): string {
  return path
    .split("/")
    .map((segment) => decodeURIComponent(segment))
    .join("/");
}

/**
 * Builds the public download URL served by this Next.js app, which proxies the
 * request to the uploader while injecting the caller's access token.
 */
export function buildDownloadUrl(
  datasetId: string,
  path: string,
  origin: string,
): string {
  const base = origin.replace(/\/$/, "");
  return `${base}${DOWNLOAD_ROUTE_PREFIX}/${encodeURIComponent(datasetId)}/${encodePath(path)}`;
}

/**
 * Extracts the uploader-relative path from a download URL produced by
 * {@link buildDownloadUrl}.
 */
export function deriveUploadPath(
  downloadUrl: string | undefined,
  datasetId: string,
): string | undefined {
  if (!downloadUrl) return undefined;

  const marker = `${DOWNLOAD_ROUTE_PREFIX}/${encodeURIComponent(datasetId)}/`;
  const index = downloadUrl.indexOf(marker);
  if (index < 0) return undefined;

  const encodedPath = downloadUrl.slice(index + marker.length);
  if (!encodedPath) return undefined;

  return decodePath(encodedPath);
}
