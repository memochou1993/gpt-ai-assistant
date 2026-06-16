---
name: tool-runtime-pipeline
description: Use this skill when understanding or optimizing how tools execute within a Claude session. Triggers when user wants to understand tool call flow, debug tool execution order, optimize parallel vs sequential tool calls, handle tool errors gracefully, or design complex multi-tool workflows.
---

# Tool Runtime Pipeline

## Overview

The tool runtime pipeline governs how Claude Code executes tool calls: planning, dispatching, parallelizing, handling errors, and incorporating results. Understanding this pipeline enables you to design workflows that are fast, reliable, and observable.

## Pipeline Stages

```
1. Plan        → Decide which tools to call and in what order
2. Validate    → Check permissions and pre-conditions (PreToolUse hooks)
3. Dispatch    → Execute tool call(s)
4. Parallelize → Run independent calls concurrently
5. Collect     → Gather results
6. Verify      → PostToolUse hooks, result validation
7. Integrate   → Incorporate results into context
8. Iterate     → Plan next tool calls based on results
```

## Parallelization

Independent tool calls execute in parallel automatically. To maximize throughput:

**Do this:**
```
- Read file A
- Read file B          } All dispatched simultaneously
- Glob **.ts
```

**Not this:**
```
- Read file A
  → wait for result
    - Read file B      } Sequential, 3x slower
      → wait for result
        - Glob **.ts
```

Claude plans parallel execution when tool calls have no data dependency. Explicitly state when calls are independent: "Read all three files simultaneously."

## Error Handling Patterns

### Retry with Backoff
For transient failures (network errors, rate limits):
```
Attempt 1 → fail → wait 2s
Attempt 2 → fail → wait 4s
Attempt 3 → fail → escalate to user
```

### Graceful Degradation
If a non-critical tool fails, continue with available data:
```
If Bash(npm test) fails → report failure, continue with other tasks
If Read(optional-file) fails → note absence, use defaults
```

### Hard Stop
If a critical tool fails, halt and report:
```
If Edit(critical-file) fails → stop, do not proceed, report to user
```

## Tool Result Integration

After each tool call:
1. Extract the relevant information (avoid loading full output into context)
2. Note any errors or unexpected results
3. Update the task plan based on what was learned
4. Discard raw output that has been summarized

## Observability

Use tool call metadata to monitor pipeline health:
- Tool call count per session (detect runaway loops)
- Failed tool calls (detect systematic issues)
- Tool call duration (detect performance regressions)
- Repeated identical calls (detect inefficient patterns)

## Common Pipeline Anti-Patterns

| Anti-Pattern | Symptom | Fix |
|---|---|---|
| Sequential reads | Slow file loading | Request parallel reads |
| Swallowing errors | Silent failures | Always surface tool errors |
| Re-reading files | Context bloat | Cache file contents in context |
| Unbounded loops | Infinite tool calls | Set explicit iteration limits |
| No result validation | Wrong outputs accepted | Verify tool outputs match expectations |
