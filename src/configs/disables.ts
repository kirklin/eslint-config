import type { TypedFlatConfigItem } from "../types";

import { GLOB_SRC, GLOB_SRC_EXT } from "../globs";

export async function disables(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      files: [`**/scripts/${GLOB_SRC}`],
      name: "kirklin/disables/scripts",
      rules: {
        "kirklin/no-top-level-await": "off",
        "no-console": "off",
        "ts/explicit-function-return-type": "off",
      },
    },
    {
      files: [`**/cli/${GLOB_SRC}`, `**/cli.${GLOB_SRC_EXT}`],
      name: "kirklin/disables/cli",
      rules: {
        "kirklin/no-top-level-await": "off",
        "no-console": "off",
      },
    },
    {
      files: ["**/bin/**/*", `**/bin.${GLOB_SRC_EXT}`],
      name: "kirklin/disables/bin",
      rules: {
        "kirklin/no-import-dist": "off",
        "kirklin/no-import-node-modules-by-path": "off",
      },
    },
    {
      files: ["**/*.d.?([cm])ts"],
      name: "kirklin/disables/dts",
      rules: {
        "eslint-comments/no-unlimited-disable": "off",
        "no-restricted-syntax": "off",
        "unused-imports/no-unused-vars": "off",
      },
    },
    {
      files: ["**/*.js", "**/*.cjs"],
      name: "kirklin/disables/cjs",
      rules: {
        "ts/no-require-imports": "off",
      },
    },
    {
      files: [`**/*.config.${GLOB_SRC_EXT}`, `**/*.config.*.${GLOB_SRC_EXT}`],
      name: "kirklin/disables/config-files",
      rules: {
        "kirklin/no-top-level-await": "off",
        "no-console": "off",
        "ts/explicit-function-return-type": "off",
      },
    },
  ];
}
