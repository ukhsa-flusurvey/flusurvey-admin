import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
    {
        ignores: [".next/**", "node_modules/**", ".pnpm-store/**"],
    },
    ...nextCoreWebVitals,
    ...nextTypescript,
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        rules: {
            "react-hooks/immutability": "off",
            "react-hooks/incompatible-library": "off",
            "react-hooks/preserve-manual-memoization": "off",
            "react-hooks/purity": "off",
            "react-hooks/refs": "off",
            "react-hooks/set-state-in-effect": "off",
            "react-hooks/static-components": "off",
        },
    },
    {
        files: ["tailwind.config.js"],
        rules: {
            "@typescript-eslint/no-require-imports": "off",
        },
    },
]);
