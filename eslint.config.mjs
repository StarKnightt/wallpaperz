import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
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
    },
  },
];

export default eslintConfig;
