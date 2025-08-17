
export type DataType = (typeof dataTypes)[number];
export const dataTypes = [
  {
    value: ".rdf",
    label: "RDF / XML",
    mimes: ['application/rdf+xml'],
  },
  {
    value: ".ttl",
    label: "Turtle",
    mimes: ['text/turtle', 'application/x-turtle'],
  },
  {
    value: ".n3",
    label: "Notation3",
    mimes: ['text/n3', 'application/n3'],
  },
  {
    value: ".nt",
    label: "N-Triples",
    mimes: ['application/n-triples'],
  },
  {
    value: ".jsonld",
    label: "JSON-LD",
    mimes: ['application/ld+json'],
  },
]

type AcceptEntry = { type: string; q: number };

function parseAccept(accept: string): AcceptEntry[] {
  return accept
    .split(',')
    .map((part) => {
      const [rawType, ...params] = part.trim().split(';');
      const q = Number(params.find((p) => p.trim().startsWith('q='))?.split('=')[1] ?? '1');
      return { type: rawType.toLowerCase(), q: isNaN(q) ? 1 : q };
    })
    .filter((e) => e.type.length > 0)
    .sort((a, b) => b.q - a.q); // highest quality first
}

function mimeMatches(acceptType: string, offered: string) {
  // Exact match
  if (acceptType === offered) return true;

  // Subtype wildcard: e.g., text/* matches text/turtle
  if (acceptType.endsWith('/*')) {
    const prefix = acceptType.slice(0, acceptType.indexOf('/'));
    return offered.startsWith(prefix + '/');
  }

  // */* matches anything
  return acceptType === '*/*';
}

/**
 * Pick the best data type given an Accept header and a set of offered data types.
 * Returns undefined if nothing but HTML is preferred.
 */
export function pickBestDataType(acceptHeader: string, offered: readonly DataType[]) {
  const accepts = parseAccept((acceptHeader || '').toLowerCase());
  if (accepts.length === 0) return undefined;

  // For each accept entry (ordered by q), see if it matches any offered mime
  for (const a of accepts) {
    for (const dt of offered) {
      for (const m of dt.mimes) {
        if (mimeMatches(a.type, m.toLowerCase())) {
          return dt; // first best match by q
        }
      }
    }
  }

  return undefined;
}