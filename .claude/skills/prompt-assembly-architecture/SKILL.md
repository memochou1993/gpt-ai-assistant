---
name: prompt-assembly-architecture
description: Use this skill when designing or optimizing how prompts are constructed for complex tasks. Triggers when the user wants to understand how to structure system prompts, combine multiple instruction sources, build dynamic prompts, layer context efficiently, or debug why Claude is not following instructions correctly.
---

# Prompt Assembly Architecture

## Overview

Effective prompts are assembled from multiple layers, not written as a single monolith. This skill implements the prompt assembly patterns used in Claude Code: layered context, dynamic injection, and instruction precedence.

## Prompt Layers (Low → High Priority)

```
1. Base System Prompt      (model defaults, safety rules)
2. Tool Definitions        (available tools and their schemas)
3. CLAUDE.md               (project-level memory and standards)
4. Skill Instructions      (active skill guidance)
5. User Message            (current task)
6. Tool Results            (context from tool calls)
```

Higher layers can override lower layers. User instructions take precedence over project defaults.

## Assembly Patterns

### Static Core + Dynamic Injection
Keep a stable core prompt and inject dynamic context:
```
[Static: role, constraints, output format]
[Dynamic: current file contents, recent errors, task-specific context]
```

### Instruction Locality
Place instructions close to where they apply:
- Format instructions → immediately before the output they govern
- Constraints → at the point in the task where they become relevant
- Examples → adjacent to the pattern they illustrate

### Context Compression
Before injecting large context blocks, compress them:
- File contents → relevant sections only
- Error traces → error type + key line + suggested fix
- Tool results → summarized findings, not raw output

### Negative Space
Explicitly state what NOT to do when Claude commonly makes the wrong choice:
```
Do not add explanatory comments to code you did not change.
Do not create new files unless explicitly required.
Do not propose refactors beyond the scope of the current task.
```

## Instruction Conflict Resolution

When instructions conflict, Claude follows this precedence:
1. Explicit user instruction in the current message
2. CLAUDE.md project instructions
3. Skill instructions
4. Default behavior

To override a lower-priority instruction, be explicit: "Override the project standard and use tabs for this file."

## Common Pitfalls

| Problem | Cause | Fix |
|---|---|---|
| Claude ignores formatting rules | Rules buried in long prompt | Move rules to start or end; use bold/headers |
| Claude forgets constraints mid-task | Context pushes instructions out | Re-state key constraints in tool result injections |
| Conflicting behavior | Two instruction sources disagree | Audit CLAUDE.md and skills for conflicts |
| Instructions too vague | "Be concise" without examples | Add concrete examples of desired output |

## Testing Prompt Assembly

After modifying a prompt layer:
1. Write 3-5 test prompts that should trigger the changed behavior
2. Run them and evaluate output against expected
3. Check that existing behaviors were not accidentally broken
