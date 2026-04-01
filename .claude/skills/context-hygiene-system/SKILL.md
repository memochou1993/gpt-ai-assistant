---
name: context-hygiene-system
description: Use this skill when the conversation is getting long, context is cluttered with stale information, or you need to optimize token usage. Triggers when user asks to compact context, summarize progress, clean up the conversation, manage memory, or when approaching context window limits.
---

# Context Hygiene System

## Overview

Context hygiene is the practice of keeping the active context window clean, relevant, and efficient. Bloated context degrades response quality and wastes tokens. This skill implements the strategies Claude Code uses to maintain healthy context across long sessions.

## Why Context Gets Dirty

- Accumulated tool call results (large file contents, verbose command output)
- Repeated re-reading of the same files
- Stale exploration artifacts that are no longer relevant
- Long error traces from dead-end approaches
- Intermediate reasoning that has been superseded

## Hygiene Strategies

### 1. Compact (Summarize and Reset)
When context is too long to be efficient:
- Summarize what has been accomplished
- Identify the active task and current state
- List open questions and blockers
- Discard everything else and restart with the summary

Use `/compact` in Claude Code to trigger this automatically.

### 2. Selective Retention
Not everything deserves equal space in context:
- **Keep**: Current task spec, key decisions made, active file contents
- **Discard**: Old error messages from resolved issues, exploratory code that was rejected, verbose output already summarized
- **Compress**: Long file listings → filenames only; full stack traces → error type + key line

### 3. Memory Externalisation
Move information out of context into persistent storage:
- Write key findings to CLAUDE.md
- Save important code snippets to files
- Log decisions to a `DECISIONS.md` or similar

### 4. Lazy Loading
Don't load file contents until needed:
- Use `Glob` to list files before deciding which to read
- Read only the relevant sections with `Read` + offset/limit
- Prefer `Grep` over reading entire files for targeted searches

## Context Budget Guidelines

| Content Type | Priority | Action When Tight |
|---|---|---|
| Current task instruction | Critical | Never remove |
| Active file being edited | Critical | Keep |
| Recent tool results | High | Keep last 3 |
| Exploration results | Medium | Summarize |
| Old error traces | Low | Discard |
| Redundant file reads | None | Discard |

## Signals That Context Needs Cleaning

- Responses become less accurate or start contradicting earlier work
- Claude re-reads files it already read
- Response speed degrades noticeably
- `/cost` shows high token usage with no proportional progress
