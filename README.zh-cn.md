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
- 可选的[React](#react), [Next.js](#nextjs), [Svelte](#svelte), [UnoCSS](#unocss), [Astro](#astro), [Solid](#solid)支持
- 可选的[格式化程序](#formatters)支持CSS，HTML，XML等。
- **样式原则**：最小化阅读，稳定的差异性，保持一致性

> [!NOTE]
> 自 v1.0.0 版本起，该配置已重写为新的 [ESLint Flat 配置](https://eslint.org/docs/latest/use/configure/configuration-files-new)，详细信息请查看 [发布说明](https://github.com/kirklin/eslint-config/releases/tag/v1.0.0)。
>
> 自 v2.7.0 版本起，现要求使用 ESLint v9.5.0 及以上版本。

## 使用方法

### 起始向导

我们提供了一个命令行工具，帮助您快速设置项目，或者通过一个命令从旧的配置迁移到新的平面配置。

```bash
pnpm dlx @kirklin/eslint-config@latest
```

### 手动安装

如果您更喜欢手动设置：

```bash
pnpm i -D eslint @kirklin/eslint-config
```

然后在您的项目根目录下创建 `eslint.config.mjs` 文件：

```js
// eslint.config.mjs
import kirklin from "@kirklin/eslint-config";

export default kirklin();
```

<details>
<summary>
 结合旧版配置:
</summary>

如果您仍然使用旧版`eslintrc`的一些配置，您可以使用[`@eslint/eslintrc`](https://www.npmjs.com/package/@eslint/eslintrc)将它们转换为flat config

```js
import { FlatCompat } from "@eslint/eslintrc";
// eslint.config.mjs
import kirklin from "@kirklin/eslint-config";

const compat = new FlatCompat();

export default kirklin(
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

> 请注意，在Flat配置中不再支持 `.eslintignore`，请查看[自定义](#自定义)以获取更多详细信息。

</details>

### 在 package.json 中添加脚本

For example:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

## IDE 支持（保存时自动修复）

<details>
<summary>🟦 VS Code 支持</summary>

<br>

安装 [VS Code ESLint 插件](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

在 `.vscode/settings.json` 中添加以下设置：

```jsonc
{
  // 禁用默认格式化器，使用 eslint 代替
  "prettier.enable": false,
  "editor.formatOnSave": false,

  // 自动修复
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },

  // 在IDE中静默样式规则，但仍然自动修复
  "eslint.rules.customizations": [
    { "rule": "style/*", "severity": "off", "fixable": true },
    { "rule": "format/*", "severity": "off", "fixable": true },
    { "rule": "*-indent", "severity": "off", "fixable": true },
    { "rule": "*-spacing", "severity": "off", "fixable": true },
    { "rule": "*-spaces", "severity": "off", "fixable": true },
    { "rule": "*-order", "severity": "off", "fixable": true },
    { "rule": "*-dangle", "severity": "off", "fixable": true },
    { "rule": "*-newline", "severity": "off", "fixable": true },
    { "rule": "*quotes", "severity": "off", "fixable": true },
    { "rule": "*semi", "severity": "off", "fixable": true }
  ],

  // 为所有支持的语言启用 eslint
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
    "toml",
    "xml",
    "gql",
    "graphql",
    "astro",
    "svelte",
    "css",
    "less",
    "scss",
    "pcss",
    "postcss"
  ]
}
```

</details>

<details>
<summary>🟩 Neovim 支持</summary>

<br>

更新你的配置，使用以下内容：

```lua
local customizations = {
  { rule = 'style/*', severity = 'off', fixable = true },
  { rule = 'format/*', severity = 'off', fixable = true },
  { rule = '*-indent', severity = 'off', fixable = true },
  { rule = '*-spacing', severity = 'off', fixable = true },
  { rule = '*-spaces', severity = 'off', fixable = true },
  { rule = '*-order', severity = 'off', fixable = true },
  { rule = '*-dangle', severity = 'off', fixable = true },
  { rule = '*-newline', severity = 'off', fixable = true },
  { rule = '*quotes', severity = 'off', fixable = true },
  { rule = '*semi', severity = 'off', fixable = true },
}

local lspconfig = require('lspconfig')
-- 为所有支持的语言启用 eslint
lspconfig.eslint.setup(
  {
    filetypes = {
      "javascript",
      "javascriptreact",
      "javascript.jsx",
      "typescript",
      "typescriptreact",
      "typescript.tsx",
      "vue",
      "html",
      "markdown",
      "json",
      "jsonc",
      "yaml",
      "toml",
      "xml",
      "gql",
      "graphql",
      "astro",
      "svelte",
      "css",
      "less",
      "scss",
      "pcss",
      "postcss"
    },
    settings = {
      -- 在IDE中静默样式规则，但仍然自动修复
      rulesCustomizations = customizations,
    },
  }
)
```

### Neovim 保存时格式化

在 Neovim 中实现保存时格式化有几种方法：

- `nvim-lspconfig` 预定义了 `EslintFixAll` 命令，你可以创建一个 autocmd，在保存文件后调用该命令。

```lua
lspconfig.eslint.setup({
  --- ...
  on_attach = function(client, bufnr)
    vim.api.nvim_create_autocmd("BufWritePre", {
      buffer = bufnr,
      command = "EslintFixAll",
    })
  end,
})
```

- 使用 [conform.nvim](https://github.com/stevearc/conform.nvim)。
- 使用 [none-ls](https://github.com/nvimtools/none-ls.nvim)。
- 使用 [nvim-lint](https://github.com/mfussenegger/nvim-lint)。

</details>

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
  // 项目类型。'lib' 表示库，默认是 'app'
  type: "lib",

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

| New Prefix | Original Prefix        | Source Plugin                                                                                         |
| ---------- | ---------------------- | ----------------------------------------------------------------------------------------------------- |
| `import/*` | `import-lite/*`        | [eslint-plugin-import-lite](https://github.com/9romise/eslint-plugin-import-lite)                     |
| `node/*`   | `n/*`                  | [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n)                                |
| `yaml/*`   | `yml/*`                | [eslint-plugin-yml](https://github.com/ota-meshi/eslint-plugin-yml)                                   |
| `ts/*`     | `@typescript-eslint/*` | [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint)            |
| `style/*`  | `@stylistic/*`         | [@stylistic/eslint-plugin](https://github.com/eslint-stylistic/eslint-stylistic)                      |
| `test/*`   | `vitest/*`             | [@vitest/eslint-plugin](https://github.com/vitest-dev/eslint-plugin-vitest)                           |
| `test/*`   | `no-only-tests/*`      | [eslint-plugin-no-only-tests](https://github.com/levibuzolic/eslint-plugin-no-only-tests)             |
| `next/*`   | `@next/next`           | [@next/eslint-plugin-next](https://github.com/vercel/next.js/tree/canary/packages/eslint-plugin-next) |

当您想要覆盖规则或在内联中禁用它们时，您需要更新新前缀：

```diff
-// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
+// eslint-disable-next-line ts/consistent-type-definitions
type foo = { bar: 2 }
```

> [!NOTE]
> 关于插件重命名 - 实际上这是一个相当危险的举动，可能会导致潜在的命名冲突，如[这里](https://github.com/eslint/eslint/discussions/17766) 和 [这里](https://github.com/prettier/eslint-config-prettier#eslintconfigjs-flat-config-plugin-caveat) 所指出的。由于这个配置非常**个人化**和**主观化**，我雄心勃勃地将这个配置定位为每个项目唯一的**"顶层"**配置，这可能会改变规则命名的偏好。
>
> 这个配置更关心面向用户的体验，试图简化实现细节。例如，用户可以继续使用语义化的 `import/order`，而无需知道底层插件已经迁移到 `eslint-plugin-i` 然后再到 `eslint-plugin-import-x`。用户也不被迫在中途迁移到隐式的 `i/order`，仅仅因为我们将实现换成了一个分支。
>
> 话虽如此，这可能仍然不是一个好主意。如果你正在维护自己的 eslint 配置，你可能不想这样做。
>
> 如果你想将这个配置与其他配置预设组合使用，但遇到了命名冲突，请随时提出问题。我很乐意找出一种方法让它们协同工作。但目前我没有计划撤销重命名。

从 v2.3.0 版本开始，这个预设将自动重命名插件，也适用于您的自定义配置。您可以使用原始前缀直接覆盖规则。

<details>
<summary>恢复原始前缀</summary>

如果你确实想使用原始前缀，可以通过以下方式还原插件重命名：

```ts
import kirklin from "@kirklin/eslint-config";

export default kirklin()
  .renamePlugins({
    ts: "@typescript-eslint",
    yaml: "yml",
    node: "n"
    // ...
  });
```

</details>

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

### 配置组合器

从 v2.3.0 版本开始，工厂函数 `kirklin()` 返回了一个来自 `eslint-flat-config-utils` 的 [`FlatConfigComposer` 对象](https://github.com/kirklin/eslint-flat-config-utils#composer)。您可以链式调用方法，以更加灵活地组合配置。

```js
// eslint.config.js
import kirklin from "@kirklin/eslint-config";

export default kirklin()
  .prepend(
    // 主配置之前的一些配置
  )
  // 覆盖任何命名配置
  .override(
    "kirklin/imports",
    {
      rules: {
        "import/order": ["error", { "newlines-between": "always" }],
      }
    }
  )
  // 重命名插件前缀
  .renamePlugins({
    "old-prefix": "new-prefix",
    // ...
  });
// ...
```

这段代码展示了如何使用 `FlatConfigComposer` 来更加精细地控制您的 ESLint 配置。通过 `prepend` 方法，您可以在主配置之前添加一些配置。`override` 方法允许您覆盖任何命名配置的规则。最后，`renamePlugins` 方法可以用于重命名插件前缀，这在处理潜在的命名冲突时非常有用。

### Vue

对于Vue框架的支持，是通过检查项目中是否安装了`vue`来自动检测的。您也可以明确地启用或禁用它：

```js
// eslint.config.js
import kirklin from "@kirklin/eslint-config";

export default kirklin({
  vue: true
});
```

#### Vue 2

对于Vue 2的有限支持（因为它已经达到了[生命周期结束](https://v2.vuejs.org/eol/)），如果您仍在使用Vue 2，可以通过设置`vueVersion`为`2`来手动配置它：

```js
// eslint.config.js
import kirklin from "@kirklin/eslint-config";

export default kirklin({
  vue: {
    vueVersion: 2
  },
});
```

由于Vue 2目前已经进入维护模式，我们只接受针对Vue 2的错误修复。当`eslint-plugin-vue`停止支持Vue 2时，我们可能会在未来移除对Vue 2的支持。如果可能的话，我们推荐您升级到Vue 3。

### 可选配置

我们为特定的使用场景提供了一些可选的配置，默认情况下不包含它们的依赖。这些可选配置允许您根据项目的具体需求来选择性地引入和使用，从而避免不必要的依赖引入和性能开销。您可以根据项目需要，选择启用或禁用这些可选配置。如果您想了解更多关于如何使用这些可选配置的信息，可以查阅相关文档或在社区中寻求帮助。

#### 格式化器

使用外部格式化器格式化ESLint无法处理的文件（`.css`，`.html`等）。由[`eslint-plugin-format`](https://github.com/antfu/eslint-plugin-format)提供支持。

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

运行`npx eslint`时，它应该会提示您安装所需的依赖项，如果没有，您可以手动安装它们：

```bash
npm i -D eslint-plugin-format
```

#### React

要启用React框架的支持，您需要明确地将其打开：

```js
// eslint.config.js
import kirklin from "@kirklin/eslint-config";

export default kirklin({
  react: true,
});
```

运行`npx eslint`时，它应该会提示您安装所需的依赖项，如果没有，您可以手动安装它们：

```bash
npm i -D @eslint-react/eslint-plugin eslint-plugin-react-hooks eslint-plugin-react-refresh
```

#### Next.js

要启用 Next.js 支持，您需要显式启用它：

```js
// eslint.config.js
import kirklin from "@kirklin/eslint-config";

export default kirklin({
  nextjs: true,
});
```

运行 `npx eslint` 应该会提示您安装所需的依赖项，否则，您可以手动安装它们：

```bash
npm i -D @next/eslint-plugin-next
```

#### Svelte

要启用Svelte框架的支持，您需要明确地将其打开：

```js
// eslint.config.js
import kirklin from "@kirklin/eslint-config";

export default kirklin({
  svelte: true,
});
```

运行`npx eslint`时，它应该会提示您安装所需的依赖项，如果没有，您可以手动安装它们：

```bash
npm i -D eslint-plugin-svelte
```

#### Astro

要启用Astro框架的支持，您需要明确地在配置中启用它：

```js
// eslint.config.js
import kirklin from "@kirklin/eslint-config";

export default kirklin({
  astro: true,
});
```

运行`npx eslint`时，它应该会提示您安装所需的依赖项，如果没有，您可以手动安装它们：

```bash
npm i -D eslint-plugin-astro
```

#### Solid

要启用Solid框架的支持，您需要明确地在配置中启用它：

```js
// eslint.config.js
import kirklin from "@kirklin/eslint-config";

export default kirklin({
  solid: true,
});
```

运行`npx eslint`时，它应该会提示您安装所需的依赖项，如果没有，您可以手动安装它们：

```bash
npm i -D eslint-plugin-solid
```

#### UnoCSS

要启用UnoCSS框架的支持，您需要明确地在配置中启用它：

```js
// eslint.config.js
import kirklin from "@kirklin/eslint-config";

export default kirklin({
  unocss: true,
});
```

运行`npx eslint`时，它应该会提示您安装所需的依赖项，如果没有，您可以手动安装它们：

```bash
npm i -D @unocss/eslint-plugin
```

#### Angular

要启用 Angular 支持，您需要显式启用它：

```js
// eslint.config.js
import kirklin from "@kirklin/eslint-config";

export default kirklin({
  angular: true,
});
```

运行 `npx eslint` 应该会提示您安装所需的依赖项，否则，您可以手动安装它们：

```bash
npm i -D @angular-eslint/eslint-plugin @angular-eslint/eslint-plugin-template @angular-eslint/template-parser
```

### 可选规则

此配置还提供了一些用于扩展用途的可选插件/规则。

#### `command`

由 [`eslint-plugin-command`](https://github.com/antfu/eslint-plugin-command) 提供支持。这不是一个典型的代码检查规则，而是一个按需的微型代码修改工具，通过特定的注释触发。

例如，几个触发器包括：

- `/// to-function` - 将箭头函数转换为普通函数
- `/// to-arrow` - 将普通函数转换为箭头函数
- `/// to-for-each` - 将 for-in/for-of 循环转换为 `.forEach()`
- `/// to-for-of` - 将 `.forEach()` 转换为 for-of 循环
- `/// keep-sorted` - 对对象/数组/接口进行排序
- ... 等 - 参考 [文档](https://github.com/antfu/eslint-plugin-command#built-in-commands)

你可以在想要转换的代码上方添加触发注释，例如（注意三个斜杠）：

<!-- eslint-skip -->

```typescript
/// to-function
const foo = async (msg: string): void => {
  console.log(msg);
};
```

当你在编辑器中保存或运行 `eslint . --fix` 时，将转换为：

```typescript
async function foo(msg: string): void {
  console.log(msg);
}
```

命令注释通常是一次性的，一旦转换完成，它们将被一并移除。

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

### 编辑器特定的禁用规则

当 ESLint 在代码编辑器中运行时，以下规则的自动修复功能被禁用：

- [`prefer-const`](https://eslint.org/docs/rules/prefer-const)
- [`test/no-only-tests`](https://github.com/levibuzolic/eslint-plugin-no-only-tests)
- [`unused-imports/no-unused-imports`](https://www.npmjs.com/package/eslint-plugin-unused-imports)
- [`pnpm/json-enforce-catalog`](https://github.com/antfu/pnpm-workspace-utils/tree/main/packages/eslint-plugin-pnpm#rules)
- [`pnpm/json-prefer-workspace-settings`](https://github.com/antfu/pnpm-workspace-utils/tree/main/packages/eslint-plugin-pnpm#rules)
- [`pnpm/json-valid-catalog`](https://github.com/antfu/pnpm-workspace-utils/tree/main/packages/eslint-plugin-pnpm#rules)

自 v3.0.0 版本起，这些规则不再被完全禁用，而是通过 [此辅助工具](https://github.com/antfu/eslint-flat-config-utils#composerdisablerulesfix) 设为不可自动修复。

这样可以防止编辑器在重构代码时自动删除未使用的导入，以提供更好的开发体验。这些规则仍然会在你通过终端运行 ESLint 或使用 [Lint Staged](#lint-staged) 时生效。

如果你不希望有这种行为，你可以手动禁用它们。

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

我创建了一个可视化工具，帮助您查看项目中启用了哪些规则，并将它们应用于哪些文件，[@eslint/config-inspector](https://github.com/eslint/config-inspector)

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
- [kirklin/boot-ts](https://github.com/kirklin/boot-ts) - My starter template for TypeScript library
- [kirklin/boot-vue](https://github.com/kirklin/boot-vue) - My starter template for Vue & Vite app

## License

[MIT](./LICENSE) License &copy; 2019-PRESENT [Kirk Lin](https://github.com/kirklin)
