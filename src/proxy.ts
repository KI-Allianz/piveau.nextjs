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
    "/de/dataset/:path*",
    "/de/catalogues/:path*",
    "/de/favourites/:path*",
    "/de/model/:path*",
  ]
}
