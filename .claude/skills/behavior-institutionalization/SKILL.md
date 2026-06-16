---
name: behavior-institutionalization
description: Use this skill to make behaviors permanent and consistent across sessions. Triggers when the user says "from now on", "always do X", "every time you Y", "remember to always", or asks to establish persistent workflows, coding standards, or repeatable processes.
---

# Behavior Institutionalization

## Overview

Institutionalizing a behavior means encoding it into the project's configuration so it runs automatically — without relying on the user to re-specify it each session. This skill implements the pattern Claude Code uses to persist behaviors via CLAUDE.md, hooks, and settings.

## Institutionalization Channels

### 1. CLAUDE.md (Project Memory)
For behaviors that guide *how Claude thinks and responds*:
- Coding conventions (naming, formatting, architecture patterns)
- Domain context (what this project does, key constraints)
- Preferences (preferred libraries, test frameworks, documentation style)

```markdown
# Project Standards
- Always use TypeScript strict mode
- Prefer `const` over `let`; avoid `var`
- Tests go in `__tests__/` next to source files
```

### 2. Settings Hooks (Automated Actions)
For behaviors that trigger *before or after specific events*:
- Pre-tool hooks: validate before running commands
- Post-tool hooks: format, lint, or notify after file edits
- Stop hooks: enforce commit standards before session ends

### 3. Slash Commands (Reusable Workflows)
For behaviors that are *complex sequences* a user invokes by name:
- Package a multi-step workflow as a single command
- Include all instructions, context, and output format inline

## Process

1. **Identify the behavior** — What exactly should happen? Under what trigger?
2. **Choose the channel** — Is it a guideline (CLAUDE.md), an automation (hook), or a workflow (command)?
3. **Write the rule** — Be precise. Vague rules produce inconsistent behavior.
4. **Test the rule** — Trigger the behavior and verify the outcome.
5. **Refine** — If results are inconsistent, tighten the specification.

## Anti-Patterns

- **Over-institutionalizing**: Not everything needs a rule. Reserve institutionalization for behaviors you want *every time*.
- **Contradictory rules**: Two rules that conflict cause unpredictable behavior. Audit CLAUDE.md regularly.
- **Implicit triggers**: Specify exactly when a behavior applies. "Sometimes format code" is not a rule.

## Example

User says: "From now on, always run tests after editing any `.ts` file."

→ Add a PostToolUse hook on `Edit` that runs `npm test` when the edited file matches `*.ts`.
