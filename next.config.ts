import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/About",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/Contact",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/Terms",
        destination: "/terms",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
