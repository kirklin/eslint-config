import { interopDefault } from "../utils";
import type { FlatConfigItem, OptionsOverrides, StylisticConfig } from "../types";
import { pluginKirkLin } from "../plugins";

export const StylisticConfigDefaults: StylisticConfig = {
  indent: 2,
  jsx: true,
  quotes: "double",
  semi: true,
};

export async function stylistic(
  options: StylisticConfig & OptionsOverrides = {},
): Promise<FlatConfigItem[]> {
  const {
    indent,
    jsx,
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
      name: "kirklin:stylistic",
      plugins: {
        kirklin: pluginKirkLin,
        style: pluginStylistic,
      },
      rules: {
        ...config.rules,

        "curly": ["error", "all"],
        "kirklin/consistent-list-newline": "error",
        "kirklin/if-newline": "error",
        "kirklin/top-level-function": "error",
        "style/brace-style": ["error", "1tbs", { allowSingleLine: false }],
        "style/member-delimiter-style": ["error", { multiline: { delimiter: "semi" } }],

        ...overrides,
      },
    },
  ];
}
