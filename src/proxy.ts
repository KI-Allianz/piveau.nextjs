import { withAuth } from "next-auth/middleware";

const AUTH_DISABLED = process.env.AUTH_DISABLED === "true";

export default withAuth(
  function proxy(_req) {
  },
  {
    // Optional: custom sign-in page
    pages: {
      signIn: "/auth/signin",
    },
    callbacks: {
      authorized: ({ token }) => {
        if (AUTH_DISABLED) {
          return true;
        }

        return !!token; // normal behavior
      },
    },
  }
);

export const config = {
  matcher: [
    "/:lang/:protected(dataset|catalogues|favourites|model)/:path*",
  ],
};