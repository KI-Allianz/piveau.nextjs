import { getResourceById } from "@piveau/sdk-core";
import { Catalogue } from "@/lib/utils";
import { BACKEND_URLS } from "@/lib/urls";
import { StandardSchemaV1 } from "@standard-schema/spec";
import { schemaCatalog } from "@piveau/sdk-core/model";

export async function getCatalogue(id: string): Promise<Catalogue> {
  const response = await getResourceById<
    StandardSchemaV1.InferOutput<typeof schemaCatalog>
  >({
    baseUrl: BACKEND_URLS.SEARCH,
    resource: "catalogues",
    id: id,
  });

  return response.result;
}
