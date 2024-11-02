import type { TypedFlatConfigItem } from "../types";

import { pluginPerfectionist } from "../plugins";

/**
 * Perfectionist plugin for props and items sorting.
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export async function perfectionist(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: "kirklin/perfectionist/setup",
      plugins: {
        perfectionist: pluginPerfectionist,
      },
      rules: {
        "perfectionist/sort-exports": ["error", { order: "asc", type: "natural" }],
        "perfectionist/sort-imports": ["error", {
          groups: [
            "type",
            ["parent-type", "sibling-type", "index-type"],

            "builtin",
            "external",
            ["internal", "internal-type"],
            ["parent", "sibling", "index"],
            "side-effect",
            "object",
            "unknown",
          ],
          newlinesBetween: "ignore",
          order: "asc",
          type: "natural",
        }],
        "perfectionist/sort-named-exports": ["error", { order: "asc", type: "natural" }],
        "perfectionist/sort-named-imports": ["error", { order: "asc", type: "natural" }],
      },
    },
  ];
}
