#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');

const PACKAGE_ROOT = path.resolve(__dirname, '..');
const DEFAULT_CLAUDE_ROOT = path.join(os.homedir(), '.claude', 'skills');
const DEFAULT_CODEX_ROOT = path.join(process.env.CODEX_HOME || path.join(os.homedir(), '.codex'), 'skills');
const SKILL_PATHS = ['SKILL.md', 'agents', 'references', 'scripts'];

function usage() {
  console.log(`Usage:
  npx taste-ink-skill
  npx taste-ink-skill --codex
  npx taste-ink-skill --target /custom/skills

Options:
  --codex          Install into ~/.codex/skills instead of ~/.claude/skills
  --target PATH    Install into a custom skills root
  --print-target   Print the resolved install path and exit
  --help           Show this message
`);
}

function parseArgs(argv) {
  const args = { codex: false, target: '', printTarget: false };
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];
    if (value === '--help' || value === '-h') {
      usage();
      process.exit(0);
    }
    if (value === '--codex') {
      args.codex = true;
      continue;
    }
    if (value === '--print-target') {
      args.printTarget = true;
      continue;
    }
    if (value === '--target') {
      args.target = argv[i + 1] || '';
      i += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${value}`);
  }
  return args;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyDir(sourceDir, targetDir) {
  ensureDir(targetDir);
  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(sourcePath, targetPath);
      continue;
    }
    fs.copyFileSync(sourcePath, targetPath);
  }
}

function copySkillPayload(targetDir) {
  ensureDir(targetDir);
  for (const relativePath of SKILL_PATHS) {
    const sourcePath = path.join(PACKAGE_ROOT, relativePath);
    const targetPath = path.join(targetDir, relativePath);
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Missing packaged skill path: ${sourcePath}`);
    }
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDir(sourcePath, targetPath);
      continue;
    }
    fs.copyFileSync(sourcePath, targetPath);
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const targetRoot = args.target || (args.codex ? DEFAULT_CODEX_ROOT : DEFAULT_CLAUDE_ROOT);
  const installDir = path.join(targetRoot, 'taste-ink');

  if (args.printTarget) {
    console.log(installDir);
    return;
  }

  ensureDir(targetRoot);
  fs.rmSync(installDir, { recursive: true, force: true });
  copySkillPayload(installDir);

  console.log(`Installed Taste skill to ${installDir}`);
  console.log('Invoke it as $taste after restarting Claude Code if needed.');
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
