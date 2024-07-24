/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions & import('@trivago/prettier-plugin-sort-imports').PrettierConfig}} */
const config = {
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  jsxSingleQuote: false,
  trailingComma: "es5",
  singleAttributePerLine: true,
  bracketSpacing: true,
  jsxBracketSameLine: false,
  arrowParens: "avoid",
  proseWrap: "always",
  importOrder: [
    "^server-only$",
    "^react$", // React itself
    "next",
    "<THIRD_PARTY_MODULES>", // node_modules
    "^@/(app|components)/*.*$", // React Components
    "^@/(server|trpc)/*.*$", // React Components
    "^@/(constants|data|hooks|util|utils|lib)/.*$", // Various helpers
    "^(\\.|\\.\\.)/(.(?!.(css|scss)))*$", // Any local imports that AREN'T styles.
    "^@/styles/*.(css|scss)$", // Styles
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
};

export default config;
