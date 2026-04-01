---
name: agent-lifecycle-management
description: Use this skill when you need to manage the full lifecycle of AI agents — spawning subagents, monitoring their progress, handling failures, and terminating agents cleanly. Triggers when user asks to create agents, run background tasks, coordinate parallel workstreams, or manage long-running agent processes.
---

# Agent Lifecycle Management

## Overview

This skill governs how agents are created, monitored, and terminated. It implements the lifecycle patterns found in Claude Code's agent orchestration layer: spawn → monitor → collect → teardown.

## Lifecycle Phases

### 1. Spawn
- Define a clear, scoped task for each agent
- Pass only the context the agent needs (avoid context bloat)
- Set explicit success criteria and output format
- Assign a unique identifier for tracking

### 2. Monitor
- Poll agent status at appropriate intervals
- Detect stalls: if no progress in N turns, intervene
- Track resource usage (token consumption per agent)
- Surface intermediate results when useful

### 3. Collect
- Aggregate outputs from parallel agents
- Resolve conflicts when agents produce inconsistent results
- Validate outputs against the original task spec
- Summarize what each agent accomplished

### 4. Teardown
- Release agent context when task is complete
- Log outcomes for debugging and improvement
- Clean up any temporary files or state the agent created
- Report final status to the orchestrating agent

## Patterns

### Fire-and-Forget
Use when agent result is not time-sensitive. Spawn the agent, continue other work, collect later.

### Blocking Parallel
Spawn N agents simultaneously, block until all complete. Best for tasks that must be synthesized together.

### Sequential Chain
Output of Agent A feeds into Agent B. Use when later agents depend on earlier results.

### Supervisor Pattern
A monitor agent watches worker agents and restarts or redirects failed ones.

## Error Handling

- **Agent timeout**: If an agent exceeds expected duration, send a summary request and collect partial results
- **Agent failure**: Log the error, attempt once with simplified scope, or escalate to user
- **Conflicting outputs**: Present both results to the user or use a tie-breaker agent

## Best Practices

- Keep agent tasks atomic and independently verifiable
- Never share mutable state between concurrent agents
- Always define what "done" looks like before spawning
- Prefer shallow agent trees (avoid deep nesting)
