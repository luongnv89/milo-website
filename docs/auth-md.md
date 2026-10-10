# auth.md for askmilo.pro

Runbook for the Auth.md document — the `checks.discovery.authMd` check on
<https://isitagentready.com>.

- **Guide:** <https://isitagentready.com/.well-known/agent-skills/auth-md/SKILL.md>
- **Document source of truth:** [`public/auth.md`](../public/auth.md)

## What gets shipped

`public/auth.md` is a committed static file — the Vite build copies `public/`
verbatim into `dist/`, so merging ships `https://askmilo.pro/auth.md` on the
next GitHub Pages deploy. No generator, no Cloudflare transform, no DNS step:
`.md` is a real extension GitHub Pages serves as `text/markdown`, and the
scanner fetches it with `Accept: text/markdown, text/plain, */*`, so even a
plainer media type would satisfy the probe.

## Why the document is self-contained (no `agent_auth`, no OAuth metadata)

The guide's preferred path advertises an `agent_auth` block inside OAuth
Authorization Server metadata (`/.well-known/oauth-authorization-server`).
That path requires a real authorization server — `agent_auth` needs a
`register_uri` and at least one complete registration method, and AS metadata
needs a valid `issuer`. **askmilo.pro has none of these**: the site is static
and read-only; there is no token endpoint, no authorization endpoint, no
registration endpoint and no account system (grep finds zero such endpoints,
and `src/webmcp.js` documents "no server, account or purchase flow").

Publishing the metadata anyway would fabricate endpoints that 404 — the same
honesty rule PRs #79/#80 applied to A2A bindings and the api-catalog
`status` relation. The guide's fallback covers exactly this case: "If OAuth
metadata is not available, keep `/auth.md` self-contained" — name the agent
audience, document registration/provisioning endpoint(s), list supported
method(s), and explain credential use. `public/auth.md` does all four:

- **Audience** — AI agents, assistants, crawlers and readiness scanners.
- **Endpoints** — none exist; the doc says so plainly (an honest "none" is a
  valid answer to the clause; inventing one is not).
- **Methods** — anonymous/unauthenticated `GET` only.
- **Credentials** — none issued, required or accepted.

The OAuth discovery documents remain the business of the sibling issues
(#60 oauthDiscovery, #61 oauthProtectedResource — both conditional on the
site ever gaining protected APIs). If a real authorization server ever
exists, add the metadata there and extend `auth.md` to point at it.

## Verify

```bash
npm run auth-md:verify                  # exit 0 when the issue's bar holds
npm run auth-md:verify -- --json        # scanner-shaped JSON result
npm run auth-md:verify -- --url https://preview.example/auth.md
```

The verifier replays the scanner's `GET /auth.md` and passes only on HTTP 200
plus the guide's document shape: an H1 containing `auth.md`, the four
self-contained topics, and no advertised OAuth/`agent_auth` endpoints the
site does not serve. Spot-check by hand:

```bash
curl -s https://askmilo.pro/auth.md | head -10
```

Then re-scan <https://askmilo.pro> — `checks.discovery.authMd.status` should
report `pass`. The check goes live once the post-merge Pages deploy lands —
there is no Cloudflare or DNS step for this one.
