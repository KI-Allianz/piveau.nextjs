import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  outputFileTracingIncludes: {
    // adjust the route path to the one that needs the file
    '/': ['./assets/licenses-dcat.rdf', './assets/licenses-skos.rdf'],
  },
};

export default nextConfig;
