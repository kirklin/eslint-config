# @kirklin/eslint-config
[![CI][ci-image]][ci-url] [![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url] [![javascript_code style][code-style-image]][code-style-url]

[ci-image]: https://github.com/kirklin/eslint-config/actions/workflows/release.yml/badge.svg?branch=master
[ci-url]: https://github.com/kirklin/eslint-config/actions/workflows/release.yml
[npm-image]: https://img.shields.io/npm/v/@kirklin/eslint-config.svg
[npm-url]: https://npmjs.org/package/@kirklin/eslint-config
[downloads-image]: https://img.shields.io/npm/dm/@kirklin/eslint-config.svg
[downloads-url]: https://npmjs.org/package/@kirklin/eslint-config
[code-style-image]: https://img.shields.io/badge/code__style-%40kirklin%2Feslint--config-brightgreen
[code-style-url]: https://github.com/kirklin/eslint-config/

<div align='left'>
<b>English</b> | <a href="README.zh-cn.md">简体中文</a>
<br>
</div>

## Features

- "double quotes", must semi;
- Auto fix for formatting (aimed to be used standalone without Prettier)
- TypeScript, Vue out-of-box
- Lint also for JSON、YAML、Markdown
- Sorted imports, dangling commas for cleaner commit diff
- Reasonable defaults, best practices, only one-line of config

## Usage

Shareable configs are designed to work with the `extends` feature of `.eslintrc` files.
You can learn more about
[Shareable Configs](http://eslint.org/docs/developer-guide/shareable-configs) on the
official ESLint website.

####  run the following command:

### Install

```bash
pnpm add -D eslint @kirklin/eslint-config
```
### add this to your `.eslintrc` file:

```json
{
  "extends": "@kirklin"
}
```

> You don't need `.eslintignore` normally as it has been provided by the preset.

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

### Config VS Code auto fix

Create `.vscode/settings.json`

```json
{
  "prettier.enable": false,
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```
### Customization rules
add you like rules to your `.eslintrc` file:
```json
{
  "extends": [
    "@kirklin"
  ],
  "rules": {
    "vue/component-tags-order": ["error", {
      "order": ["template", "script", "style"]
    }]
  }
}
```
### TypeScript Aware Rules

Type aware rules are enabled when a `tsconfig.eslint.json` is found in the project root. Refer to [this file](https://github.com/kirklin/eslint-config/blob/master/packages/typescript/index.js#L17).

## Badge

Use this in one of your projects? Include one of these badges in your readme to
let people know that your code is using the standard style.


[![kirklin-code-style-image](https://img.shields.io/badge/code__style-%40kirklin%2Feslint--config-brightgreen)](https://github.com/kirklin/eslint-config/)

```markdown
[![kirklin-code-style-image](https://img.shields.io/badge/code__style-%40kirklin%2Feslint--config-brightgreen)](https://github.com/kirklin/eslint-config/)
```

[code-style-image]: https://img.shields.io/badge/code__style-%40kirklin%2Feslint--config-brightgreen
[code-style-url]: https://github.com/kirklin/eslint-config/

## Thanks
This project is based on [@antfu/eslint-config](https://github.com/antfu/eslint-config)

## License

[MIT](./LICENSE) License &copy; 2019-PRESENT [Kirk Lin](https://github.com/kirklin)
