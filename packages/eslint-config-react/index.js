module.exports = {
  extends: [
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "@kirklin/eslint-config-ts",
  ],
  plugins: [
    "react-refresh",
  ],
  settings: {
    react: {
      version: "17.0",
    },
  },
  rules: {
    "jsx-quotes": [
      "error",
      "prefer-double",
    ],
    "react/react-in-jsx-scope": "off",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  },
};
