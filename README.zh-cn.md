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
<a href="README.md">English</a> | <b>简体中文</b>
<br>
</div>

## Features

- “双引号”，必须有分号;
- 自动修复格式（旨在独立使用 **不包括** Prettier）
- 排序导入项，悬挂逗号
- 合理的默认设置，最佳实践，只需一行配置
- 设计用于与TypeScript，JSX，Vue无缝配合
- 对json，yaml，toml，markdown等进行语法检查
- 有主见，但可[非常定制化](#customization)
- [ESLint Flat配置](https://eslint.org/docs/latest/use/configure/configuration-files-new)，轻松组合！
- 使用[ESLint Stylistic](https://github.com/eslint-stylistic/eslint-stylistic)
- 默认情况下遵守`.gitignore`
- 可选的[React](#react)，[Svelte](#svelte)，[UnoCSS](#unocss)支持
- 可选的[格式化程序](#formatters)支持CSS，HTML等。
- **样式原则**：最小化阅读，稳定的差异性，保持一致性

> [!IMPORTANT]
> 从v1.0.0开始，该配置已重写为新的 [ESLint Flat配置](https://eslint.org/docs/latest/use/configure/configuration-files-new), 请查看[发布说明](https://github.com/kirklin/eslint-config/releases/tag/v1.0.0)以获取更多详细信息。

## 使用

### 安装

```bash
pnpm i -D eslint @kirklin/eslint-config
```

### 创建配置文件

使用 `package.json` 中的 [`"type": "module"`](https://nodejs.org/api/packages.html#type) (推荐):

```js
// eslint.config.js
import kirklin from "@kirklin/eslint-config";

export default kirklin();
```

使用 CJS:

```js
// eslint.config.js
const kirklin = require("@kirklin/eslint-config").default;

module.exports = kirklin();
```

> [!TIP]
> ESLint只检测`eslint.config.js`作为扁平配置的入口，这意味着您需要在`package.json`中放置`type: module`，或者您必须在`eslint.config.js`中使用CJS。如果您想要明确的扩展名，如`.mjs`或`.cjs`，甚至是`eslint.config.ts`，您可以安装[`eslint-ts-patch`](https://github.com/antfu/eslint-ts-patch)来修复此问题。

结合旧有的配置：

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

> 请注意，在Flat配置中不再支持 `.eslintignore`，请查看[自定义](#customization)以获取更多详细信息。

### 为 package.json添加script

例如：

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

### 迁移

我们提供了一个实验性的CLI工具，可以帮助您从传统配置迁移到新的扁平配置。

```bash
npx @kirklin/eslint-config@latest
```

在运行迁移之前，请确保先提交您未保存的更改。

## VS Code支持（自动修复）

安装 [VS Code ESLint扩展](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

将以下设置添加到您的 `.vscode/settings.json`:

```jsonc
{
  // 启用ESlint Flat配置支持
  "eslint.experimental.useFlatConfig": true,

  // 禁用默认格式化程序，使用eslint代替
  "prettier.enable": false,
  "editor.formatOnSave": false,

  // 自动修复
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },

  // 在IDE中静默风格规则，但仍自动修复它们
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

  // 为所有支持的语言启用eslint
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

## 自定义

从v1.0开始，我们迁移到了[ESLint Flat 配置](https://eslint.org/docs/latest/use/configure/configuration-files-new)。它提供了更好的组织和组合。

通常，您只需要导入 `kirklin` 预设：

```js
// eslint.config.js
import kirklin from "@kirklin/eslint-config";

export default kirklin();
```

就是这样！或者您还可以单独配置每个集成，例如：

```js
// eslint.config.js
import kirklin from "@kirklin/eslint-config";

export default kirklin({
  // 启用风格格式规则
  // stylistic: true,

  // 或自定义风格规则
  stylistic: {
    indent: 2, // 4或'tab'
    quotes: "double", // 或'single'
  },

  // TypeScript和Vue会自动检测，您也可以显式启用它们：
  typescript: true,
  vue: true,

  // 禁用jsonc和yaml支持
  jsonc: false,
  yaml: false,

  // 在Flat配置中不再支持`.eslintignore`，请使用`ignores`代替
  ignores: [
    "**/fixtures",
    // ...globs
  ]
});
```

`kirklin` 工厂函数还接受任意数量的自定义配置覆盖：

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

更高级的情况下，您还可以导入细粒度的配置并根据需要组合它们：

<details>
<summary>高级示例</summary>

我们不建议在一般用途中使用这种样式，因为在配置之间可能存在共享选项，可能需要额外的注意以使它们一致。

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

查看[configs](https://github.com/kirklin/eslint-config/blob/main/src/configs)和[factory](https://github.com/kirklin/eslint-config/blob/main/src/factory.ts)以获取更多详细信息。

> 感谢 [sxzz/eslint-config](https://github.com/sxzz/eslint-config) 提供灵感和参考。

### 插件重命名

由于Flat配置要求我们明确提供插件名称（而不是从npm包名称强制性约定），我们已经重命名了一些插件，以使整体范围更一致且更容易编写。

| New Prefix | Original Prefix        | Source Plugin                                                                              |
| ---------- | ---------------------- | ------------------------------------------------------------------------------------------ |
| `import/*` | `i/*`                  | [eslint-plugin-i](https://github.com/un-es/eslint-plugin-i)                                |
| `node/*`   | `n/*`                  | [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n)                     |
| `yaml/*`   | `yml/*`                | [eslint-plugin-yml](https://github.com/ota-meshi/eslint-plugin-yml)                        |
| `ts/*`     | `@typescript-eslint/*` | [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint) |
| `style/*`  | `@stylistic/*`         | [@stylistic/eslint-plugin](https://github.com/eslint-stylistic/eslint-stylistic)           |
| `test/*`   | `vitest/*`             | [eslint-plugin-vitest](https://github.com/veritem/eslint-plugin-vitest)                    |
| `test/*`   | `no-only-tests/*`      | [eslint-plugin-no-only-tests](https://github.com/levibuzolic/eslint-plugin-no-only-tests)  |

当您想要覆盖规则或在内联中禁用它们时，您需要更新新前缀：

```diff
-// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
+// eslint-disable-next-line ts/consistent-type-definitions
type foo = { bar: 2 }
```

### 规则覆盖

某些规则仅在特定文件中启用，例如， `ts/*` 规则仅在 `.ts` 文件中启用， `vue/*` 规则仅在 `.vue` 文件中启用。如果要覆盖规则，需要指定文件扩展名：

```js
// eslint.config.js
import kirklin from "@kirklin/eslint-config";

export default kirklin(
  {
    vue: true,
    typescript: true
  },
  {
    // 记得在这里指定文件glob，否则可能会导致vue插件处理非vue文件
    files: ["**/*.vue"],
    rules: {
      "vue/operator-linebreak": ["error", "before"],
    },
  },
  {
    // 没有`files`，它们是所有文件的一般规则
    rules: {
      "style/semi": ["error", "never"],
    },
  }
);
```

我们还提供了一个 `overrides` 选项，以使其更容易：

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

### 可选配置

我们提供了一些针对特定用例的可选配置，这些配置在默认情况下不包括它们的依赖项。

#### 格式化器

> [!WARNING]
> 实验性功能，更改可能不遵循语义版本规范。

使用外部格式化器格式化ESLint无法处理的文件（`.css`，`.html`等）。由[`eslint-plugin-format`](https://github.com/kirklin/eslint-plugin-format)提供支持。

```js
// eslint.config.js
import kirklin from "@kirklin/eslint-config";

export default kirklin({
  formatters: {
    /**
     * 格式化CSS、LESS、SCSS文件，以及Vue中的`<style>`块
     * 默认情况下使用Prettier
     */
    css: true,
    /**
     * 格式化HTML文件
     * 默认情况下使用Prettier
     */
    html: true,
    /**
     * 格式化Markdown文件
     * 支持Prettier和dprint
     * 默认情况下使用Prettier
     */
    markdown: "prettier"
  }
});
```

运行 `npx eslint` 应该会提示您安装所需的依赖项，否则，您可以手动安装它们：

```bash
npm i -D eslint-plugin-format
```

#### React

要启用React支持，您需要明确地将其打开：

```js
// eslint.config.js
import kirklin from "@kirklin/eslint-config";

export default kirklin({
  react: true,
});
```

运行 npx eslint 应该会提示您安装所需的依赖项，否则，您可以手动安装它们：

```bash
npm i -D eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh
```

#### Svelte

要启用Svelte支持，您需要明确地将其打开：

```js
// eslint.config.js
import kirklin from "@kirklin/eslint-config";

export default kirklin({
  svelte: true,
});
```

运行 `npx eslint` 应该会提示您安装所需的依赖项，否则，您可以手动安装它们：

```bash
npm i -D eslint-plugin-svelte
```

#### UnoCSS

要启用UnoCSS支持，您需要明确地将其打开：

```js
// eslint.config.js
import kirklin from "@kirklin/eslint-config";

export default kirklin({
  unocss: true,
});
```

运行 `npx eslint` 应该会提示您安装所需的依赖项，否则，您可以手动安装它们：

```bash
npm i -D @unocss/eslint-plugin
```

### 可选规则

此配置还提供了一些用于扩展用途的可选插件/规则。

#### `perfectionist`（排序）

此插件 [`eslint-plugin-perfectionist`](https://github.com/azat-io/eslint-plugin-perfectionist) 允许您对对象键、导入等进行自动修复的排序。

插件已安装，但默认情况下不启用任何规则。

建议通过使用[配置注释](https://eslint.org/docs/latest/use/configure/rules#using-configuration-comments-1)来为每个文件单独选择启用。

```js
/* eslint perfectionist/sort-objects: "error" */
const objectWantedToSort = {
  a: 2,
  b: 1,
  c: 3,
};
/* eslint perfectionist/sort-objects: "off" */
```

### 类型感知规则

您可以通过将选项对象传递给`typescript`配置来选择启用[类型感知规则](https://typescript-eslint.io/linting/typed-linting/)：

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

如果您想在每次提交之前应用lint和自动修复，可以将以下内容添加到您的 `package.json` 中：

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

然后运行：

```bash
npm i -D lint-staged simple-git-hooks

// to active the hooks
npx simple-git-hooks
```

## 查看启用的规则

我创建了一个可视化工具，帮助您查看项目中启用了哪些规则，并将它们应用于哪些文件，[eslint-flat-config-viewer](https://github.com/kirklin/eslint-flat-config-viewer)

前往包含 `eslint.config.js` 的项目根目录，并运行：

```bash
npx eslint-flat-config-viewer
```

## 版本控制策略

本项目遵循[语义化版本控制](https://semver.org/)用于发布。然而，由于这只是一个配置文件，涉及意见和许多不断变化的部分，我们不将规则更改视为破坏性更改。

### 被视为破坏性更改的变化

- Node.js 版本要求的更改
- 可能破坏配置的大规模重构
- 插件进行了可能破坏配置的重大更改
- 可能影响大部分代码库的更改

### 被视为非破坏性更改的变化

- 启用/禁用规则和插件（可能更加严格）
- 规则选项的更改
- 依赖项的版本升级

## 徽章

在你的项目中使用此配置？在你的自述文件中包括以下徽章，以告知人们你的代码正在使用Kirk Lin的代码风格。

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
