/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],

  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint/eslint-plugin"],

  globals: {
    React: "readonly",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  env: {
    browser: true,
  },
  rules: {
    "@typescript-eslint/no-unused-vars": "warn",
    "react/jsx-key": "error",
    "react/prop-types": "off",
  },
  ignorePatterns: ["node_modules/", "dist/", ".turbo/", "**/*.js"],
};
