/**
 * Normalizes a license URL so the same license resolves regardless of the
 * protocol, a `www.` prefix, a fragment, a trailing slash, or an `.html` /
 * `.json` suffix.
 *
 * Kept in its own module without server-only imports so client components can
 * use it to look up entries in the license map.
 */
export function normalizeLicenseKey(value?: string | null): string {
  if (!value) return "";

  let key = value.trim();
  if (!key) return "";

  key = key.replace(/#.*$/, "");
  key = key.replace(/^https?:\/\//i, "");
  key = key.replace(/^www\./i, "");
  key = key.replace(/\/+$/, "");
  key = key.replace(/\.(?:html?|json)$/i, "");
  key = key.replace(/\/+$/, "");

  return key;
}
