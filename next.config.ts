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
  // Proxy /api/assistant to the internal Agent API on the backend VM
  async rewrites() {
    return [
      {
        source: "/api/assistant",
        destination: process.env.INTERNAL_AGENT_URL || "http://10.254.1.15:8000/",
      },
      {
        source: "/api/assistant/:path*",
        destination: `${process.env.INTERNAL_AGENT_URL || "http://10.254.1.15:8000/"}:path*`,
      },
    ];
  },
};

export default nextConfig;