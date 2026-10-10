# MCP Server Card for askmilo.pro

Runbook for the MCP Server Card — the `checks.discovery.mcpServerCard` check
on <https://isitagentready.com>.

- **Spec:** [SEP-1649 / SEP-2127 — MCP Server Cards](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
- **Guide:** <https://isitagentready.com/.well-known/agent-skills/mcp-server-card/SKILL.md>
- **Config source of truth:** [`scripts/mcp-server-card.mjs`](../scripts/mcp-server-card.mjs)

## What gets shipped

`npm run build` ends with `scripts/well-known.mjs`, which writes the generated
card to `dist/.well-known/mcp/server-card.json` — served at
`/.well-known/mcp/server-card.json`, the first candidate path the scanner
probes.

The card is generated, not committed, so `serverInfo.version` always tracks
`package.json` and `tools` always mirror the WebMCP tools the site actually
registers (`src/webmcp.js`). GitHub Pages serves it as `application/json`
with HTTP 200 once the deploy lands — merge ships the whole change, no
operator publish step.

## The transport the card declares

The site is static — there is **no network MCP endpoint**, so the card does
not claim one. `transport.type` carries the WebMCP spec URI
(`https://webmachinelearning.github.io/webmcp/`) — a custom-binding
identifier in the open-string `type` field, the same URI the A2A Agent Card
uses as its `protocolBinding` (see [agent-card.md](agent-card.md)).
`transport.endpoint` is `https://askmilo.pro/` — the page that registers the
tools — and `capabilities` declares only `tools` (the six read-only WebMCP
tools are listed statically under `tools`). No `streamable-http`, `sse` or
`stdio` type is advertised: claiming one would point agents at a JSON-RPC
endpoint that does not exist. A test guards this: naming a wire transport
turns `tests/mcp-server-card.test.mjs` red.

`protocolVersion` documents the MCP version the WebMCP tool shapes follow
(descriptors and `{content: [...]}` results conform to MCP 2025-06-18 data
types); it describes the tool surface, not a wire protocol.

## Verify

```bash
npm run mcp-server-card:verify                  # exit 0 when the issue's bar holds
npm run mcp-server-card:verify -- --json        # scanner-shaped JSON result
npm run mcp-server-card:verify -- --url https://preview.example/.well-known/mcp/server-card.json
```

The verifier runs the same `GET /.well-known/mcp/server-card.json` the
scanner does and passes only when the response is 200, parseable JSON, and
carries the required Server Card fields. Spot-check by hand:

```bash
curl -s https://askmilo.pro/.well-known/mcp/server-card.json | head -30
```

Then re-scan <https://askmilo.pro> —
`checks.discovery.mcpServerCard.status` should report `pass`. The card is
live once the post-merge deploy completes — there is no Cloudflare or DNS
step for this one.
