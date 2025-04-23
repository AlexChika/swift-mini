/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
});

const nextConfig = withBundleAnalyzer({});

module.exports = nextConfig;
