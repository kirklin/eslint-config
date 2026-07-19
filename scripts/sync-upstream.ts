/**
 * Sync upstream antfu/eslint-config into kirklin/eslint-config.
 *
 * Usage:
 *   pnpm tsx scripts/sync-upstream.ts [--ref <tag|commit>] [--dry-run]
 *
 * This script:
 *   1. Clones / fetches antfu/eslint-config into a temp directory
 *   2. Copies source files into our project
 *   3. Applies brand replacements (antfu → kirklin)
 *   4. Applies intentional customizations (style, TS defaults, etc.)
 *   5. Merges package.json (preserves our brand fields)
 *   6. Merges pnpm-workspace.yaml (takes higher dep versions)
 *   7. Runs eslint --fix to unify code style
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { syncConfig } from "./sync-config";

// ── Helpers ──────────────────────────────────────────────────────────────

const ROOT = path.resolve(import.meta.dirname, "..");
const UPSTREAM_DIR = path.join(ROOT, syncConfig.upstream.tempDir);

function log(msg: string) {
  console.log(`\x1B[36m[sync]\x1B[0m ${msg}`);
}

function warn(msg: string) {
  console.log(`\x1B[33m[sync]\x1B[0m ⚠ ${msg}`);
}

function success(msg: string) {
  console.log(`\x1B[32m[sync]\x1B[0m ✓ ${msg}`);
}

function run(cmd: string, cwd?: string): string {
  return execSync(cmd, { cwd: cwd ?? ROOT, encoding: "utf-8", stdio: "pipe" }).trim();
}

// ── 1. Parse args ────────────────────────────────────────────────────────

function parseArgs(): { ref: string; dryRun: boolean } {
  const args = process.argv.slice(2);
  let ref = syncConfig.upstream.branch;
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--ref" && args[i + 1]) {
      ref = args[++i];
    }
    if (args[i] === "--dry-run") {
      dryRun = true;
    }
  }

  return { ref, dryRun };
}

// ── 2. Fetch upstream ────────────────────────────────────────────────────

function fetchUpstream(ref: string): void {
  if (fs.existsSync(UPSTREAM_DIR)) {
    log("Fetching latest upstream changes...");
    run("git fetch origin", UPSTREAM_DIR);
  } else {
    log(`Cloning ${syncConfig.upstream.repo}...`);
    run(`git clone --no-checkout ${syncConfig.upstream.repo} ${UPSTREAM_DIR}`);
    run("git fetch origin", UPSTREAM_DIR);
  }

  // A branch name must resolve to the freshly fetched remote-tracking ref —
  // the local branch in the temp clone stays stale after `git fetch`.
  const checkoutRef = ref === syncConfig.upstream.branch ? `origin/${ref}` : ref;
  log(`Checking out ref: ${checkoutRef}`);
  run(`git checkout ${checkoutRef} -- .`, UPSTREAM_DIR);

  // Show what we checked out (HEAD stays stale — log the ref itself)
  const commitInfo = run(`git log -1 --oneline ${checkoutRef}`, UPSTREAM_DIR);
  success(`Upstream at: ${commitInfo}`);
}

// ── 3. Copy files ────────────────────────────────────────────────────────

function copyFiles(): string[] {
  const copiedFiles: string[] = [];

  for (const syncPath of syncConfig.syncPaths) {
    const src = path.join(UPSTREAM_DIR, syncPath);
    const dest = path.join(ROOT, syncPath);

    if (!fs.existsSync(src)) {
      warn(`Upstream path not found, skipping: ${syncPath}`);
      continue;
    }

    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      // Copy entire directory
      copyDirRecursive(src, dest, copiedFiles, syncPath);
    } else {
      // Copy single file
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
      copiedFiles.push(syncPath);
    }
  }

  success(`Copied ${copiedFiles.length} files from upstream`);
  return copiedFiles;
}

function copyDirRecursive(src: string, dest: string, copiedFiles: string[], basePath: string): void {
  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcEntry = path.join(src, entry.name);
    const destEntry = path.join(dest, entry.name);
    const relPath = path.join(basePath, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcEntry, destEntry, copiedFiles, relPath);
    } else {
      fs.copyFileSync(srcEntry, destEntry);
      copiedFiles.push(relPath);
    }
  }
}

// ── 4. Apply brand replacements ──────────────────────────────────────────

function applyBrandReplacements(files: string[]): void {
  let totalReplacements = 0;

  const tsFiles = files.filter(f => f.endsWith(".ts") || f.endsWith(".tsx") || f.endsWith(".mjs") || f.endsWith(".js"));

  for (const file of tsFiles) {
    const filePath = path.join(ROOT, file);
    if (!fs.existsSync(filePath)) {
      continue;
    }

    let content = fs.readFileSync(filePath, "utf-8");
    const original = content;

    for (const rule of syncConfig.brandReplacements) {
      if (typeof rule.find === "string") {
        // String replacement — replace all occurrences
        while (content.includes(rule.find)) {
          content = content.replace(rule.find, rule.replace);
        }
      } else {
        // Regex replacement
        content = content.replace(rule.find, rule.replace);
      }
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content, "utf-8");
      totalReplacements++;
    }
  }

  success(`Brand replacements applied to ${totalReplacements} files`);

  // Rename @antfu directories in snapshots to @kirklin
  const antfuDirs = findAntfuDirs(ROOT);
  for (const dir of antfuDirs) {
    const kirklinDir = dir.replace(/@antfu/g, "@kirklin");
    if (fs.existsSync(kirklinDir)) {
      fs.rmSync(kirklinDir, { recursive: true });
    }
    fs.renameSync(dir, kirklinDir);
  }
  if (antfuDirs.length > 0) {
    success(`Renamed ${antfuDirs.length} @antfu directories to @kirklin`);
  }
}

function findAntfuDirs(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) {
    return results;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.name === "@antfu") {
      results.push(full);
    } else if (!entry.name.startsWith(".") && entry.name !== "node_modules") {
      results.push(...findAntfuDirs(full));
    }
  }
  return results;
}

// ── 5. Apply customizations ──────────────────────────────────────────────

function applyCustomizations(): void {
  for (const custom of syncConfig.customizations) {
    const filePath = path.join(ROOT, custom.file);
    if (!fs.existsSync(filePath)) {
      warn(`Customization target not found: ${custom.file}`);
      continue;
    }

    let content = fs.readFileSync(filePath, "utf-8");
    let applied = 0;

    for (const rule of custom.replacements) {
      const findStr = typeof rule.find === "string" ? rule.find : rule.find;

      if (typeof findStr === "string") {
        if (content.includes(findStr)) {
          content = content.replace(findStr, rule.replace);
          applied++;
        } else {
          warn(`Customization pattern not found in ${custom.file}: "${findStr}"`);
        }
      } else {
        const before = content;
        content = content.replace(findStr, rule.replace);
        if (content !== before) {
          applied++;
        }
      }
    }

    fs.writeFileSync(filePath, content, "utf-8");
    if (applied > 0) {
      success(`Applied ${applied} customizations to ${custom.file}`);
    }
  }
}

// ── 5.5. Fix erasableSyntaxOnly compatibility ────────────────────────────
//
// Our tsconfig.json has `erasableSyntaxOnly: true`, but upstream uses
// angle-bracket type assertions (`<Type>value`) which are not allowed
// under this setting. This step generically converts them to `as` syntax.

function fixErasableSyntaxOnly(files: string[]): void {
  const tsFiles = files.filter(f => f.endsWith(".ts") && !f.endsWith(".d.ts"));
  let fixedFiles = 0;

  for (const file of tsFiles) {
    const filePath = path.join(ROOT, file);
    if (!fs.existsSync(filePath)) {
      continue;
    }

    let content = fs.readFileSync(filePath, "utf-8");
    const original = content;

    content = fixConstAssertions(content);
    content = fixAngleBracketAssertions(content);

    if (content !== original) {
      fs.writeFileSync(filePath, content, "utf-8");
      fixedFiles++;
    }
  }

  if (fixedFiles > 0) {
    success(`Fixed angle-bracket type assertions in ${fixedFiles} files (erasableSyntaxOnly)`);
  }
}

/**
 * Convert `<const>[...]` assertions to `[...] as const`.
 * Uses bracket-depth tracking to find the matching `]`.
 */
function fixConstAssertions(content: string): string {
  // Match both `<const>[` and `(<const>[` patterns
  const pattern = /\(\s*<const>\s*\[/g;
  let match: RegExpExecArray | null;

  // Process from end to start so indices remain valid
  const matches: { start: number; openBracket: number }[] = [];

  // eslint-disable-next-line no-cond-assign
  while ((match = pattern.exec(content)) !== null) {
    // `start` is right after `(`; we need to replace `<const>[` → `[`
    const parenIdx = match.index;
    const openBracket = content.indexOf("[", parenIdx);
    matches.push({ start: parenIdx, openBracket });
  }

  // Also handle without leading paren: `= <const>[` or bare `<const>[`
  const barePattern = /(?<=[=,;:({\s])<const>\s*\[/g;
  // eslint-disable-next-line no-cond-assign
  while ((match = barePattern.exec(content)) !== null) {
    const alreadyCaptured = matches.some(m =>
      Math.abs(m.start - match!.index) < match![0].length + 5,
    );
    if (!alreadyCaptured) {
      matches.push({ start: match.index, openBracket: content.indexOf("[", match.index) });
    }
  }

  // Process from end to start
  matches.sort((a, b) => b.start - a.start);

  for (const { start, openBracket } of matches) {
    // Find the matching `]`
    let depth = 1;
    let i = openBracket + 1;
    while (i < content.length && depth > 0) {
      if (content[i] === "[") {
        depth++;
      }
      if (content[i] === "]") {
        depth--;
      }
      i++;
    }

    if (depth !== 0) {
      continue;
    }

    // i is now right after the matching `]`
    const closeBracket = i - 1;

    // Extract the section from start to after `]`
    const before = content.substring(0, start);
    const section = content.substring(start, closeBracket + 1);
    const after = content.substring(closeBracket + 1);

    // Remove `<const>` from the section, add ` as const` after `]`
    const fixed = section
      .replace(/<const>\s*/, "")
      .replace(/\]$/, "] as const");

    content = before + fixed + after;
  }

  return content;
}

/**
 * Convert angle-bracket type assertions `<Type>expr` to `(expr) as Type`.
 *
 * Targets patterns in expression contexts (after `=`, `(`, `,`, `!`, `?`, etc.)
 * where `<Identifier>` or `<Identifier[]>` precedes a value expression.
 *
 * Uses a character-level scanner to find expression boundaries, avoiding the
 * fragility of pure-regex approaches.
 */
function fixAngleBracketAssertions(content: string): string {
  // A type assertion <T> is distinguished from generics by context:
  // - Assertion: preceded by expression-start chars (= ( , ! & | ? ; whitespace)
  // - Generic:  preceded by identifier char (fn<T>)
  const assertionPattern = /(?<=[=(,!&|?;\s])\s*<(\w+(?:\[\])?)>/g;
  let match: RegExpExecArray | null;

  // Collect all matches (process from end to preserve indices)
  const assertions: { fullStart: number; typeEnd: number; type: string }[] = [];

  // eslint-disable-next-line no-cond-assign
  while ((match = assertionPattern.exec(content)) !== null) {
    // Skip matches inside string literals (e.g., '<template>' in CLI option strings)
    if (isInsideString(content, match.index)) {
      continue;
    }
    assertions.push({
      fullStart: match.index,
      typeEnd: match.index + match[0].length,
      type: match[1],
    });
  }

  // Process from end to start so earlier indices stay valid
  assertions.reverse();

  for (const { fullStart, typeEnd, type } of assertions) {
    const exprEnd = findExpressionEnd(content, typeEnd);
    const expr = content.substring(typeEnd, exprEnd).trim();

    if (!expr) {
      continue;
    }

    const before = content.substring(0, fullStart);
    const after = content.substring(exprEnd);
    const leadingSpace = content.substring(fullStart).match(/^\s*/)?.[0] ?? "";
    content = `${before}${leadingSpace}(${expr}) as ${type}${after}`;
  }

  return content;
}

/**
 * Starting from `start`, scan forward to find where the expression ends.
 * Tracks bracket/paren depth so nested calls like `.map(m => m.trim())`
 * are included as part of the expression.
 */
function findExpressionEnd(content: string, start: number): number {
  let parenDepth = 0;
  let bracketDepth = 0;
  let i = start;

  // Skip leading whitespace
  while (i < content.length && content[i] === " ") {
    i++;
  }

  while (i < content.length) {
    const ch = content[i];

    if (ch === "(") {
      parenDepth++;
    } else if (ch === ")") {
      if (parenDepth === 0) {
        break;
      }
      parenDepth--;
    } else if (ch === "[") {
      bracketDepth++;
    } else if (ch === "]") {
      if (bracketDepth === 0) {
        break;
      }
      bracketDepth--;
    } else if (ch === "," && parenDepth === 0 && bracketDepth === 0) {
      break;
    } else if (ch === ";" || ch === "\n") {
      break;
    }

    i++;
  }

  // Trim trailing whitespace
  while (i > start && content[i - 1] === " ") {
    i--;
  }

  return i;
}

/**
 * Check whether `pos` is inside a string literal, template literal, or comment.
 * Scans from the beginning of the file to handle multi-line template literals
 * (backtick strings) correctly.
 */
function isInsideString(content: string, pos: number): boolean {
  let inString: string | null = null; // quote char if inside a string
  let inBlockComment = false;

  for (let i = 0; i < pos; i++) {
    const ch = content[i];
    const next = content[i + 1];

    if (inBlockComment) {
      if (ch === "*" && next === "/") {
        inBlockComment = false;
        i++; // skip '/'
      }
      continue;
    }

    if (inString) {
      if (ch === "\\" && inString !== "`") {
        i++; // skip escaped char (not in template literals)
      } else if (ch === inString) {
        inString = null;
      }
      continue;
    }

    // Not inside string or comment
    if (ch === "/" && next === "/") {
      // Line comment — skip to end of line
      const eol = content.indexOf("\n", i);
      if (eol === -1 || eol >= pos) {
        return true;
      }
      i = eol;
    } else if (ch === "/" && next === "*") {
      inBlockComment = true;
      i++; // skip '*'
    } else if (ch === "'" || ch === "\"" || ch === "`") {
      inString = ch;
    }
  }

  return inString !== null || inBlockComment;
}

// ── 6. Merge package.json ────────────────────────────────────────────────

function sortObjectKeys(obj: Record<string, any>): Record<string, any> {
  const sorted: Record<string, any> = {};
  for (const key of Object.keys(obj).sort()) {
    sorted[key] = obj[key];
  }
  return sorted;
}

function mergePackageJson(): void {
  const upstreamPkg = JSON.parse(
    fs.readFileSync(path.join(UPSTREAM_DIR, "package.json"), "utf-8"),
  );
  const ourPkg = JSON.parse(
    fs.readFileSync(path.join(ROOT, "package.json"), "utf-8"),
  );

  const merged = { ...upstreamPkg };

  // Preserve our version (independent versioning)
  merged.version = ourPkg.version;

  // Preserve our packageManager version
  if (ourPkg.packageManager) {
    merged.packageManager = ourPkg.packageManager;
  }

  // Apply brand overrides
  Object.assign(merged, syncConfig.packageJsonOverrides);

  // Merge scripts: keep upstream scripts + insert our extras after related scripts
  const upstreamScripts = { ...upstreamPkg.scripts };
  // Our own prepare script (without skills-npm)
  upstreamScripts.prepare = "simple-git-hooks";

  // Remove upstream-only scripts
  for (const key of syncConfig.removeFromPackageJson.scripts) {
    delete upstreamScripts[key];
  }

  // Insert extra scripts after their related keys (e.g. lint:fix after lint)
  const scriptEntries: [string, string][] = [];
  const insertedExtras = new Set<string>();
  for (const [key, value] of Object.entries(upstreamScripts)) {
    scriptEntries.push([key, value as string]);
    // Check if any extra script should be inserted after this key
    for (const [extraKey, extraValue] of Object.entries(syncConfig.extraScripts)) {
      const baseKey = extraKey.split(":")[0]; // "lint:fix" → "lint"
      if (baseKey === key) {
        scriptEntries.push([extraKey, extraValue]);
        insertedExtras.add(extraKey);
      }
    }
  }
  // Append extra scripts that didn't match any upstream key
  for (const [extraKey, extraValue] of Object.entries(syncConfig.extraScripts)) {
    if (!insertedExtras.has(extraKey)) {
      scriptEntries.push([extraKey, extraValue]);
    }
  }
  merged.scripts = Object.fromEntries(scriptEntries);

  // Apply dependency name replacements
  for (const depField of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"] as const) {
    if (!merged[depField]) {
      continue;
    }

    for (const [oldName, newName] of Object.entries(syncConfig.packageJsonDepReplacements)) {
      if (merged[depField][oldName]) {
        merged[depField][newName] = merged[depField][oldName];
        delete merged[depField][oldName];
      }
    }

    // Sort deps alphabetically to avoid noisy diffs
    merged[depField] = sortObjectKeys(merged[depField]);
  }

  // Remove upstream-only devDependencies
  for (const dep of syncConfig.removeFromPackageJson.devDependencies) {
    if (merged.devDependencies?.[dep]) {
      delete merged.devDependencies[dep];
    }
  }

  // Write back with consistent formatting
  fs.writeFileSync(
    path.join(ROOT, "package.json"),
    `${JSON.stringify(merged, null, 2)}\n`,
    "utf-8",
  );

  success("Merged package.json");
}

// ── 7. Merge pnpm-workspace.yaml ─────────────────────────────────────────

function mergeWorkspaceYaml(): void {
  const upstreamPath = path.join(UPSTREAM_DIR, "pnpm-workspace.yaml");
  const ourPath = path.join(ROOT, "pnpm-workspace.yaml");

  if (!fs.existsSync(upstreamPath)) {
    warn("Upstream pnpm-workspace.yaml not found, skipping");
    return;
  }

  let content = fs.readFileSync(upstreamPath, "utf-8");

  // Apply dependency name replacements
  for (const [oldName, newName] of Object.entries(syncConfig.workspaceDepReplacements)) {
    // Replace both quoted and unquoted forms
    content = content.replaceAll(oldName, newName);
  }

  // Read our current workspace yaml for version comparison
  const ourContent = fs.existsSync(ourPath)
    ? fs.readFileSync(ourPath, "utf-8")
    : "";

  // Parse versions from both files and take the higher one
  if (ourContent && syncConfig.dependencyVersionStrategy === "merge-higher") {
    content = mergeWorkspaceVersions(content, ourContent);
  }

  fs.writeFileSync(ourPath, content, "utf-8");
  success("Merged pnpm-workspace.yaml");
}

/**
 * For each dependency version in both workspace files,
 * take the higher semver version.
 */
function mergeWorkspaceVersions(upstream: string, ours: string): string {
  // Parse all version entries: "package-name": ^x.y.z or package-name: ^x.y.z
  const versionPattern = /^(\s*['"]?([@\w/.-]+)['"]?\s*:\s*)(\^?~?>?=?\d\S*)\s*$/gm;

  const ourVersions = new Map<string, string>();
  let match: RegExpExecArray | null;

  // eslint-disable-next-line no-cond-assign
  while ((match = versionPattern.exec(ours)) !== null) {
    const pkgName = match[2];
    const version = match[3];
    ourVersions.set(pkgName, version);
  }

  // Replace upstream versions with the higher of the two
  const result = upstream.replace(versionPattern, (line, prefix, pkgName, upstreamVersion) => {
    const ourVersion = ourVersions.get(pkgName);
    if (!ourVersion) {
      return line;
    }

    const upSemver = extractSemver(upstreamVersion);
    const ourSemver = extractSemver(ourVersion);

    if (upSemver && ourSemver && compareSemver(ourSemver, upSemver) > 0) {
      // Our version is higher, keep ours
      return `${prefix}${ourVersion}`;
    }

    return line;
  });

  return result;
}

function extractSemver(version: string): number[] | null {
  const match = version.match(/(\d+)\.(\d+)\.(\d+)/);
  if (!match) {
    return null;
  }
  return [Number.parseInt(match[1]), Number.parseInt(match[2]), Number.parseInt(match[3])];
}

function compareSemver(a: number[], b: number[]): number {
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) {
      return a[i] - b[i];
    }
  }
  return 0;
}

// ── 8. Run pnpm install + eslint --fix ───────────────────────────────────

function runPnpmInstall(): void {
  log("Running pnpm install to update dependencies...");
  try {
    run("pnpm install --no-frozen-lockfile", ROOT);
    success("pnpm install completed");
  } catch {
    warn("pnpm install had issues — you may need to run it manually");
  }
}

function runEslintFix(): void {
  log("Running eslint --fix to unify code style...");
  try {
    run("npx eslint --fix src/ scripts/typegen.ts scripts/versiongen.ts test/ fixtures/eslint.config.ts tsdown.config.ts vitest.config.ts", ROOT);
    success("eslint --fix completed");
  } catch {
    // eslint --fix may exit with non-zero if some issues can't be auto-fixed
    warn("eslint --fix completed with some unfixable issues (this is normal)");
  }
}

// ── 9. Build ─────────────────────────────────────────────────────────────

function runBuild(): void {
  log("Building project...");
  try {
    run("pnpm build", ROOT);
    success("Build completed");
  } catch {
    warn("Build failed — check output above");
  }
}

// ── 10. Update test snapshots ────────────────────────────────────────────

function runTestUpdate(): void {
  log("Updating test snapshots...");
  try {
    // Run all tests except api.test.ts first (api uses guardStaleBuild which
    // fails if other tests modify snapshot files during the same vitest run)
    run("pnpm vitest run --exclude test/api.test.ts -u", ROOT);
    // Rebuild after snapshot changes (guardStaleBuild needs fresh build)
    run("pnpm build", ROOT);
    // Then run api tests
    run("pnpm vitest run test/api.test.ts -u", ROOT);
    success("Test snapshots updated");
  } catch {
    warn("Test snapshot update had issues (will rebuild and verify)");
  }
}

// ── 11. Final verification ───────────────────────────────────────────────

function runFinalVerification(): boolean {
  log("Running final verification (rebuild + test)...");
  try {
    run("pnpm build", ROOT);
    run("pnpm test", ROOT);
    success("All tests passed!");
    return true;
  } catch {
    warn("Final verification failed — review test output above");
    return false;
  }
}

// ── 12. Print summary ────────────────────────────────────────────────────

function printSummary(verified: boolean): void {
  console.log("");
  log("═══════════════════════════════════════════════════════════");
  if (verified) {
    log("  ✅ Sync complete! Build + test passed.");
  } else {
    log("  ⚠ Sync complete but verification had issues.");
  }
  log("");
  log("  Review changes with:");
  log("    git diff --stat");
  log("    git diff src/");
  log("═══════════════════════════════════════════════════════════");
  console.log("");
}

// ── Main ─────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const { ref, dryRun } = parseArgs();

  console.log("");
  log(`Starting upstream sync (ref: ${ref})${dryRun ? " [DRY RUN]" : ""}`);
  console.log("");

  if (dryRun) {
    log("Dry run mode: would fetch upstream, copy files, apply transforms, run eslint fix");
    log(`Upstream: ${syncConfig.upstream.repo}`);
    log(`Ref: ${ref}`);
    log(`Sync paths: ${syncConfig.syncPaths.join(", ")}`);
    log(`Brand replacements: ${syncConfig.brandReplacements.length} rules`);
    log(`Customizations: ${syncConfig.customizations.length} files`);
    return;
  }

  // Step 1: Fetch upstream
  fetchUpstream(ref);

  // Step 2: Copy files
  const copiedFiles = copyFiles();

  // Step 3: Brand replacements
  applyBrandReplacements(copiedFiles);

  // Step 4: Customizations
  applyCustomizations();

  // Step 5: Fix erasableSyntaxOnly compatibility (angle-bracket → as)
  fixErasableSyntaxOnly(copiedFiles);

  // Step 6: Merge package.json
  mergePackageJson();

  // Step 7: Merge pnpm-workspace.yaml
  mergeWorkspaceYaml();

  // Step 8: Install updated dependencies
  runPnpmInstall();

  // Step 9: Run eslint --fix
  runEslintFix();

  // Step 10: Build
  runBuild();

  // Step 11: Update test snapshots
  runTestUpdate();

  // Step 12: Rebuild + test verification
  const verified = runFinalVerification();

  // Step 13: Summary
  printSummary(verified);
}

main().catch((err) => {
  console.error("\x1B[31m[sync] Error:\x1B[0m", err);
  process.exit(1);
});
