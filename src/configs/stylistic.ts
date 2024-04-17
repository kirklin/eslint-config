import { interopDefault } from "../utils";
import type { OptionsOverrides, StylisticConfig, TypedFlatConfigItem } from "../types";
import { pluginKirkLin } from "../plugins";

export const StylisticConfigDefaults: StylisticConfig = {
  indent: 2,
  jsx: true,
  quotes: "double",
  semi: true,
};

export interface StylisticOptions extends StylisticConfig, OptionsOverrides {
  lessOpinionated?: boolean;
}

export async function stylistic(
  options: StylisticOptions = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    indent,
    jsx,
    lessOpinionated = false,
    overrides = {},
    quotes,
    semi,
  } = {
    ...StylisticConfigDefaults,
    ...options,
  };

  const pluginStylistic = await interopDefault(import("@stylistic/eslint-plugin"));

  const config = pluginStylistic.configs.customize({
    flat: true,
    indent,
    jsx,
    pluginName: "style",
    quotes,
    semi,
  });

  return [
    {
      name: "kirklin/stylistic/rules",
      plugins: {
        kirklin: pluginKirkLin,
        style: pluginStylistic,
      },
      rules: {
        ...config.rules,

        "kirklin/consistent-list-newline": "error",
        "style/brace-style": ["error", "1tbs", { allowSingleLine: false }],
        "style/member-delimiter-style": ["error", { multiline: { delimiter: "semi" } }],

        ...(lessOpinionated
          ? {
              curly: ["error", "multi-or-nest", "consistent"],
            }
          : {
              "curly": ["error", "all"],
              "kirklin/if-newline": "error",
              "kirklin/top-level-function": "error",
            }
        ),

        ...overrides,
      },
    },
  ];
}
