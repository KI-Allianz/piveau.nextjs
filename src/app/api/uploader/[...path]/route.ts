import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BACKEND_URLS } from "@/lib/urls";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

function errorResponse(code: string, message: string, status: number) {
  return Response.json({ error: { code, message } }, { status });
}

async function proxy(request: NextRequest, context: RouteContext) {
  const session = (await getServerSession(
    authOptions,
  )) as Session | null;

  if (!session?.accessToken) {
    return errorResponse(
      "unauthorized",
      "Authentication required",
      401,
    );
  }

  if (!BACKEND_URLS.UPLOAD) {
    return errorResponse(
      "misconfigured",
      "UPLOAD_API_URL is not configured",
      500,
    );
  }

  const { path } = await context.params;
  const base = BACKEND_URLS.UPLOAD.replace(/\/$/, "");
  const target = `${base}/api/${path
    .map((segment) => encodeURIComponent(segment))
    .join("/")}${request.nextUrl.search}`;

  const headers = new Headers();
  headers.set("Authorization", `Bearer ${session.accessToken}`);

  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  const accept = request.headers.get("accept");
  if (accept) headers.set("accept", accept);

  const hasBody = request.method !== "GET" && request.method !== "HEAD";

  const init: RequestInit & { duplex?: "half" } = {
    method: request.method,
    headers,
    cache: "no-store",
  };

  if (hasBody && request.body) {
    init.body = request.body;
    init.duplex = "half";
  }

  const upstream = await fetch(target, init);

  const responseHeaders = new Headers();
  const upstreamContentType = upstream.headers.get("content-type");
  if (upstreamContentType) {
    responseHeaders.set("content-type", upstreamContentType);
  }

  const contentDisposition = upstream.headers.get("content-disposition");
  if (contentDisposition) {
    responseHeaders.set("content-disposition", contentDisposition);
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
