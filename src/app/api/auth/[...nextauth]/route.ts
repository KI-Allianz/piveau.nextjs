import NextAuth, { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import Keycloak from "next-auth/providers/keycloak";

async function refreshAccessToken(token: JWT): Promise<JWT> {
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
    // Drop the dead token so no caller forwards it to the backend. Requests
    // then fail with 401 and the existing sign-in redirects take over.
    return {
      ...token,
      accessToken: undefined,
      error: "RefreshAccessTokenError",
    };
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
      // Initial sign in captures the tokens from Keycloak
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.error = undefined;
        return token;
      }

      // Never retry a session whose refresh already failed. Without this every
      // session read would hit Keycloak again with an unusable refresh token.
      if (token.error) {
        return token;
      }

      // Access token is still valid (5s leeway)
      if (token.expiresAt && Date.now() < token.expiresAt * 1000 - 5000) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken ?? "";
      session.error = token.error;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
