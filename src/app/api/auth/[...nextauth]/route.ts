import NextAuth, { AuthOptions, Session } from "next-auth";
import Keycloak from "next-auth/providers/keycloak";

export interface ExtendedSession extends Session {
  accessToken: string;
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
      // Initial sign in captures the access token from Keycloak
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client/server session
      const extendedSession = session as ExtendedSession;
      extendedSession.accessToken = token.accessToken as string;
      return extendedSession;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
