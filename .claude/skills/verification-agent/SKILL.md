---
name: verification-agent
description: Use this skill when you need to verify, validate, or fact-check work — whether code correctness, test coverage, consistency between files, spec compliance, or output quality. Triggers when user asks to review, audit, validate, double-check, or ensure correctness of code, content, or decisions.
---

# Verification Agent

## Overview

The verification agent is a specialized subagent pattern that independently reviews work for correctness, completeness, and consistency. It implements the "second pair of eyes" pattern from Claude Code's quality assurance layer — separate from the agent that produced the work.

## When to Use Verification

- After implementing a feature (verify against requirements)
- After a refactor (verify behavior was preserved)
- Before committing code (verify no regressions)
- After generating content (verify accuracy and consistency)
- After multi-agent workflows (verify synthesized outputs are consistent)

## Verification Dimensions

### Correctness
Does the output do what was asked?
- Run tests if available
- Trace through logic manually for critical paths
- Check edge cases explicitly mentioned in requirements

### Completeness
Was everything done?
- Compare output against the original task spec line by line
- Check for TODOs or placeholder values left behind
- Verify all referenced files/functions actually exist

### Consistency
Are all parts coherent with each other?
- Check that types/interfaces match their implementations
- Verify imports reference real exports
- Ensure docs match code behavior

### Safety
Are there unintended side effects?
- Check for hardcoded credentials or sensitive data
- Verify destructive operations are gated appropriately
- Confirm changes don't affect unrelated functionality

## Verification Process

1. **Load the original spec** — What was the task? What were the acceptance criteria?
2. **Review the output** — Read through the changes or generated content
3. **Run automated checks** — Tests, linters, type checkers
4. **Manual spot-checks** — Targeted review of high-risk areas
5. **Report findings** — Categorize as: Pass / Warning / Fail
6. **Suggest fixes** — For each failure, provide a concrete remediation

## Output Format

```
## Verification Report

**Status**: PASS | PARTIAL | FAIL

### ✅ Verified
- [List what was confirmed correct]

### ⚠️ Warnings
- [List concerns that don't block but should be noted]

### ❌ Failures
- [List what failed verification]
- **Fix**: [Specific remediation for each failure]

### Not Verified
- [List items that could not be automatically verified]
```

## Running as a Subagent

To use as an independent verification agent:
```
Spawn a verification agent with:
- Task: "Verify the implementation in [file] against [spec]"
- Context: The spec, the implementation, and test results
- Output format: Verification Report (above)
- Permission: Read-only (no writes)
```
