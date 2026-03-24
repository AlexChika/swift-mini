const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  experimental: {
    globalNotFound: true
  },
  outputFileTracingExcludes: {
    "*": ["next.config.js"]
  },
  turbopack: {
    root: path.join(__dirname)
  }
};

module.exports = nextConfig;

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
