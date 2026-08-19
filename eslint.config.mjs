import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Deno edge functions — a separate runtime/toolchain, not part of
    // this Next.js project's lint surface.
    "supabase/functions/**",
    // Native Capacitor projects: vendored native code + the built
    // static export copied in at sync time, not app source.
    "android/**",
    "ios/**",
  ]),
]);

export default eslintConfig;
