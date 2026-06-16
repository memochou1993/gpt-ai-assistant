---
name: mcp-integration-plane
description: Use this skill when integrating external services into Claude Code via MCP (Model Context Protocol) servers. Triggers when the user wants to connect Claude to databases, APIs, third-party tools, or build a new MCP server that exposes tools for Claude to use.
---

# MCP Integration Plane

## Overview

MCP (Model Context Protocol) is the standard interface for giving Claude access to external tools and data sources. The integration plane defines how MCP servers are discovered, configured, connected, and governed within a Claude Code session.

## MCP Architecture

```
Claude Code
    │
    ├── MCP Client (built-in)
    │       │
    │       ├── Server A (filesystem)
    │       ├── Server B (database)
    │       ├── Server C (GitHub API)
    │       └── Server D (custom tool)
```

Each MCP server exposes:
- **Tools**: Functions Claude can call (read_db, search_docs, send_email)
- **Resources**: Data Claude can read (files, database records, API responses)
- **Prompts**: Pre-built prompt templates

## Configuration

### Project-Level (`.claude/settings.json`)
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/dir"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

### User-Level (`~/.claude/settings.json`)
Global servers available across all projects.

## Integration Patterns

### Read-Only Data Source
Connect a server that only provides `resources` — Claude can query but not modify.
Best for: documentation, knowledge bases, read-only databases.

### Action Server
Exposes tools with side effects (write to DB, send messages, deploy code).
Requires: explicit permission grants, blast-radius analysis, confirmation hooks.

### Tool Bridge
Wraps an existing CLI or API as MCP tools.
Best for: git operations, CI/CD systems, cloud provider APIs.

## Security Considerations

1. **Credential isolation**: Never hardcode credentials in settings. Use environment variables.
2. **Scope tools narrowly**: Expose only the tools Claude needs, not full admin APIs.
3. **Audit tool calls**: Use PostToolUse hooks to log MCP tool invocations.
4. **Sandboxed servers**: Run MCP servers with minimal OS permissions.
5. **Input validation**: MCP servers should validate all inputs before executing.

## Troubleshooting

- Use `/mcp` in Claude Code to list connected servers and their status
- MCP server stderr is surfaced in the Claude Code UI
- Test tools individually with `/mcp call <server> <tool> <args>` before using in workflows
