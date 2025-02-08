import type { OptionsStylistic, TypedFlatConfigItem } from "../types";

import { pluginImport, pluginKirkLin } from "../plugins";

export async function imports(options: OptionsStylistic = {}): Promise<TypedFlatConfigItem[]> {
  const {
    stylistic = true,
  } = options;

  return [
    {
      name: "kirklin/imports/rules",
      plugins: {
        import: pluginImport,
        kirklin: pluginKirkLin,
      },
      rules: {
        "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
        "import/first": "error",
        "import/no-duplicates": "error",

        "import/no-mutable-exports": "error",
        "import/no-named-default": "error",
        "import/no-self-import": "error",
        "import/no-webpack-loader-syntax": "error",
        "kirklin/import-dedupe": "error",
        "kirklin/no-import-dist": "error",
        "kirklin/no-import-node-modules-by-path": "error",

        ...stylistic
          ? {
              "import/newline-after-import": ["error", { count: 1 }],
            }
          : {},
      },
    },
  ];
}
