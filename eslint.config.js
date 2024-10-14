import globals from "globals";

export default [
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        "$": "readonly",
        "Chart": "readonly",
        "initSqlJs": "readonly",
        "db": "readonly"
      },
      ecmaVersion: 2021,
      sourceType: "module"
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error"
    }
  }
];
