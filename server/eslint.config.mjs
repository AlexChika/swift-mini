import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";

export default tseslint.config(
  eslint.configs.recommended,
  // tseslint.configs.recommended
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
          project: "./tsconfig.json",
          tsconfigRootDir: ".",
          ecmaVersion: "latest",
          sourceType: "module"
        }
      },
      ignores: [
        "node_modules/",
        "dist/",
        "build/",
        "coverage/",
        "*.log",
        "*.tmp"
      ],
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
