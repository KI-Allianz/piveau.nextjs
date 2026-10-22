import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  outputFileTracingIncludes: {
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
