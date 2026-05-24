/**
 * Sync configuration — defines all transformation rules for converting
 * antfu/eslint-config source code into kirklin/eslint-config.
 *
 * This file is the single source of truth for all brand replacements
 * and intentional customizations.
 */

export interface Replacement {
  /** String literal or RegExp to find */
  find: string | RegExp;
  /** Replacement string (supports $1, $2 etc. for regex captures) */
  replace: string;
}

export interface FileCustomization {
  /** Relative path from project root */
  file: string;
  /** Replacements to apply after brand replacement */
  replacements: Replacement[];
}

export interface SyncConfig {
  upstream: {
    repo: string;
    branch: string;
    tempDir: string;
  };
  syncPaths: string[];
  brandReplacements: Replacement[];
  customizations: FileCustomization[];
  packageJsonOverrides: Record<string, any>;
  packageJsonDepReplacements: Record<string, string>;
  extraScripts: Record<string, string>;
  removeFromPackageJson: {
    scripts: string[];
    devDependencies: string[];
  };
  dependencyVersionStrategy: "merge-higher";
  workspaceDepReplacements: Record<string, string>;
}

export const syncConfig: SyncConfig = {
  upstream: {
    repo: "https://github.com/antfu/eslint-config.git",
    branch: "main",
    tempDir: ".sync-upstream",
  },

  // ── Paths to sync from upstream ──────────────────────────────────────
  syncPaths: [
    "src/",
    "test/",
    "fixtures/",
    "scripts/typegen.ts",
    "scripts/versiongen.ts",
    "tsconfig.json",
    "tsdown.config.ts",
    "vitest.config.ts",
  ],

  // ── Brand replacements ───────────────────────────────────────────────
  // Applied in order. Order matters — longer/more-specific patterns first.
  //
  // IMPORTANT: These only replace references to "eslint-config" itself.
  // References to other antfu projects (e.g. @antfu/install-pkg,
  // eslint-processor-vue-blocks, eslint-config-flat-gitignore) are
  // intentionally NOT replaced.
  brandReplacements: [
    // ── Package & plugin names ──
    { find: "@antfu/eslint-config", replace: "@kirklin/eslint-config" },
    { find: "eslint-plugin-antfu", replace: "eslint-plugin-kirklin" },

    // ── Variable / identifier names ──
    { find: "pluginAntfu", replace: "pluginKirkLin" },

    // ── Factory function ──
    { find: /\bfunction antfu\s*\(/g, replace: "function kirklin(" },
    { find: /\bexport default antfu\b/g, replace: "export default kirklin" },

    // ── Import/export references ──
    // Handles: { antfu }, { antfu, ... }, import antfu from, etc.
    { find: /\bimport antfu\b/g, replace: "import kirklin" },
    { find: /\{ antfu \}/g, replace: "{ kirklin }" },
    { find: /\{ antfu,/g, replace: "{ kirklin," },
    { find: /\bantfu \}/g, replace: "kirklin }" },

    // ── Function calls: antfu( ──
    { find: /\bantfu\(\s*\{/g, replace: "kirklin({" },
    { find: /\bantfu\(\s*\)/g, replace: "kirklin()" },
    { find: /\bantfu\(/g, replace: "kirklin(" },

    // ── Plugin object key: `antfu: pluginXxx` ──
    { find: /^(\s+)antfu: plugin/gm, replace: "$1kirklin: plugin" },
    { find: /(['"])antfu(['"])\s*:\s*plugin/g, replace: "$1kirklin$2: plugin" },

    // ── Config/rule name prefix: 'antfu/' or "antfu/" ──
    // These appear in config names like 'antfu/javascript/rules'
    // and rule names like 'antfu/consistent-chaining'
    { find: /(['"`])antfu\//g, replace: "$1kirklin/" },

    // ── GitHub URL for THIS project only ──
    // Use regex to match exactly "eslint-config" at end of path or before non-word char,
    // so it won't match eslint-config-flat-gitignore, eslint-config-inspector, etc.
    // Also excludes /issues/, /pull/, /blob/, /tree/ paths (upstream issue references).
    { find: /github\.com\/antfu\/eslint-config(?!\/(?:issues|pull|blob|tree))(?=[/"'\s#)]|\.git|$)/g, replace: "github.com/kirklin/eslint-config" },

    // ── Author and branding in comments/strings ──
    { find: /Anthony's ESLint config/g, replace: "Kirk Lin's ESLint config" },
    { find: /Anthony Fu <[^>]*>/g, replace: "Kirk Lin" },
    { find: /Anthony Fu \(https:\/\/github\.com\/antfu\/\)/g, replace: "Kirk Lin (https://github.com/kirklin/)" },
    { find: "https://github.com/sponsors/antfu", replace: "https://www.buymeacoffee.com/linkirk" },
  ],

  // ── File-level customizations (applied AFTER brand replacements) ──────
  //
  // These represent intentional differences from upstream.
  // Each customization is a find/replace within a specific file.
  customizations: [
    // ── stylistic.ts: our style defaults ──
    {
      file: "src/configs/stylistic.ts",
      replacements: [
        // Quotes default: double
        { find: "quotes: 'single'", replace: "quotes: 'double'" },
        // Semi default: true
        { find: "semi: false", replace: "semi: true" },
        // Brace style default: 1tbs (only if upstream has braceStyle field)
        { find: "braceStyle: 'stroustrup'", replace: "braceStyle: '1tbs'" },

        // Add extra rules after 'kirklin/consistent-chaining': 'error',
        // We add: consistent-list-newline, brace-style, member-delimiter-style
        {
          find: "'kirklin/consistent-chaining': 'error',",
          replace: [
            "'kirklin/consistent-chaining': 'error',",
            "        'kirklin/consistent-list-newline': 'error',",
            "        'style/brace-style': ['error', '1tbs', { allowSingleLine: false }],",
            "        'style/member-delimiter-style': ['error', { multiline: { delimiter: 'semi' } }],",
          ].join("\n"),
        },

        // Replace kirklin/curly (plugin doesn't have it) with builtin curly
        { find: "'kirklin/curly': 'error',", replace: "'curly': ['error', 'all']," },
      ],
    },

    // ── typescript.ts: erasableOnly default ──
    {
      file: "src/configs/typescript.ts",
      replacements: [
        { find: "erasableOnly = false", replace: "erasableOnly = true" },
      ],
    },

    // ── tsconfig.json: our custom settings ──
    {
      file: "tsconfig.json",
      replacements: [
        // Add erasableSyntaxOnly for our erasableOnly preference
        {
          find: "\"skipLibCheck\": true",
          replace: "\"erasableSyntaxOnly\": true,\n    \"skipLibCheck\": true",
        },
      ],
    },

    // ── fixtures/eslint.config.ts: disable erasableOnly for test fixtures ──
    {
      file: "fixtures/eslint.config.ts",
      replacements: [
        {
          find: "typescript: true,",
          replace: "typescript: {\n      erasableOnly: false,\n    },",
        },
      ],
    },

    // ── svelte.ts: default quotes ──
    {
      file: "src/configs/svelte.ts",
      replacements: [
        // We default to double quotes in svelte too
        { find: "quotes = 'single'", replace: "quotes = 'double'" },
      ],
    },

    // ── yaml.ts: default quotes ──
    {
      file: "src/configs/yaml.ts",
      replacements: [
        // We default to double quotes in yaml too
        { find: "quotes = 'single'", replace: "quotes = 'double'" },
      ],
    },

    // ── vue.ts: brace style and extra rules ──
    {
      file: "src/configs/vue.ts",
      replacements: [
        // braceStyle default: 1tbs instead of upstream's stroustrup
        { find: "braceStyle = 'stroustrup'", replace: "braceStyle = '1tbs'" },
        // brace-style: upstream now uses variable braceStyle, just override allowSingleLine
        { find: "'vue/brace-style': ['error', braceStyle, { allowSingleLine: true }]", replace: "'vue/brace-style': ['error', braceStyle, { allowSingleLine: false }]" },
        // allowAllPropertiesOnSameLine → allowMultiplePropertiesPerLine (our naming)
        { find: "allowAllPropertiesOnSameLine", replace: "allowMultiplePropertiesPerLine" },
        // Add component-api-style and expand component-name-in-template-casing
        {
          find: "'vue/component-name-in-template-casing': ['error', 'PascalCase'],",
          replace: [
            "// only allows <script setup>.",
            "        'vue/component-api-style': ['error', ['script-setup']],",
            "        'vue/component-name-in-template-casing': ['error', 'PascalCase', {",
            "          globals: ['RouterView', 'RouterLink'],",
            "          registeredComponentsOnly: false,",
            "        }],",
          ].join("\n"),
        },
      ],
    },

    // ── jsonc.ts: property name ──
    {
      file: "src/configs/jsonc.ts",
      replacements: [
        { find: "allowAllPropertiesOnSameLine", replace: "allowMultiplePropertiesPerLine" },
      ],
    },

    // ── vitest.config.ts: exclude .sync-upstream ──
    {
      file: "vitest.config.ts",
      replacements: [
        {
          find: "test: {",
          replace: "test: {\n    exclude: ['.sync-upstream/**', 'node_modules/**'],",
        },
      ],
    },

    // ── fixtures/input/typescript.ts: erasableOnly compatibility ──
    {
      file: "fixtures/input/typescript.ts",
      replacements: [
        // Parameter properties are not erasable, replace with explicit assignment
        {
          find: [
            "class Dog extends Animal {",
            "  constructor(private alias: string) {",
            "    super(alias);",
            "  }",
          ].join("\n"),
          replace: [
            "class Dog extends Animal {",
            "  private alias: string;",
            "  constructor(alias: string) {",
            "    super(alias);",
            "    this.alias = alias;",
            "  }",
          ].join("\n"),
        },
      ],
    },

    // ── factory.ts: console.log → console.warn (no-console rule) ──
    {
      file: "src/factory.ts",
      replacements: [
        {
          find: /console\.log\("\[@kirklin\/eslint-config\]/g,
          replace: "console.warn(\"[@kirklin/eslint-config]",
        },
      ],
    },

    // ── cli/run.ts: angle-bracket assertions → 'as' (erasableSyntaxOnly) ──
    {
      file: "src/cli/run.ts",
      replacements: [
        {
          find: /<FrameworkOption\[\]>(.+\.filter\(Boolean\))/g,
          replace: "($1) as FrameworkOption[]",
        },
        {
          find: /<ExtraLibrariesOption\[\]>(.+\.filter\(Boolean\))/g,
          replace: "($1) as ExtraLibrariesOption[]",
        },
        {
          find: /includes\(<FrameworkOption>(\w+)\)/g,
          replace: "includes($1 as FrameworkOption)",
        },
        {
          find: /includes\(<ExtraLibrariesOption>(\w+)\)/g,
          replace: "includes($1 as ExtraLibrariesOption)",
        },
      ],
    },

    // ── update-package-json.ts: <const> assertion → 'as const' (erasableSyntaxOnly) ──
    {
      file: "src/cli/stages/update-package-json.ts",
      replacements: [
        {
          find: "(<const>[",
          replace: "([",
        },
        {
          find: "]).forEach((f)",
          replace: "] as const).forEach((f)",
        },
      ],
    },
  ],

  // ── package.json overrides ─────────────────────────────────────────────
  packageJsonOverrides: {
    name: "@kirklin/eslint-config",
    description: "Kirk Lin's ESLint config",
    author: "Kirk Lin (https://github.com/kirklin/)",
    homepage: "https://github.com/kirklin/eslint-config",
    funding: "https://www.buymeacoffee.com/linkirk",
    repository: {
      type: "git",
      url: "git+https://github.com/kirklin/eslint-config.git",
    },
    bugs: {
      url: "https://github.com/kirklin/eslint-config/issues",
    },
  },

  // Dependency name replacements in package.json
  packageJsonDepReplacements: {
    "eslint-plugin-antfu": "eslint-plugin-kirklin",
    "@antfu/eslint-config": "@kirklin/eslint-config",
  },

  // Extra scripts we have that upstream doesn't
  extraScripts: {
    "lint:fix": "eslint --fix",
    "test:update": "vitest -u",
    "sync:upstream": "pnpm tsx scripts/sync-upstream.ts",
  },

  // Fields to remove from package.json (upstream-only things)
  removeFromPackageJson: {
    scripts: [],
    devDependencies: ["skills-npm"],
  },

  // ── pnpm-workspace.yaml ────────────────────────────────────────────────
  dependencyVersionStrategy: "merge-higher",

  workspaceDepReplacements: {
    "eslint-plugin-antfu": "eslint-plugin-kirklin",
    "@antfu/eslint-config": "@kirklin/eslint-config",
  },
};
