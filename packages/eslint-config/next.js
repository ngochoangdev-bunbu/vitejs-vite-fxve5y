/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ["next/core-web-vitals", "prettier"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint/eslint-plugin"],
  rules: {
    "@typescript-eslint/no-unused-vars": "warn",
    "react/jsx-key": "error",
  },
  globals: {
    React: "readonly",
  },
  ignorePatterns: ["**/*.js", "node_modules", ".turbo", "dist", ".next"],
};
