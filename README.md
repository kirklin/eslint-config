# @kirklin/eslint-config

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]
[![javascript_code style][code-style-image]][code-style-url]

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@kirklin/eslint-config?style=flat&colorA=080f12&colorB=3491fa
[npm-version-href]: https://npmjs.com/package/@kirklin/eslint-config
[npm-downloads-src]: https://img.shields.io/npm/dm/@kirklin/eslint-config?style=flat&colorA=080f12&colorB=3491fa
[npm-downloads-href]: https://npmjs.com/package/@kirklin/eslint-config
[license-src]: https://img.shields.io/github/license/kirklin/eslint-config.svg?style=flat&colorA=080f12&colorB=3491fa
[license-href]: https://github.com/kirklin/eslint-config/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=3491fa
[jsdocs-href]: https://www.jsdocs.io/package/@kirklin/eslint-config
[code-style-image]: https://img.shields.io/badge/code__style-%40kirklin%2Feslint--config-3491fa?style=flat&colorA=080f12&colorB=3491fa
[code-style-url]: https://github.com/kirklin/eslint-config/

<div align='left'>
<b>English</b> | <a href="README.zh-cn.md">简体中文</a>
<br>
</div>

## Features

- "double quotes", must semi;
- Auto fix for formatting (aimed to be used standalone **without** Prettier)
- Sorted imports, dangling commas
- Reasonable defaults, best practices, only one line of config
- Designed to work with TypeScript, JSX, Vue out-of-box
- Lints also for json, yaml, toml, markdown
- Opinionated, but [very customizable](#customization)
- [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new), compose easily!
- Using [ESLint Stylistic](https://github.com/eslint-stylistic/eslint-stylistic)
- Respects `.gitignore` by default
- Optional [React](#react), [Svelte](#svelte), [UnoCSS](#unocss) support
- Optional [formatters](#formatters) support for CSS, HTML, etc.
- **Style principle**: Minimal for reading, stable for diff, consistent

> [!IMPORTANT]
> Since v1.0.0, this config is rewritten to the new [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new), check the [release note](https://github.com/kirklin/eslint-config/releases/tag/v1.0.0) for more details.

## Usage

### Install

```bash
pnpm i -D eslint @kirklin/eslint-config
```

### Create config file

With [`"type": "module"`](https://nodejs.org/api/packages.html#type) in `package.json` (recommended):

```js
// eslint.config.js
import kirklin from "@kirklin/eslint-config";

export default kirklin();
```

With CJS:

```js
// eslint.config.js
const kirklin = require("@kirklin/eslint-config").default;

module.exports = kirklin();
```

> [!TIP]
> ESLint only detects `eslint.config.js` as the flat config entry, meaning you need to put `type: module` in your `package.json` or you have to use CJS in `eslint.config.js`. If you want explicit extension like `.mjs` or `.cjs`, or even `eslint.config.ts`, you can install [`eslint-ts-patch`](https://github.com/antfu/eslint-ts-patch) to fix it.

Combined with legacy config:

```js
// eslint.config.js
const kirklin = require("@kirklin/eslint-config").default;
const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat();

module.exports = kirklin(
  {
    ignores: [],
  },

  // Legacy config
  ...compat.config({
    extends: [
      "eslint:recommended",
      // Other extends...
    ],
  })

  // Other flat configs...
);
```

> Note that `.eslintignore` no longer works in Flat config, see [customization](#customization) for more details.

### Add script for package.json

For example:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

### Migration

We provided an experimental CLI tool to help you migrate from the legacy config to the new flat config.

```bash
npx @kirklin/eslint-config@latest
```

Before running the migration, make sure to commit your unsaved changes first.

## VS Code support (auto fix)

Install [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

Add the following settings to your `.vscode/settings.json`:

```jsonc
{
  // Enable the ESlint flat config support
  "eslint.experimental.useFlatConfig": true,

  // Disable the default formatter, use eslint instead
  "prettier.enable": false,
  "editor.formatOnSave": false,

  // Auto fix
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },

  // Silent the stylistic rules in you IDE, but still auto fix them
  "eslint.rules.customizations": [
    { "rule": "style/*", "severity": "off" },
    { "rule": "format/*", "severity": "off" },
    { "rule": "*-indent", "severity": "off" },
    { "rule": "*-spacing", "severity": "off" },
    { "rule": "*-spaces", "severity": "off" },
    { "rule": "*-order", "severity": "off" },
    { "rule": "*-dangle", "severity": "off" },
    { "rule": "*-newline", "severity": "off" },
    { "rule": "*quotes", "severity": "off" },
    { "rule": "*semi", "severity": "off" }
  ],

  // Enable eslint for all supported languages
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "html",
    "markdown",
    "json",
    "jsonc",
    "yaml",
    "toml"
  ]
}
```

## Customization

Since v1.0, we migrated to [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new). It provides much better organization and composition.

Normally you only need to import the `kirklin` preset:

```js
// eslint.config.js
import kirklin from "@kirklin/eslint-config";

export default kirklin();
```

And that's it! Or you can configure each integration individually, for example:

```js
// eslint.config.js
import kirklin from "@kirklin/eslint-config";

export default kirklin({
  // Enable stylistic formatting rules
  // stylistic: true,

  // Or customize the stylistic rules
  stylistic: {
    indent: 2, // 4, or 'tab'
    quotes: "double", // or 'single'
  },

  // TypeScript and Vue are auto-detected, you can also explicitly enable them:
  typescript: true,
  vue: true,

  // Disable jsonc and yaml support
  jsonc: false,
  yaml: false,

  // `.eslintignore` is no longer supported in Flat config, use `ignores` instead
  ignores: [
    "./fixtures",
    // ...globs
  ]
});
```

The `kirklin` factory function also accepts any number of arbitrary custom config overrides:

```js
// eslint.config.js
import kirklin from "@kirklin/eslint-config";

export default kirklin(
  {
    // Configures for kirklin's config
  },

  // From the second arguments they are ESLint Flat Configs
  // you can have multiple configs
  {
    files: ["**/*.ts"],
    rules: {},
  },
  {
    rules: {},
  },
);
```

Going more advanced, you can also import fine-grained configs and compose them as you wish:

<details>
<summary>Advanced Example</summary>

We wouldn't recommend using this style in general unless you know exactly what they are doing, as there are shared options between configs and might need extra care to make them consistent.

```js
// eslint.config.js
import {
  combine,
  comments,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  markdown,
  node,
  sortPackageJson,
  sortTsconfig,
  stylistic,
  toml,
  typescript,
  unicorn,
  vue,
  yaml,
} from "@kirklin/eslint-config";

export default combine(
  ignores(),
  javascript(/* Options */),
  comments(),
  node(),
  jsdoc(),
  imports(),
  unicorn(),
  typescript(/* Options */),
  stylistic(),
  vue(),
  jsonc(),
  yaml(),
  toml(),
  markdown(),
);
```

</details>

Check out the [configs](https://github.com/kirklin/eslint-config/blob/main/src/configs) and [factory](https://github.com/kirklin/eslint-config/blob/main/src/factory.ts) for more details.

> Thanks to [sxzz/eslint-config](https://github.com/sxzz/eslint-config) for the inspiration and reference.

### Plugins Renaming

Since flat config requires us to explicitly provide the plugin names (instead of the mandatory convention from npm package name), we renamed some plugins to make the overall scope more consistent and easier to write.

| New Prefix | Original Prefix        | Source Plugin                                                                              |
| ---------- | ---------------------- | ------------------------------------------------------------------------------------------ |
| `import/*` | `i/*`                  | [eslint-plugin-i](https://github.com/un-es/eslint-plugin-i)                                |
| `node/*`   | `n/*`                  | [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n)                     |
| `yaml/*`   | `yml/*`                | [eslint-plugin-yml](https://github.com/ota-meshi/eslint-plugin-yml)                        |
| `ts/*`     | `@typescript-eslint/*` | [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint) |
| `style/*`  | `@stylistic/*`         | [@stylistic/eslint-plugin](https://github.com/eslint-stylistic/eslint-stylistic)           |
| `test/*`   | `vitest/*`             | [eslint-plugin-vitest](https://github.com/veritem/eslint-plugin-vitest)                    |
| `test/*`   | `no-only-tests/*`      | [eslint-plugin-no-only-tests](https://github.com/levibuzolic/eslint-plugin-no-only-tests)  |

When you want to override rules, or disable them inline, you need to update to the new prefix:

```diff
-// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
+// eslint-disable-next-line ts/consistent-type-definitions
type foo = { bar: 2 }
```

### Rules Overrides

Certain rules would only be enabled in specific files, for example, `ts/*` rules would only be enabled in `.ts` files and `vue/*` rules would only be enabled in `.vue` files. If you want to override the rules, you need to specify the file extension:

```js
// eslint.config.js
import kirklin from "@kirklin/eslint-config";

export default kirklin(
  {
    vue: true,
    typescript: true
  },
  {
    // Remember to specify the file glob here, otherwise it might cause the vue plugin to handle non-vue files
    files: ["**/*.vue"],
    rules: {
      "vue/operator-linebreak": ["error", "before"],
    },
  },
  {
    // Without `files`, they are general rules for all files
    rules: {
      "style/semi": ["error", "never"],
    },
  }
);
```

We also provided a `overrides` options in each integration to make it easier:

```js
// eslint.config.js
import kirklin from "@kirklin/eslint-config";

export default kirklin({
  vue: {
    overrides: {
      "vue/operator-linebreak": ["error", "before"],
    },
  },
  typescript: {
    overrides: {
      "ts/consistent-type-definitions": ["error", "interface"],
    },
  },
  yaml: {
    overrides: {
      // ...
    },
  },
});
```

### Optional Configs

We provide some optional configs for specific use cases, that we don't include their dependencies by default.

#### Formatters

> [!WARNING]
> Experimental feature, changes might not follow semver.

Use external formatters to format files that ESLint cannot handle yet (`.css`, `.html`, etc). Powered by [`eslint-plugin-format`](https://github.com/kirklin/eslint-plugin-format).

```js
// eslint.config.js
import kirklin from "@kirklin/eslint-config";

export default kirklin({
  formatters: {
    /**
     * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
     * By default uses Prettier
     */
    css: true,
    /**
     * Format HTML files
     * By default uses Prettier
     */
    html: true,
    /**
     * Format Markdown files
     * Supports Prettier and dprint
     * By default uses Prettier
     */
    markdown: "prettier"
  }
});
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
npm i -D eslint-plugin-format
```

#### React

To enable React support, you need to explicitly turn it on:

```js
// eslint.config.js
import kirklin from "@kirklin/eslint-config";

export default kirklin({
  react: true,
});
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
npm i -D eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh
```

#### Svelte

To enable svelte support, you need to explicitly turn it on:

```js
// eslint.config.js
import kirklin from "@kirklin/eslint-config";

export default kirklin({
  svelte: true,
});
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
npm i -D eslint-plugin-svelte
```

#### UnoCSS

To enable UnoCSS support, you need to explicitly turn it on:

```js
// eslint.config.js
import kirklin from "@kirklin/eslint-config";

export default kirklin({
  unocss: true,
});
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
npm i -D @unocss/eslint-plugin
```

### Optional Rules

This config also provides some optional plugins/rules for extended usage.

#### `perfectionist` (sorting)

This plugin [`eslint-plugin-perfectionist`](https://github.com/azat-io/eslint-plugin-perfectionist) allows you to sorted object keys, imports, etc, with auto-fix.

The plugin is installed but no rules are enabled by default.

It's recommended to opt-in on each file individually using [configuration comments](https://eslint.org/docs/latest/use/configure/rules#using-configuration-comments-1).

```js
/* eslint perfectionist/sort-objects: "error" */
const objectWantedToSort = {
  a: 2,
  b: 1,
  c: 3,
};
/* eslint perfectionist/sort-objects: "off" */
```

### Type Aware Rules

You can optionally enable the [type aware rules](https://typescript-eslint.io/linting/typed-linting/) by passing the options object to the `typescript` config:

```js
// eslint.config.js
import kirklin from "@kirklin/eslint-config";

export default kirklin({
  typescript: {
    tsconfigPath: "tsconfig.json",
  },
});
```

### Lint Staged

If you want to apply lint and auto-fix before every commit, you can add the following to your `package.json`:

```json
{
  "simple-git-hooks": {
    "pre-commit": "pnpm lint-staged"
  },
  "lint-staged": {
    "*": "eslint --fix"
  }
}
```

and then

```bash
npm i -D lint-staged simple-git-hooks

// to active the hooks
npx simple-git-hooks
```

## View what rules are enabled

I built a visual tool to help you view what rules are enabled in your project and apply them to what files, [eslint-flat-config-viewer](https://github.com/kirklin/eslint-flat-config-viewer)

Go to your project root that contains `eslint.config.js` and run:

```bash
npx eslint-flat-config-viewer
```

## Versioning Policy

This project follows [Semantic Versioning](https://semver.org/) for releases. However, since this is just a config and involves opinions and many moving parts, we don't treat rules changes as breaking changes.

### Changes Considered as Breaking Changes

- Node.js version requirement changes
- Huge refactors that might break the config
- Plugins made major changes that might break the config
- Changes that might affect most of the codebases

### Changes Considered as Non-breaking Changes

- Enable/disable rules and plugins (that might become stricter)
- Rules options changes
- Version bumps of dependencies

## Badge

Use this in one of your projects? Include one of these badges in your readme to
let people know that your code is using the Kirk Lin style.

[![kirklin-code-style-image](https://img.shields.io/badge/code__style-%40kirklin%2Feslint--config-3491fa?style=flat&colorA=080f12&colorB=3491fa)](https://github.com/kirklin/eslint-config/)

```markdown
[![kirklin-code-style-image](https://img.shields.io/badge/code__style-%40kirklin%2Feslint--config-3491fa?style=flat&colorA=080f12&colorB=3491fa)](https://github.com/kirklin/eslint-config/)
```

[code-style-image]: https://img.shields.io/badge/code__style-%40kirklin%2Feslint--config-3491fa?style=flat&colorA=080f12&colorB=3491fa
[code-style-url]: https://github.com/kirklin/eslint-config/

## Thanks

This project is based on [@antfu/eslint-config](https://github.com/antfu/eslint-config)

## Check Also

- [kirklin/dotfiles](https://github.com/kirklin/dotfiles) - My dotfiles
- [kirklin/vscode-settings](https://github.com/kirklin/vscode-settings) - My VS Code settings

## License

[MIT](./LICENSE) License &copy; 2019-PRESENT [Kirk Lin](https://github.com/kirklin)
