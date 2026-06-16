---
name: prompt-cache-economics
description: Use this skill when optimizing token costs and latency through prompt caching. Triggers when user asks about reducing API costs, speeding up responses, understanding cache hits/misses, structuring prompts for maximum cache reuse, or when working with large system prompts that are reused across many requests.
---

# Prompt Cache Economics

## Overview

Prompt caching reduces costs and latency by reusing computed key-value states for repeated prompt prefixes. Effective cache management is the difference between paying full price on every request and getting 90%+ cache hit rates.

## How Caching Works

Anthropic's prompt cache operates on prompt *prefixes*. When a request's prefix matches a previously cached prefix, the cached KV state is reused:

- **Cache hit**: ~90% cost reduction, significantly lower latency for the cached portion
- **Cache miss**: Full price, full latency — but the result is cached for future requests
- **Cache TTL**: 5 minutes (standard), up to 1 hour with extended caching

## What to Cache

**High-value cache targets:**
- Large system prompts (tool definitions, skill instructions, project context)
- Static reference material (documentation, codebases loaded as context)
- Repeated few-shot examples

**Poor cache targets:**
- Dynamic content that changes every request (current time, user-specific data)
- Short content (caching overhead not worth it for < ~1024 tokens)

## Cache-Optimized Prompt Structure

Order prompt content from **most stable → least stable**:

```
[1. System prompt / role]           ← most stable, cache here
[2. Tool definitions]               ← stable across session
[3. Static context (docs, code)]    ← stable, cache with breakpoint
[4. Conversation history]           ← changes each turn
[5. Current user message]           ← always new
```

Using `cache_control: {type: "ephemeral"}` at the right breakpoints maximizes reuse.

## Cache Breakpoint Strategy

Place cache breakpoints:
- After the system prompt (reused on every request)
- After loading large files/documentation (reused within a task)
- After each assistant turn (reuses conversation history)

Do NOT place breakpoints:
- Inside dynamic content that changes per request
- After content that depends on the current user message

## Cost Model

For a 100K-token system prompt sent 1000 times per day:

| Strategy | Daily Input Cost (approx) |
|---|---|
| No caching | 100K × 1000 × rate |
| Cache after system prompt | ~10K × rate (first) + ~90K × 0.1 × rate × 999 |

Effective cache design reduces costs by **85-95%** for high-reuse prompts.

## Monitoring Cache Performance

Track these metrics:
- `cache_read_input_tokens`: tokens served from cache
- `cache_creation_input_tokens`: tokens written to cache
- Hit rate = cache_read / (cache_read + cache_creation)

Target hit rate: **>85%** for production workloads with stable system prompts.

## Anti-Patterns

- Placing dynamic content before the cache breakpoint (invalidates the cache on every request)
- Caching too aggressively (cache overhead for tiny prompts is not worth it)
- Ignoring cache TTL (cache expires after 5 min; plan around session length)
