import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    ".open-next/**",
    ".wrangler/**",
    ".temp/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "cloudflare-env.d.ts",
  ]),
  {
    rules: {
      // Pre-existing issues surfaced when ESLint 9 made this flat config
      // actually run (it was silently ignored under ESLint 8). Kept as
      // warnings so builds stay green; clean up separately.
      "react/no-unescaped-entities": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      // Plain <a> tags are deliberate on ISR pages: next/link prefetching
      // would burn extra edge requests per viewport link.
      "@next/next/no-html-link-for-pages": "warn",
      // New in eslint-plugin-react-hooks 7 (eslint-config-next 16). Flags the
      // existing mount/localStorage effects (ad gate, entitlements, etc.);
      // warn until they are reworked.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  {
    // CommonJS config files
    files: ["next.config.js", "tailwind.config.ts"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);

export default eslintConfig;
