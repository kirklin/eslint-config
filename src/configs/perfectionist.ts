import type { ConfigItem } from "../types";
import { pluginPerfectionist } from "../plugins";

/**
 * Optional perfectionist plugin for props and items sorting.
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export function perfectionist(): ConfigItem[] {
  return [
    {
      name: "kirklin:perfectionist",
      plugins: {
        perfectionist: pluginPerfectionist,
      },
    },
  ];
}
