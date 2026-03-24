/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('next').NextConfig} */
const path = require("path");
// const { PrismaPlugin } = require("@prisma/nextjs-monorepo-workaround-plugin");

// @ts-check

// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: process.env.ANALYZE === "true",
//   experimental: {
//     optimizePackageImports: ["@chakra-ui/react", "@emotion/react", "@zag-js"]
//   }
// });

// const nextConfig2 = withBundleAnalyzer({
//   typedRoutes: true,
//   experimental: {
//     globalNotFound: true
//   },
//   turbopack: {
//     root: path.join(__dirname)
//   },

//   outputFileTracingRoot: path.join(__dirname),

//   webpack: (config, { isServer }) => {
//     if (isServer) {
//       config.plugins = [...config.plugins, new PrismaPlugin()];
//     }

//     return config;
//   }
// });

const nextConfig = {
  typedRoutes: true,
  experimental: {
    globalNotFound: true
  },

  turbopack: {
    root: path.join(__dirname)
  },

  outputFileTracingRoot: path.join(__dirname)
};

module.exports = nextConfig;
