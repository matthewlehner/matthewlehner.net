module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "prettier",
    "prettier/react"
  ],
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    },
    sourceType: "module"
  },
  plugins: ["react"],
  settings: {
    react: {
      version: "detect"
    },
    linkComponents: [{ name: "Link", linkAttribute: "to" }]
  },
  rules: {
    "react/prop-types": [
      "error",
      {
        ignore: ["children", "data"]
      }
    ]
  }
};
