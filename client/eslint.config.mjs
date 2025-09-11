import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import nexLint from "@next/eslint-plugin-next";
import reactLint from "eslint-plugin-react";
import reactHooksLint from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig(
  globalIgnores([
    "node_modules",
    "app/sample",
    ".next/",
    "prisma/",
    "next-env.d.ts",
    "next.config.js",
    "eslint.config.mjs"
  ]),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  [nexLint.flatConfig.recommended],
  [nexLint.flatConfig.coreWebVitals],
  [reactLint.configs.flat.recommended],
  [reactLint.configs.flat["jsx-runtime"]],
  [reactHooksLint.configs["recommended-latest"]],

  [
    {
      files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],

      rules: {
        "react/no-unescaped-entities": "off",
        "@next/next/no-page-custom-font": "off"
      },

      settings: {
        react: {
          version: "detect",
          defaultVersion: "19.1.1"
        }
      }
    }
  ]
);
