import type { ConfigItem, OptionsStylistic } from "../types";
import { pluginImport, pluginKirkLin } from "../plugins";

export function imports(options: OptionsStylistic = {}): ConfigItem[] {
  const {
    stylistic = true,
  } = options;

  return [
    {
      name: "kirklin:imports",
      plugins: {
        import: pluginImport,
        kirklin: pluginKirkLin,
      },
      rules: {
        "import/first": "error",
        "import/no-duplicates": "error",

        "import/no-mutable-exports": "error",
        "import/no-named-default": "error",
        "import/no-self-import": "error",
        "import/no-webpack-loader-syntax": "error",
        "import/order": "error",
        "kirklin/import-dedupe": "error",
        "kirklin/no-import-node-modules-by-path": "error",

        ...stylistic
          ? {
              "import/newline-after-import": ["error", { considerComments: true, count: 1 }],
            }
          : {},
      },
    },
  ];
}
