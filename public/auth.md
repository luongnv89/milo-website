# auth.md

Agent authentication and registration document for **askmilo.pro** — the
website of MILO, the iOS app that puts frontier AI behind "Hey Siri, ask
MILO". This file follows the Auth.md convention used by the isitagentready
agent-readiness programme
(<https://isitagentready.com/.well-known/agent-skills/auth-md/SKILL.md>).

## Agent audience

This document is for autonomous AI agents, LLM-powered assistants, crawlers
and agent-readiness scanners that want to use or evaluate the agent-facing
surfaces of askmilo.pro — for example, to answer questions about MILO, to
help a user set the app up, or to audit the site's agent readiness.

## Authentication required: none

**askmilo.pro is a static, read-only marketing and documentation site. Every
agent-facing surface is public and unauthenticated — no registration,
account, API key, token or credential of any kind is required to read it.**

| Surface | URL | Auth |
|---------|-----|------|
| Site content | <https://askmilo.pro/> | none |
| LLM-readable product docs | <https://askmilo.pro/llms.txt>, <https://askmilo.pro/llms-full.txt> | none |
| A2A Agent Card | <https://askmilo.pro/.well-known/agent-card.json> | none |
| RFC 9727 API catalog | <https://askmilo.pro/.well-known/api-catalog> | none |
| Published agent skill | <https://askmilo.pro/.well-known/agent-skills/milo-hands-free-ai-via-siri/SKILL.md> | none |
| WebMCP tools (in-browser, read-only) | registered on the homepage via `navigator.modelContext` | none |

## Registration and provisioning endpoints

**None exist — and none are needed.** askmilo.pro has no agent registration
endpoint, no provisioning flow and no account system; nothing on this origin
accepts writes from agents. An agent that wants to "register" does not need
to: fetch the public documents listed above directly.

The MILO iOS app is distributed through the Apple App Store and configured
by its owner inside the app (the user supplies their own AI-provider API key,
or uses on-device Apple Intelligence). That in-app configuration happens on
the user's device, is not an agent-facing endpoint, and is intentionally not
advertised as one.

## Supported methods

- **Anonymous / unauthenticated access** — the only method, and it covers
  the entire agent-facing surface. Send a plain `GET`; do not send an
  `Authorization` header.

## OAuth metadata: deliberately not published

No `/.well-known/oauth-authorization-server`,
`/.well-known/openid-configuration` or `/.well-known/oauth-protected-resource`
document is served, and no `agent_auth` block is advertised. There is no
authorization server on this origin — publishing metadata for endpoints that
do not exist would point agents at 404s. Should askmilo.pro ever gain
protected APIs, the OAuth discovery documents and an `agent_auth`
registration block will be published at that time.

## Credential use

No credentials are issued, required or accepted for any agent-facing surface.
If an agent flow believes it needs a credential to read askmilo.pro, it does
not — the correct action is an unauthenticated `GET`.

## Contact

Questions, access requests and integration proposals:
<https://askmilo.pro/support.html> (email and issue links).
