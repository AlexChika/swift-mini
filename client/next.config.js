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
