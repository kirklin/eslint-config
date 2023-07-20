# @kirklin/eslint-config

[![CI][ci-image]][ci-url] [![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url] [![javascript_code style][code-style-image]][code-style-url]

[ci-image]: https://github.com/kirklin/eslint-config/actions/workflows/release.yml/badge.svg?branch=master
[ci-url]: https://github.com/kirklin/eslint-config/actions/workflows/release.yml
[npm-image]: https://img.shields.io/npm/v/@kirklin/eslint-config.svg
[npm-url]: https://npmjs.org/package/@kirklin/eslint-config
[downloads-image]: https://img.shields.io/npm/dm/@kirklin/eslint-config.svg
[downloads-url]: https://npmjs.org/package/@kirklin/eslint-config
[code-style-image]: https://img.shields.io/badge/code__style-%40kirklin-brightgreen.svg
[code-style-url]: https://github.com/kirklin/eslint-config/

<div align='left'>
<a href="README.md">English</a> | <b>简体中文</b>
<br>
</div>

## 特性

- "双引号"，必须加分号;
- 格式化的自动修复（旨在独立使用，不需要 Prettier）。
- TypeScript，Vue 开箱即用
- 对 JSON、YAML、Markdown 也支持格式化
- 导入自动排序，需要尾随逗号，更干净的提交差异
- 合理的默认值，最佳实践，只有一行的配置

## 如何使用

可共享的配置被设计在`.eslintrc`文件的`extends`。
你可以了解更多关于
[Shareable Configs](http://eslint.org/docs/developer-guide/shareable-configs) 在
官方 ESLint 网站上

### 运行以下命令开始使用:

### 安装

```bash
pnpm add -D eslint @kirklin/eslint-config
```

### 在你的`.eslintrc`文件中加入这个。

```json
{
  "extends": "@kirklin"
}
```

> 你通常不需要`.eslintignore`，因为它已经由预设提供了。

### 为 package.json 添加脚本配置

例如:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

### 在 Vscode 中 配置自动修复

创建 `.vscode/settings.json`

```json
{
  "prettier.enable": false,
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": false
  },
  // 以下内容为可选项。
  // 建议将其放置在项目的 .vscode/settings.json 文件中，
  // 以避免在使用不同的 eslint 配置时出现冲突，
  // 这些配置可能不支持所有格式。
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
    "yaml"
  ]
}
```

### 自定义规则

在你的`.eslintrc`文件中添加你喜欢的规则。

```json
{
  "extends": ["@kirklin"],
  "rules": {
    "vue/component-tags-order": [
      "error",
      {
        "order": ["template", "script", "style"]
      }
    ]
  }
}
```

### TypeScript Aware Rules

当在项目根目录中找到`tsconfig.eslint.json`时，将启用 Type Aware Rules, [参阅此处](https://github.com/kirklin/eslint-config/blob/master/packages/typescript/index.js#L17).

## 徽章

在你的 README 中包括一个这样的徽章，以便让人们知道你的代码使用的是哪种 ESLint 样式。

[![kirklin-code-style-image](https://img.shields.io/badge/code__style-%40kirklin%2Feslint--config-brightgreen)](https://github.com/kirklin/eslint-config/)

```markdown
[![kirklin-code-style-image](https://img.shields.io/badge/code__style-%40kirklin%2Feslint--config-brightgreen)](https://github.com/kirklin/eslint-config/)
```

[code-style-image]: https://img.shields.io/badge/code__style-%40kirklin%2Feslint--config-brightgreen
[code-style-url]: https://github.com/kirklin/eslint-config/

## 致谢

本项目基于 [@antfu/eslint-config](https://github.com/antfu/eslint-config)

## 开源协议

[MIT](./LICENSE) License &copy; 2019-PRESENT [Kirk Lin](https://github.com/kirklin)
