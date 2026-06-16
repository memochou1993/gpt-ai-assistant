---
name: multi-agent-orchestration
description: Use this skill when coordinating multiple AI agents working in parallel or in sequence. Triggers when the user wants to break a large task into parallel workstreams, run agents concurrently, build agent pipelines, or design systems where multiple Claude instances collaborate on a shared goal.
---

# Multi-Agent Orchestration

## Overview

Multi-agent orchestration divides complex work across specialized agents running in parallel or sequence, then synthesizes their outputs. This skill implements the orchestration patterns from Claude Code's agent system.

## Orchestration Topologies

### Parallel Fan-Out
```
Orchestrator
    ├── Agent A (task 1)
    ├── Agent B (task 2)
    └── Agent C (task 3)
         ↓
    Synthesizer
```
Best for: independent subtasks that can run simultaneously.
Example: Running tests, linting, and security scan in parallel.

### Sequential Pipeline
```
Agent A → Agent B → Agent C → Output
```
Best for: tasks where each step depends on the previous result.
Example: Research → Draft → Review → Finalize.

### Supervisor/Worker
```
Supervisor
    ├── spawns Worker A
    ├── monitors progress
    ├── restarts failed workers
    └── aggregates results
```
Best for: fault-tolerant processing of many similar items.
Example: Processing 100 files with retry logic.

### Hierarchical Decomposition
```
Top-level Agent
    ├── Sub-orchestrator 1
    │       ├── Worker A
    │       └── Worker B
    └── Sub-orchestrator 2
            ├── Worker C
            └── Worker D
```
Best for: very large tasks with multiple distinct phases.
Caution: Limit depth to 2-3 levels to maintain observability.

## Orchestration Principles

### Task Decomposition
- Each agent task should be: completable in one session, independently verifiable, with clear inputs and outputs
- Avoid tasks that require agents to communicate with each other mid-execution
- Define the synthesis step before spawning workers

### Context Distribution
- Give each agent only the context it needs
- Avoid passing the full conversation history to subagents
- Use structured inputs (JSON, YAML) instead of prose when possible

### Output Contracts
Define the output format before spawning:
```
Each agent must return:
- status: "complete" | "partial" | "failed"
- result: <structured output>
- notes: any caveats or edge cases encountered
```

### Failure Handling
- Partial failure: collect successful results, report failures, ask user how to proceed
- Complete failure: report root cause, suggest simplified retry
- Timeout: request partial results before terminating

## Anti-Patterns

- **Chatty agents**: Agents that need to communicate mid-task indicate poor decomposition
- **Shared mutable state**: Concurrent agents writing to the same files cause race conditions
- **Unbounded spawning**: Always know in advance how many agents will be created
- **Silent failure**: Every agent must report status; never ignore agent errors
