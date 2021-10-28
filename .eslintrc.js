module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        "standard",
    ],
    parserOptions: {
        sourceType: "module",
    },
    rules: {
        "object-curly-spacing": ["error", "always"],
        "space-before-function-paren": ["error", { named: "never" }],
        "comma-dangle": ["error", {
            arrays: "always-multiline",
            objects: "always-multiline",
            imports: "always-multiline",
            exports: "always-multiline",
            functions: "never",
        }],
        indent: ["error", 4],
        quotes: ["error", "double", { avoidEscape: true }],
        "prefer-arrow-callback": ["error"],
    },
}
