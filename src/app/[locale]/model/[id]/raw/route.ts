import { NextRequest, NextResponse } from "next/server";

import { BACKEND_URLS } from "@/lib/urls";
import { dataTypes } from "@/lib/content";
import { getRawModel } from "@/lib/repo/model/api";
import { getAxiosInstance } from "@/server";
import { createTRPCContext } from "@/server/trpc";
import { handleAxiosErrorForNextResponse } from "@/lib/repo/common/api";
import axios from "axios";
import { redirect } from "next/navigation";

export async function GET(req: NextRequest, { params }: { params: any }) {
  const { id } = await params;
  const ctx = await createTRPCContext({ req });
  const axiosInstance = getAxiosInstance(ctx, BACKEND_URLS.REPO);

  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format");
  const typeConfig = dataTypes.find((t) => t.value === format);
  if (!typeConfig) {
    return new NextResponse("Unsupported format", { status: 400 });
  }

  try {
    const res = await getRawModel(id, typeConfig.value, axiosInstance);

    return new NextResponse(res, {
      headers: {
        "Content-Type": typeConfig?.mimes[0] || "application/octet-stream",
        "Content-Disposition": `inline; filename="${id}"`,
      },
    });
  } catch (error) {
    console.error("Error fetching raw model:", error);

    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      if (status === 401 || status === 403) {
        redirect(
          `/auth/signin?callbackUrl=/${params.locale}/model/${id}/raw?format=${format}`,
        );
      }
    }

    return handleAxiosErrorForNextResponse(error);
  }
}
