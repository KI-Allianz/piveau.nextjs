import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  outputFileTracingIncludes: {
    // adjust the route path to the one that needs the file
    "/": ["./assets/licenses-dcat.rdf", "./assets/licenses-skos.rdf"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.hammerhai.eu",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
