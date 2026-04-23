import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { supportedLocales } from "./lib/lang";
import {
  DefaultTheme,
  getTheme,
  SupportedTheme,
  SupportedThemes,
} from "./themes";
import path from "path";

const AUTH_DISABLED = process.env.AUTH_DISABLED === "true";
const PROTECTED_PATHS = ["dataset", "model", "catalogues", "favourites"];

const isValidApiKey = (req: NextRequest) => {
  const apiKey = req.headers.get("Authorization")?.replace("Bearer ", "");
  const validApiKeys = (process.env.API_KEYS || "").split(",");
  return apiKey && validApiKeys.includes(apiKey);
};

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Theme forwarding
  const themeId = req.nextUrl.searchParams.get("theme") || DefaultTheme;
  const theme = getTheme(themeId);
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set(
    "x-selected-theme",
    SupportedThemes.includes(themeId as SupportedTheme)
      ? themeId
      : DefaultTheme,
  );

  // Locale handling
  const defaultLocale = theme.lang.default;
  const SupportedLocales = theme.lang.supported;
  const segments = pathname.split("/").filter(Boolean);
  const localeInPath = segments[0];

  if (!SupportedLocales.includes(localeInPath as supportedLocales)) {
    let newSegments = [...segments];

    if (SupportedLocales.includes(newSegments[0] as supportedLocales)) {
    } else {
      newSegments = [defaultLocale, ...newSegments.slice(1)];
    }

    const newPath = `/${newSegments.join("/")}${req.nextUrl.search}`;
    return NextResponse.redirect(new URL(newPath, req.url), {
      headers: requestHeaders,
    });
  }

  // Authentication handling (Runs only for protected paths)
  // const isProtected = PROTECTED_PATHS.some((path) => segments.includes(path));
  // const isProtected = pathname.includes("/catalogues");

  // if (isProtected && !AUTH_DISABLED) {
  //   if (isValidApiKey(req)) {
  //     return NextResponse.next({ headers: requestHeaders });
  //   }

  //   return (withAuth as any)(
  //     function cb(req: NextRequest) {
  //       return NextResponse.next({ headers: requestHeaders });
  //     },
  //     {
  //       pages: { signIn: "/auth/signin" },
  //       callbacks: {
  //         authorized: ({ token }: { token: any }) => !!token,
  //       },
  //     },
  //   )(req);
  // }

  return NextResponse.next({ headers: requestHeaders });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon (favicon files)
     * - themes (theme assets)
     * - auth (authentication routes)
     * - sitemap.xml and robots.txt (SEO files)
     */
    "/((?!api|_next/static|_next/image|favicon|themes|auth|sitemap.xml|robots.txt).*)",
  ],
};
