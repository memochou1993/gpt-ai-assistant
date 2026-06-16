---
name: skill-workflow-packaging
description: Use this skill when packaging a repeatable workflow as a Claude Code skill. Triggers when the user wants to turn a multi-step process into a reusable skill, create a slash command for a common workflow, share a skill with a team, or structure a skill for consistent activation and execution.
---

# Skill Workflow Packaging

## Overview

A skill packages a workflow so it can be reused reliably across sessions and projects. Good skill packaging means the skill activates at the right time, provides the right guidance, and produces consistent outputs.

## Skill Anatomy

```
my-skill/
├── SKILL.md          # Required: name, description, instructions
├── agents/           # Optional: subagent definitions
│   └── openai.yaml
├── templates/        # Optional: reusable templates
├── scripts/          # Optional: helper scripts
└── README.md         # Optional: human-readable docs
```

### SKILL.md Structure
```yaml
---
name: skill-name          # kebab-case, unique
description: |            # When to trigger this skill (critical for auto-activation)
  Use this skill when...
  Triggers when user...
---

# Skill Title

## Overview
Brief description of what this skill does.

## Process
Step-by-step instructions Claude follows.

## Examples
Concrete examples of inputs and expected outputs.

## Guidelines
Rules and constraints for this workflow.
```

## Packaging Checklist

### Description Quality
- [ ] Describes the *trigger condition*, not just what the skill does
- [ ] Includes specific phrases/keywords that will match user intent
- [ ] Does NOT trigger for unrelated use cases (false positives are costly)

### Instruction Quality
- [ ] Step-by-step process is explicit and ordered
- [ ] Output format is specified
- [ ] Edge cases are addressed
- [ ] Anti-patterns are listed

### Portability
- [ ] No hardcoded paths or project-specific values
- [ ] External dependencies are documented
- [ ] Works without additional configuration for new users

## Distribution

### Local (Single Project)
Place in `.claude/skills/<skill-name>/`

### User-Global
Place in `~/.claude/skills/<skill-name>/`

### Team/Plugin
Publish as a Claude Code plugin:
```json
{
  "name": "my-skill-package",
  "version": "1.0.0",
  "skills": ["./skills/skill-1", "./skills/skill-2"]
}
```
Install with: `/plugin install <package-name>`

## Versioning

- Use semantic versioning for shared skills
- Document breaking changes in a CHANGELOG
- Test skill behavior after Claude model updates (LLM behavior can shift)
- Keep a test suite of representative prompts to detect regressions
