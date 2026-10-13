import NextAuth, { AuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import Keycloak from "next-auth/providers/keycloak";

export interface ExtendedSession extends Session {
  accessToken: string;
  error?: "RefreshAccessTokenError";
}

interface ExtendedToken extends JWT {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  error?: "RefreshAccessTokenError";
}

async function refreshAccessToken(
  token: ExtendedToken,
): Promise<ExtendedToken> {
  try {
    const issuer = (process.env.AUTH_KEYCLOAK_ISSUER || "").replace(/\/$/, "");

    const response = await fetch(`${issuer}/protocol/openid-connect/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: process.env.AUTH_KEYCLOAK_ID || "",
        client_secret: process.env.AUTH_KEYCLOAK_SECRET || "",
        refresh_token: token.refreshToken || "",
      }),
    });

    const tokens = await response.json();

    if (!response.ok) throw tokens;

    return {
      ...token,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? token.refreshToken,
      expiresAt: Math.floor(Date.now() / 1000) + (tokens.expires_in ?? 300),
      error: undefined,
    };
  } catch (error) {
    console.error("Failed to refresh Keycloak access token:", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const authOptions: AuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    Keycloak({
      clientId: process.env.AUTH_KEYCLOAK_ID || "",
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET || "",
      issuer: process.env.AUTH_KEYCLOAK_ISSUER || "",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      const extended = token as ExtendedToken;

      // Initial sign in captures the tokens from Keycloak
      if (account) {
        extended.accessToken = account.access_token;
        extended.refreshToken = account.refresh_token;
        extended.expiresAt = account.expires_at;
        extended.error = undefined;
        return extended;
      }

      // Access token is still valid (5s leeway)
      if (extended.expiresAt && Date.now() < extended.expiresAt * 1000 - 5000) {
        return extended;
      }

      return refreshAccessToken(extended);
    },
    async session({ session, token }) {
      const extendedSession = session as ExtendedSession;
      const extendedToken = token as ExtendedToken;
      extendedSession.accessToken = extendedToken.accessToken as string;
      extendedSession.error = extendedToken.error;
      return extendedSession;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
