import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";
import { globalIgnores } from "eslint/config";

export default tseslint.config(
  globalIgnores(["node_modules", "dist", "prisma/", "eslint.config.mjs"]),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.strict,
  [
    {
      files: ["**/*.js", "**/*.ts"],

      languageOptions: {
        globals: {
          ...globals.node
        },

        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",

        parserOptions: {
          project: "tsconfig.json",
          tsconfigRootDir: import.meta.dirname,
          ecmaVersion: "latest",
          sourceType: "module"
        }
      },
      rules: {
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            args: "all",
            argsIgnorePattern: "^_",
            caughtErrors: "all",
            caughtErrorsIgnorePattern: "^_",
            destructuredArrayIgnorePattern: "^_",
            varsIgnorePattern: "^_",
            ignoreRestSiblings: true
          }
        ],
        "@typescript-eslint/no-unused-expressions": "warn"
      }
    }
  ]
);
