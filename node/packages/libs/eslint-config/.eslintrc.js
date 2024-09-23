module.exports = {
  parser: "@typescript-eslint/parser",
  env: {
    node: true,
    commonjs: true,
    "jest/globals": true,
  },
  extends: [
    "airbnb-base",
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended",
    "plugin:sonarjs/recommended",
    "prettier",
    "plugin:prettier/recommended",
  ],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./",
      },
    },
  },
  ignorePatterns: [
    "**/dist",
    "**/build",
    "**/node_modules",
    "**/generated",
    "**/dev.ts",
    "remix.config.js",
    ".eslintrc.js",
  ],
  plugins: ["jest", "prettier", "unicorn"],
  rules: {
    "unicorn/filename-case": [
      "error",
      {
        case: "kebabCase",
        ignore: ["\\.js$"],
      },
    ],
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: true,
      },
    ],
    "import/extensions": [
      "off",
      {
        ts: "never",
        tsx: "never",
      },
    ],
    "no-underscore-dangle": 0,
    "no-restricted-syntax": [
      "error",
      {
        selector: "ForInStatement",
        message:
          "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.",
      },
      {
        selector: "LabeledStatement",
        message:
          "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
      },
      {
        selector: "WithStatement",
        message:
          "`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
      },
    ],
    "no-plusplus": "off",
    "import/prefer-default-export": "off",
    "import/newline-after-import": "error",
    "import/order": [
      "warn",
      {
        "newlines-between": "always",
        "pathGroups": [
          {
            "pattern": "@assets/**",
            "group": "external"
          },
          {
            "pattern": "@styles/**",
            "group": "external"
          },
        ]
      },
    ],
    "no-return-await": "off",
    "no-await-in-loop": "off",
    "no-console": [
      "error",
      {
        allow: ["warn", "error"],
      },
    ],
    "no-param-reassign": [
      "error",
      {
        props: false,
      },
    ],
    "@typescript-eslint/no-use-before-define": "warn",
    "@typescript-eslint/return-await": ["error", "in-try-catch"],
  },
  overrides: [
    {
      files: ["**/*.test.ts"],
      rules: {
        "sonarjs/no-duplicate-string": "off",
      },
    },
    {
      files: ["**/*.js"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        "sonarjs/no-duplicate-string": "off",
        "sonarjs/no-identical-functions": "off",
      },
    },
  ],
};
