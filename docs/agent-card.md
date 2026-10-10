# A2A Agent Card for askmilo.pro

Runbook for the A2A Agent Card — the `checks.discovery.a2aAgentCard` check on
<https://isitagentready.com>.

- **Spec:** [A2A Protocol — Agent Discovery](https://a2a-protocol.org/latest/topics/agent-discovery/) (card schema §4.4.1, interfaces §8.3)
- **Guide:** <https://isitagentready.com/.well-known/agent-skills/a2a-agent-card/SKILL.md>
- **Config source of truth:** [`scripts/agent-card.mjs`](../scripts/agent-card.mjs)

## What gets shipped

`npm run build` ends with `scripts/well-known.mjs`, which now writes two
generated artifacts into `dist/.well-known/`:

- `agent-skills/index.json` — the agentskills.io index (existing)
- `agent-card.json` — the A2A Agent Card (this issue)

The card is generated, not committed, so `version` always tracks
`package.json` and `skills` always mirror the WebMCP tools the site actually
registers (`src/webmcp.js`) plus the published `milo-hands-free-ai-via-siri`
skill doc. GitHub Pages serves it as `application/json` with HTTP 200 once
the deploy lands — merge ships the whole change, no operator publish step.

## The interface the card declares

The site is static — there is no A2A task endpoint, so the card does **not**
claim one. `supportedInterfaces` carries a single entry pointing at
`https://askmilo.pro/` with `protocolBinding` set to the WebMCP spec URI —
the custom-binding form the A2A spec (§12.7) defines for non-core
transports. The tools listed under `skills` are exactly the read-only WebMCP
tools registered on the homepage; nothing else is advertised. A test guards
this: claiming a `JSONRPC`/`GRPC`/`HTTP+JSON` binding turns
`tests/agent-card.test.mjs` red.

## Verify

```bash
npm run agent-card:verify                  # exit 0 when the issue's bar holds
npm run agent-card:verify -- --json        # scanner-shaped JSON result
npm run agent-card:verify -- --url https://preview.example/.well-known/agent-card.json
```

The verifier runs the same `GET /.well-known/agent-card.json` the scanner
does and passes only when the response is 200, parseable JSON, and carries
the required AgentCard fields. Spot-check by hand:

```bash
curl -s https://askmilo.pro/.well-known/agent-card.json | head -20
```

Then re-scan <https://askmilo.pro> —
`checks.discovery.a2aAgentCard.status` should report `pass`. The card is
live once the post-merge deploy completes — there is no Cloudflare or DNS
step for this one.
