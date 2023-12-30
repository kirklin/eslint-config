import type { FlatConfigItem, OptionsStylistic } from "../types";
import { pluginImport, pluginKirkLin } from "../plugins";
import { GLOB_SRC_EXT } from "../globs";

export async function imports(options: OptionsStylistic = {}): Promise<FlatConfigItem[]> {
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
        // 'kirklin/no-import-dist': 'error',
        "kirklin/no-import-node-modules-by-path": "error",

        ...stylistic
          ? {
              "import/newline-after-import": ["error", { considerComments: true, count: 1 }],
            }
          : {},
      },
    },
    {
      files: ["**/bin/**/*", `**/bin.${GLOB_SRC_EXT}`],
      name: "kirklin:imports:bin",
      rules: {
        // 'kirklin/no-import-dist': 'off',
        "kirklin/no-import-node-modules-by-path": "off",
      },
    },
  ];
}
