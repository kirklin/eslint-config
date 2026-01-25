import type { OptionsOverrides, StylisticConfig, TypedFlatConfigItem } from "../types";
import { pluginKirkLin } from "../plugins";
import { interopDefault } from "../utils";

export const StylisticConfigDefaults: StylisticConfig = {
  experimental: false,
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
    experimental,
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
    experimental,
    indent,
    jsx,
    pluginName: "style",
    quotes,
    semi,
  }) as TypedFlatConfigItem;

  return [
    {
      name: "kirklin/stylistic/rules",
      plugins: {
        kirklin: pluginKirkLin,
        style: pluginStylistic,
      },
      rules: {
        ...config.rules,

        ...experimental
          ? {}
          : {
              "kirklin/consistent-list-newline": "error",
            },

        "kirklin/consistent-chaining": "error",
        "kirklin/consistent-list-newline": "error",
        "style/brace-style": ["error", "1tbs", { allowSingleLine: false }],
        "style/member-delimiter-style": ["error", { multiline: { delimiter: "semi" } }],

        ...(lessOpinionated
          ? {
              curly: ["error", "all"],
            }
          : {
              "curly": ["error", "all"],
              "kirklin/if-newline": "error",
              "kirklin/top-level-function": "error",
            }
        ),

        "style/generator-star-spacing": ["error", { after: true, before: false }],
        "style/yield-star-spacing": ["error", { after: true, before: false }],

        ...overrides,
      },
    },
  ];
}
