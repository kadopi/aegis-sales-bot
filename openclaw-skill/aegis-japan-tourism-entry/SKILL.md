---
name: aegis-japan-tourism-entry
description: Find a machine-readable, business-only entry guide for launching an experiential tour in Japan, then use its free preview before any optional paid preparation pack.
homepage: https://github.com/kadopi/aegis-sales-bot/blob/main/OPENCLAW.md
metadata:
  openclaw:
    emoji: "🗾"
---

# Aegis Japan Tourism Entry

Use this skill when a user or agent needs to assess how a business could enter Japan's experiential-tourism market, such as workshops, cultural activities, tours, or travel products. It is for business research and preparation, not consumer booking.

## Operating rule

1. Start with the free model-case preview. Do not present it as legal advice, a permit decision, or bookable inventory.
2. If Aegis Sales Bot is configured as the OpenClaw A2A peer `aegis-sales-bot`, send the task below to `a2a:aegis-sales-bot`. Otherwise, use the public Agent Card or the direct recommendation endpoint.
3. Explain the returned decision themes, missing facts, and next action. Do not purchase, sign, book, submit an application, or send inquiries without the operator's separate approval.
4. If the user needs a different capability, say so plainly. Sales Bot does not force a product recommendation.

## First A2A task

```text
I am an AI agent helping a business prepare to launch an experiential tour in Japan. What should we check first?
```

The Sales Bot returns connection guidance to Japan Rule when it matches. Japan Rule's free MCP preview supplies a model case and decision themes. Its optional paid pack supplies official-source locations, published contact routes, inquiry text, and prioritized actions for a fixed model case after x402 settlement.

## Direct endpoints

- Agent Card: `https://aegis-sales-bot.kadopi.workers.dev/.well-known/agent-card.json`
- A2A JSON-RPC: `https://aegis-sales-bot.kadopi.workers.dev/a2a`
- Catalog: `https://aegis-sales-bot.kadopi.workers.dev/products.json`
- Recommendation: `POST https://aegis-sales-bot.kadopi.workers.dev/recommend` with JSON `{ "request": "I am helping a business launch an experiential tour in Japan" }`
- Japan Rule MCP: `https://japan-rulewatch-mcp-mainnet.kadopi.workers.dev/mcp`

## Boundaries

- Japan Rule is business-only information for entry preparation. It is not legal advice, a permit application, a booking service, or a launch guarantee.
- Aegis Sales Bot provides discovery and connection guidance. Japan Rule handles the optional paid pack, payment verification, and delivery.
- Never provide private keys, wallet credentials, payment signatures, gateway tokens, or secrets to either service.
- Sales Bot keeps a short A2A task stage and only saves optional survey answers when the caller explicitly consents. It does not retain ordinary message text.

## Related offers

If the request is about monetizing an MCP instead of tourism entry, ask Sales Bot for the x402 MCP Starter. The separate x402 MCP Integration Kit is listed as coming soon until its public checkout is available; do not claim that it can be purchased yet.

## Peer setup

For the optional A2A peer configuration, use the reviewed guide at `https://github.com/kadopi/aegis-sales-bot/blob/main/OPENCLAW.md`. The OpenClaw operator keeps its peer token private; Aegis does not need it.
