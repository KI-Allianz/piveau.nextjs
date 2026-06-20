import { dataTypes } from "@/lib/content";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { canAccessDataset, getRawDataset } from "@/lib/repo/dataset/api";

export async function GET(req: NextRequest, { params }: { params: any }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const apiKey = req.headers.get("Authorization")?.replace("Bearer ", "");
  const isValidApiKey = (process.env.API_KEYS || "")
    .split(",")
    .includes(apiKey || "");

  const { allowed } = await canAccessDataset(id, session);

  if (!allowed && !isValidApiKey) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format");
  const typeConfig = dataTypes.find((t) => t.value === format);
  if (!typeConfig) {
    return new NextResponse("Unsupported format", { status: 400 });
  }

  try {
    const res = await getRawDataset(id, typeConfig.value);

    return new NextResponse(res, {
      headers: {
        "Content-Type": typeConfig?.mimes[1] || "application/octet-stream",
      },
    });
  } catch (error) {
    console.error("Error fetching raw dataset:", error);
    return new NextResponse("Failed to fetch dataset", { status: 500 });
  }
}
