module.exports = [
  { ignores: ["node_modules/", "coverage/", "public/"] },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "script",
      globals: {
        "process": "readonly",
        "console": "readonly",
        "require": "readonly",
        "module": "readonly",
        "__dirname": "readonly",
        "describe": "readonly",
        "test": "readonly",
        "expect": "readonly",
        "beforeEach": "readonly",
        "afterEach": "readonly",
        "beforeAll": "readonly",
        "afterAll": "readonly",
      },
    },
    rules: {
      "complexity": ["error", 5],
      "max-depth": ["error", 4],
      "max-lines": ["warn", 300],
      "max-lines-per-function": ["warn", 50],
      "max-nested-callbacks": ["error", 3],
      "max-params": ["warn", 5],
      "no-console": "off",
      "no-unused-vars": ["error", { "args": "none", "caughtErrors": "none" }],
      "prefer-const": "error",
      "no-var": "error",
      "semi": "off",
      "quotes": "off",
      "@stylistic/semi": ["error", "always"],
      "@stylistic/quotes": ["error", "double"],
      "no-unused-expressions": "error",
      "no-implicit-globals": "error",
      "no-redeclare": "error",
      "no-shadow": "error",
    },
    plugins: {
      "@stylistic": require("@stylistic/eslint-plugin")
    },
  },
  {
    files: ["**/*.test.js", "test/**/*.js"],
    rules: {
      "max-lines-per-function": "off",
    },
  },
];
