import type { OptionsOverrides, OptionsStylistic, TypedFlatConfigItem } from "../types";
import { pluginImportLite, pluginKirkLin } from "../plugins";

export async function imports(options: OptionsOverrides & OptionsStylistic = {}): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
    stylistic = true,
  } = options;

  return [
    {
      name: "kirklin/imports/rules",
      plugins: {
        import: pluginImportLite,
        kirklin: pluginKirkLin,
      },
      rules: {
        "import/consistent-type-specifier-style": ["error", "top-level"],
        "import/first": "error",
        "import/no-duplicates": "error",

        "import/no-mutable-exports": "error",
        "import/no-named-default": "error",
        "kirklin/import-dedupe": "error",
        "kirklin/no-import-dist": "error",
        "kirklin/no-import-node-modules-by-path": "error",

        ...stylistic
          ? {
              "import/newline-after-import": ["error", { count: 1 }],
            }
          : {},

        ...overrides,
      },
    },
  ];
}
