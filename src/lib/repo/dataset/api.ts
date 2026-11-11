import {
  getResourceById,
  searchResource,
  SearchResult,
} from "@piveau/sdk-core/hubSearch";
import { aiModelKeywords, Dataset } from "@/lib/utils";
import { parseIntoDataset, parseRawDCAT } from "@/lib/repo/dataset/parse";
import { DraftSummary, parseDatasetListJsonLd } from "@/lib/editor/parseJsonLD";
import { normalizeJsonLdDocument } from "@/lib/editor/normalizeJsonLD";
import { BACKEND_URLS } from "@/lib/urls";
import { SearchParamsSchema } from "@/server/schemas/search";
import { handleAxiosErrorForTRPC } from "@/lib/repo/common/api";
import axios, { AxiosInstance } from "axios";
import z from "zod";
import { TRPCError } from "@trpc/server";

export async function getDataset(
  id: string,
  axiosInstance?: AxiosInstance,
): Promise<Dataset> {
  try {
    const response = await getResourceById<Dataset>({
      baseUrl: BACKEND_URLS.SEARCH,
      axiosInstance: axiosInstance,
      resource: "datasets",
      id: id,
    });

    return response.result;
  } catch (error) {
    console.error("Failed to fetch dataset:", error);
    handleAxiosErrorForTRPC(error);
  }
}

export async function getRawDataset(
  id: string,
  type: string,
  axiosInstance = axios.create(),
) {
  const response = await axiosInstance.get(
    `${BACKEND_URLS.REPO}datasets/${id}${type}`,
  );

  return await response.data;
}

export async function getRawDistribution(
  id: string,
  type: string,
  axiosInstance = axios.create(),
) {
  const response = await axiosInstance.get(
    `${BACKEND_URLS.REPO}distributions/${id}${type}`,
  );

  return await response.data;
}

export async function searchDatasets(
  params: z.infer<typeof SearchParamsSchema>,
  axiosInstance?: AxiosInstance,
) {
  try {
    const res = await searchResource<SearchResult<Dataset>>({
      baseUrl: BACKEND_URLS.SEARCH,
      axiosInstance,
      params: {
        ...params,
        filters: "dataset",
        includes: [
          "id",
          "title",
          "description",
          "languages",
          "modified",
          "issued",
          "catalog.id",
          "catalog.title",
          "catalog.country.id",
          "distributions.id",
          "distributions.format.label",
          "distributions.format.id",
          "distributions.license",
          "categories.label",
          "keywords.label",
          "publisher",
        ],
      },
    });

    return res.data.result;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    handleAxiosErrorForTRPC(error);
  }
}

export async function getDatasetCategories(
  axiosInstance?: AxiosInstance,
): Promise<SearchResult<Dataset>["result"]["facets"][0]["items"]> {
  try {
    const res = await searchResource<SearchResult<Dataset>>({
      baseUrl: BACKEND_URLS.SEARCH,
      axiosInstance,
      params: {
        q: "",
        filters: "dataset",
        limit: 1,
        page: 0,
        includes: ["categories.label"],
      },
    });

    return (
      res.data.result.facets.find((facet) => facet.id === "categories")
        ?.items || []
    );
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    handleAxiosErrorForTRPC(error);
  }
}

export async function getFeaturedDatasets(axiosInstance?: AxiosInstance) {
  const res = await searchDatasets(
    {
      limit: 10,
      excludeFacets: {
        keywords: aiModelKeywords,
      },
    },
    axiosInstance,
  );

  return res.results;
}

export async function getDatasetDirect(id: string): Promise<any> {
  // Promise<StandardSchemaV1.InferOutput<typeof schemaDataset>>
  const url = BACKEND_URLS.REPO + `datasets/${id}.jsonld`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch dataset: ${res.statusText}`);
  }
  const data = await res.json();

  let schema = await parseRawDCAT(data);
  const dataset = parseIntoDataset(schema);

  // console.log(dataset)

  return dataset;
}

export async function getDatasetDrafts(
  catalogId: string,
  axiosInstance: AxiosInstance = axios.create(),
): Promise<DraftSummary[]> {
  const url =
    BACKEND_URLS.REPO +
    `catalogues/${catalogId}/datasets?valueType=metadata&publicationStatus=draft`;
  try {
    const res = await axiosInstance.get(url, {
      headers: {
        Accept: "application/ld+json",
      },
    });
    const normalized = await normalizeJsonLdDocument(res.data);
    return parseDatasetListJsonLd(normalized);
  } catch (error) {
    console.error("Failed to fetch dataset drafts:", error);
    console.error((error as any).response.data);

    if ((error as any).response?.status === 500) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Received 500 from resources api, likely missing auth.",
        cause: error,
      });
    }

    handleAxiosErrorForTRPC(error);
  }
}

export async function getDatasetDraftById(
  id: string,
  catalogId: string,
  axiosInstance: AxiosInstance = axios.create(),
) {
  const url =
    BACKEND_URLS.REPO +
    `catalogues/${catalogId}/resources/origin?originalId=${encodeURIComponent(id)}`;
  try {
    const res = await axiosInstance.get(url, {
      headers: {
        Accept: "application/ld+json",
      },
    });
    return await normalizeJsonLdDocument(res.data);
  } catch (error) {
    console.error("Failed to fetch dataset draft:", error);

    if ((error as any).response?.status === 500) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Received 500 from resources api, likely missing auth.",
        cause: error,
      });
    }

    handleAxiosErrorForTRPC(error);
  }
}

type PublicationStatus = "draft" | "published";
type AccessLevel = "public" | "restricted";

function accessLevelForPublicationStatus(
  publicationStatus: PublicationStatus,
): AccessLevel {
  return publicationStatus === "published" ? "public" : "restricted";
}

async function putDatasetWithPublicationStatus(
  catalogId: string,
  datasetId: string,
  dataset: object,
  publicationStatus: PublicationStatus,
  axiosInstance: AxiosInstance,
) {
  const accessLevel = accessLevelForPublicationStatus(publicationStatus);
  const url =
    BACKEND_URLS.REPO +
    `catalogues/${catalogId}/datasets/origin?publicationStatus=${publicationStatus}&accessLevel=${accessLevel}&originalId=${encodeURIComponent(datasetId)}`;

  try {
    const res = await axiosInstance.put(url, dataset, {
      headers: {
        Accept: "text/turtle",
        "Content-Type": "application/ld+json",
      },
      // Piveau returns 304 when the dataset is unchanged
      validateStatus: (status) =>
        (status >= 200 && status < 300) || status === 304,
    });
    console.log(res.data);
    return res.data as string[];
  } catch (error) {
    console.error("Failed to save dataset:", error);
    console.error((error as any).response?.data);

    if ((error as any).response?.status === 500) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Received 500 from resources api, likely missing auth.",
        cause: error,
      });
    }

    handleAxiosErrorForTRPC(error);
  }
}

export async function createDatasetDraft(
  catalogId: string,
  datasetId: string,
  dataset: object,
  axiosInstance: AxiosInstance = axios.create(),
) {
  return putDatasetWithPublicationStatus(
    catalogId,
    datasetId,
    dataset,
    "draft",
    axiosInstance,
  );
}

/**
 * Saves the dataset payload and changes its publication status (and the
 * matching access level) in a single update request.
 */
export async function updateDatasetPublication(
  catalogId: string,
  datasetId: string,
  dataset: object,
  publicationStatus: PublicationStatus,
  axiosInstance: AxiosInstance = axios.create(),
) {
  return putDatasetWithPublicationStatus(
    catalogId,
    datasetId,
    dataset,
    publicationStatus,
    axiosInstance,
  );
}

async function callDatasetAction(
  method: string,
  params: Record<string, unknown>,
  axiosInstance: AxiosInstance,
) {
  try {
    const response = await axiosInstance.post(
      `${BACKEND_URLS.REPO}action`,
      {
        jsonrpc: "2.0",
        method,
        params,
        id: method,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    if (response.data?.error) {
      throw new TRPCError({
        code: "BAD_GATEWAY",
        message:
          response.data.error.message ?? `Piveau action ${method} failed.`,
      });
    }

    return response.data?.result;
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    console.error(`Failed to call piveau action ${method}:`, error);
    console.error((error as any).response?.data);

    if ((error as any).response?.status === 500) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Received 500 from resources api, likely missing auth.",
        cause: error,
      });
    }

    handleAxiosErrorForTRPC(error);
  }
}

/**
 * Changes only the publication status and access level of a dataset.
 *
 * Publish results in `published` + `public`, unpublish in `draft` +
 * `restricted`. Both operations are idempotent.
 */
export async function setDatasetPublicationStatus(
  catalogId: string,
  datasetId: string,
  publicationStatus: PublicationStatus,
  axiosInstance: AxiosInstance = axios.create(),
): Promise<void> {
  const accessLevel = accessLevelForPublicationStatus(publicationStatus);
  const params = { id: datasetId, catalogueId: catalogId };

  // Keep drafts hidden while changing the access level, and only make the
  // dataset public right before it is published.
  if (publicationStatus === "published") {
    await callDatasetAction(
      "setDatasetAccessLevel",
      { ...params, accessLevel },
      axiosInstance,
    );
    await callDatasetAction(
      "setDatasetPublicationStatus",
      { ...params, publicationStatus },
      axiosInstance,
    );
    return;
  }

  await callDatasetAction(
    "setDatasetPublicationStatus",
    { ...params, publicationStatus },
    axiosInstance,
  );
  await callDatasetAction(
    "setDatasetAccessLevel",
    { ...params, accessLevel },
    axiosInstance,
  );
}

export async function deleteDataset(
  catalogueId: string,
  datasetId: string,
  axiosInstance: AxiosInstance = axios.create(),
): Promise<void> {
  const url =
    BACKEND_URLS.REPO +
    `catalogues/${catalogueId}/datasets/origin?originalId=${datasetId}`;

  try {
    await axiosInstance.delete(url, {
      headers: {
        Accept: "application/ld+json",
      },
    });
  } catch (error) {
    console.error("Failed to delete dataset:", error);
    console.error((error as any).response?.data);

    if ((error as any).response?.status === 500) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Received 500 from resources api, likely missing auth.",
        cause: error,
      });
    }

    handleAxiosErrorForTRPC(error);
  }
}

// async function convertJsonLdToTurtle(doc: object): Promise<string> {
//   const nquads = await jsonld.toRDF(doc, { format: "application/n-quads" });
//
//   const parser = new Parser();
//   const quads = parser.parse(nquads as string);
//
//   const writer = new Writer({
//     prefixes: {
//       dct: "http://purl.org/dc/terms/",
//       dcat: "http://www.w3.org/ns/dcat#",
//       vcard: "http://www.w3.org/2006/vcard/ns#",
//     },
//   });
//
//   writer.addQuads(quads);
//
//   return new Promise((resolve, reject) => {
//     writer.end((error, result) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(result);
//       }
//     });
//   });
// }
