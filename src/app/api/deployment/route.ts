import { DefaultTheme, themeMap } from "@/themes";

function GET() {
  return new Response(
    JSON.stringify({
      rev: process.env.NEXT_PUBLIC_GIT_COMMIT_HASH || "development",
      auth_enabled: process.env.NEXT_PUBLIC_AUTH_DISABLED !== "true",
      theme: {
        default: DefaultTheme,
        switching_enabled:
          process.env.NEXT_PUBLIC_DISABLE_THEME_SWITCHING !== "true",
        data: themeMap[DefaultTheme],
      },
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

export { GET };
