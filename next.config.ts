import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.divarcdn.com", // Use `**.` for subdomains
      },
      {
        protocol: "https",
        hostname: "s100.divarcdn.com", // Add specific subdomain
      },
    ],
  },
};

export default nextConfig;
