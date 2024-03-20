import type { FlatConfigItem, OptionsFiles, OptionsOverrides, OptionsStylistic } from "../types";
import { GLOB_ASTRO } from "../globs";
import { interopDefault } from "../utils";

export async function astro(
  options: OptionsOverrides & OptionsStylistic & OptionsFiles = {},
): Promise<FlatConfigItem[]> {
  const {
    files = [GLOB_ASTRO],
    overrides = {},
    stylistic = true,
  } = options;

  const [
    pluginAstro,
    parserAstro,
    parserTs,
  ] = await Promise.all([
    interopDefault(import("eslint-plugin-astro")),
    interopDefault(import("astro-eslint-parser")),
    interopDefault(import("@typescript-eslint/parser")),
  ] as const);

  return [
    {
      name: "kirklin:astro:setup",
      plugins: {
        astro: pluginAstro,
      },
    },
    {
      files,
      languageOptions: {
        parser: parserAstro,
        parserOptions: {
          extraFileExtensions: [".astro"],
          parser: parserTs as any,
        },
      },
      name: "kirklin:astro:rules",
      rules: {
        "astro/no-set-html-directive": "off",

        ...stylistic
          ? {}
          : {},

        ...overrides,
      },
    },
  ];
}
