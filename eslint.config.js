/** @type {import('eslint').Linter.Config[]} */
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactRefresh from "eslint-plugin-react-refresh";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },
    plugins: {
      "react-refresh": reactRefresh
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "off",
      "react-refresh/only-export-components": "warn"
    },
    ignores: ["dist/", "node_modules/", "*.d.ts"]
  }
);