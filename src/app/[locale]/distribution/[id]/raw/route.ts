import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BACKEND_URLS } from "@/lib/urls";

// Simple proxy route for distributions
export async function GET(req: NextRequest, { params }: { params: any }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format");

  const res = fetch(`${BACKEND_URLS.REPO}distributions/${id}${format}`, {});
  return res;
}
