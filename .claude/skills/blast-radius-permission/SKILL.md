---
name: blast-radius-permission
description: Use this skill when designing or auditing permission scopes for agents, hooks, and tools. Triggers when user asks about security, access control, limiting what Claude can do, sandboxing agents, or setting up safe automation that minimizes the risk of unintended changes.
---

# Blast Radius Permission Control

## Overview

"Blast radius" is the maximum impact of an unintended or erroneous action. This skill applies the principle of least privilege to Claude Code's permission system — scoping each agent, hook, and tool to the minimum access needed.

## Permission Layers

### Tool Permissions
Control which tools Claude can use without confirmation:

```json
{
  "permissions": {
    "allow": [
      "Read(**)",
      "Glob(**)",
      "Grep(**)",
      "Bash(git status)",
      "Bash(git log*)",
      "Bash(npm test)"
    ],
    "deny": [
      "Bash(rm *)",
      "Bash(git push*)",
      "Bash(git reset --hard*)"
    ]
  }
}
```

### Skill Permissions
Scope individual skills to specific tools:

```json
{
  "permissions": {
    "allow": [
      "Skill(commit)",
      "Skill(review-pr *)"
    ]
  }
}
```

### Agent Permissions
Subagents inherit the parent's permissions by default. Explicitly restrict agents that perform scoped tasks.

## Blast Radius Categories

| Action Type | Blast Radius | Recommendation |
|---|---|---|
| Read files | None | Always allow |
| Edit single file | Low | Allow with logging |
| Edit multiple files | Medium | Require confirmation |
| Run tests | Low | Allow |
| Install packages | High | Require confirmation |
| Git push / deploy | Critical | Always confirm |
| Delete files | Critical | Deny by default |
| Network requests | Variable | Evaluate per endpoint |

## Audit Checklist

Before deploying an automated workflow:

- [ ] What is the worst-case action this workflow can take?
- [ ] Are destructive commands (rm, git reset, drop table) explicitly denied?
- [ ] Does the workflow touch files outside its expected scope?
- [ ] Are network-accessible credentials in scope?
- [ ] Is there a human confirmation step before irreversible actions?

## Defense in Depth

1. **Deny by default** — Only allowlist what's needed
2. **Scope to directories** — `Edit(src/**)` not `Edit(**)`
3. **Read-only for explorers** — Agents that only analyze should have no write permissions
4. **Confirm before push** — Any action visible to others requires explicit user approval
