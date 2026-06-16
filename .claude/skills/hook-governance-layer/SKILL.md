---
name: hook-governance-layer
description: Use this skill when designing, auditing, or debugging hooks in Claude Code. Triggers when user wants to set up automated behaviors, create pre/post tool hooks, build stop hooks, enforce policies on tool calls, or ensure hooks are safe and don't create infinite loops.
---

# Hook Governance Layer

## Overview

Hooks are shell commands that Claude Code executes automatically in response to events. The governance layer ensures hooks are safe, predictable, and don't interfere with each other or create runaway automation.

## Hook Types

### PreToolUse
Runs *before* a tool executes. Can block the tool by exiting non-zero.

**Use cases:**
- Validate inputs before destructive operations
- Enforce coding standards before file edits
- Check for credentials/secrets in content about to be written
- Require confirmation before running in production environments

### PostToolUse
Runs *after* a tool executes successfully.

**Use cases:**
- Auto-format files after edits (`prettier`, `gofmt`, `black`)
- Run linters after code changes
- Sync state after file writes
- Log tool usage for auditing

### Notification
Triggered when Claude wants to notify the user.

**Use cases:**
- Desktop notifications for long-running tasks
- Slack/webhook alerts on completion
- Sound alerts when human attention is needed

### Stop
Runs when a session ends or Claude stops.

**Use cases:**
- Enforce commit standards before session ends
- Save session summaries to CLAUDE.md
- Clean up temporary files

## Governance Rules

### Safety Rules
1. **No infinite loops**: PostToolUse hooks that trigger tool calls that trigger the same hook must be idempotent
2. **Fail open or fail closed**: Decide explicitly whether a failed hook should block the action (PreToolUse exit 1) or warn and continue
3. **Timeout**: All hooks should complete within 10 seconds; long-running tasks should be async
4. **No side effects on reads**: Hooks on `Read`, `Grep`, `Glob` should be read-only themselves

### Design Rules
1. **Single responsibility**: Each hook does one thing
2. **Explicit scope**: Use `matcher` to scope hooks to specific tools or file patterns
3. **Idempotent**: Running the same hook twice should not cause errors
4. **Observable**: Hooks should log what they did (stdout → Claude sees it)

## Example Configuration

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{
          "type": "command",
          "command": "cd $PROJECT_ROOT && npx prettier --write $TOOL_INPUT_FILE_PATH 2>/dev/null || true"
        }]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [{
          "type": "command",
          "command": "~/.claude/stop-hook-git-check.sh"
        }]
      }
    ]
  }
}
```

## Debugging Hooks

- Hook stdout is visible to Claude — use `echo` to surface what a hook is doing
- Hook stderr is shown to the user — use for warnings
- Test hooks by temporarily adding `echo "HOOK FIRED: $TOOL_NAME"` at the start
