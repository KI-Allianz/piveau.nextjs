import NextAuth from "next-auth"
import Keycloak from "next-auth/providers/keycloak";

const handler = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Keycloak({
      clientId: process.env.AUTH_KEYCLOAK_ID || "",
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET || "",
      issuer: process.env.AUTH_KEYCLOAK_ISSUER || "",
    })
  ]
})

export { handler as GET, handler as POST }