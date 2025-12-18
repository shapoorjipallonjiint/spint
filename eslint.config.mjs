import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
 
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // 🔹 Your custom rules go HERE
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
    },
  },

  // Override default ignores
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);
 
export default eslintConfig;
 