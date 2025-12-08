import { withAuth } from "next-auth/middleware";

export default withAuth(
  function proxy(req) {},
  {
    pages: {
      signIn: "/auth/signin", // internal alias
    },
  }
);

export const config = {
  matcher: [
    "/:lang/:protected(dataset|catalogues|favourites|model)/:path*",
  ]
}
