/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('next').NextConfig} */
const path = require("path");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
  experimental: {
    optimizePackageImports: ["@chakra-ui/react", "@emotion/react", "@zag-js"]
  }
});

const nextConfig = withBundleAnalyzer({
  typedRoutes: true,
  experimental: {
    globalNotFound: true
  },
  turbopack: {
    root: path.join(__dirname)
  }
});

module.exports = nextConfig;
