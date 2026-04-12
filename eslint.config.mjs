import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([{
    extends: [...nextCoreWebVitals],

    rules: {
        "no-extra-parens": "off",
        indent: "off",
        "brace-style": "off",
        "comma-dangle": "off",
        "space-before-function-paren": "off",
        "require-jsdoc": "off",
        "react/no-string-refs": "off",
        "new-cap": "warn",
        camelcase: "warn",
        "wrap-regex": "off",
        "spaced-comment": "off",

        "react/jsx-key": [1, {
            checkFragmentShorthand: true,
        }],
    },
}]);