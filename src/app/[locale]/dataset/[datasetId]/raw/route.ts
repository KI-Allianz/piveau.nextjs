import { dataTypes } from "@/lib/content";
import { NextRequest, NextResponse } from "next/server";
// app/[locale]/dataset/[datasetId]/raw/route.ts
import { getDataset } from "@/lib/dataset/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// lib/auth-check.ts
export async function canAccessDataset(
  datasetId: string,
  session: any,
  urls: any,
) {
  // 1. Fetch metadata from the source (Repo or Search)
  // We fetch as a system user/internal call to see the keywords
  const response = await getDataset(datasetId, urls);

  const isPublic = response.keywords?.some(
    (k) => k.label.toLowerCase() === "public",
  );
  const isAuthed = !!session?.user;

  return {
    allowed: isPublic || isAuthed,
    dataset: response,
    isPublic,
  };
}

export async function GET(req: NextRequest, { params }: { params: any }) {
  const { datasetId } = await params;
  const session = await getServerSession(authOptions);

  const urls = {
    SEARCH: process.env.SEARCH_HUB_URL!,
    REPO: process.env.REPO_HUB_URL!,
  };

  const apiKey = req.headers.get("Authorization")?.replace("Bearer ", "");
  const isValidApiKey = (process.env.API_KEYS || "")
    .split(",")
    .includes(apiKey || "");

  const { allowed } = await canAccessDataset(datasetId, session, urls);

  if (!allowed && !isValidApiKey) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format");
  const typeConfig = dataTypes.find((t) => t.value === format);

  const res = await fetch(`${urls.REPO}datasets/${datasetId}${format}`);
  const data = await res.text();

  return new NextResponse(data, {
    headers: {
      "Content-Type": typeConfig?.mimes[1] || "application/octet-stream",
    },
  });
}
