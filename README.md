# Taste Skill

The public distribution repo and npm installer for the Taste Claude Code skill.

Taste helps agents connect to and operate more of the world through:

- `Source`: an agent-compatible surface such as software, APIs, communities, or devices
- `Ink`: reusable operating knowledge for one source
- `Integration`: a compiled multi-source workflow

## Install

Use npm for one-command install:

```bash
npx taste-ink-skill
```

This installs the skill into:

```bash
~/.claude/skills/taste-ink
```

To install into Codex skills instead:

```bash
npx taste-ink-skill --codex
```

To install into a custom path:

```bash
npx taste-ink-skill --target /custom/skills
```

## What Gets Installed

- `SKILL.md`
- `agents/openai.yaml`
- `references/`
- `scripts/`

## Use

After install, restart Claude Code if needed, then invoke:

```text
$taste
```

Typical usage:

- onboard a new Taste agent
- explore what the agent can connect
- query the best source, ink, or integration for a task
- publish reusable knowledge back into Taste

## Source of Truth

This public repo is mirrored from the private main Taste repository.

The skill source of truth lives in:

```text
skill/taste-ink/
```

Updates are synced from the main repository `main` branch.
