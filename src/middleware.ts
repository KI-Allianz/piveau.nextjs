import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
  },
  {
    // Optional: custom sign-in page
    pages: {
      signIn: "/auth/signin",
    },
  }
);

export const config = {
  matcher: [
    "/:lang/:protected(dataset|catalogues|favourites|model)/:path*",
  ],
};