import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["**/dist/**", "**/node_modules/**", "apps/mobile/**"] },
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              // CONVENTIONS.md section 2: modules are imported only via
              // their public.ts. Deep imports across modules are a build
              // failure, not a style preference.
              group: [
                "**/modules/*/**",
                "./modules/*/**",
                "../modules/*/**",
                "!**/modules/*/public.js",
                "!./modules/*/public.js",
                "!../modules/*/public.js",
              ],
              message:
                "Import modules only through their public.ts (CONVENTIONS.md #2).",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/modules/*/*.ts"],
    rules: {
      // Inside a module, files may import each other freely.
      "no-restricted-imports": "off",
    },
  },
);
