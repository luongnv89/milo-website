# Markdown content negotiation for askmilo.pro

Runbook for enabling Markdown for Agents — the
`checks.contentAccessibility.markdownNegotiation` check on
<https://isitagentready.com>.

- **Feature docs:** [Cloudflare — Markdown for Agents](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/)
- **Guide:** <https://isitagentready.com/.well-known/agent-skills/markdown-negotiation/SKILL.md>
- **Config source of truth:** [`scripts/markdown-negotiation.mjs`](../scripts/markdown-negotiation.mjs)

GitHub Pages cannot do server-driven content negotiation — there is no
server config it honors. The site is fronted by a Cloudflare proxy (live
responses already carry `server: cloudflare` and `cf-ray`), so the
negotiation runs at the zone edge via Cloudflare's native **Markdown for
Agents** feature — the mechanism the guide itself recommends for Cloudflare
zones ("no application code changes needed"). Enabling it is one operator
action, as below. Merging the PR that added these files does **not** make
the check pass on its own.

> **Plan requirement:** Markdown for Agents needs a **Pro or Business**
> zone plan. A plan-limited zone answers the publish script's PATCH with a
> Cloudflare entitlement error — upgrade the plan first, or the setting
> cannot be enabled.

## What gets enabled

One zone setting: `content_converter` → `"on"`. Once on, the edge converts
HTML to Markdown on the fly for any request whose `Accept` header includes
`text/markdown`:

- `Content-Type: text/markdown; charset=utf-8` on the negotiated response
- `x-markdown-tokens` with the converted document's token count
- `Vary: Accept` so caches keep the Markdown and HTML variants separate
- YAML frontmatter from the page's `<meta>` tags and any JSON-LD preserved
  as a fenced `json` block (Cloudflare's output format)
- HTML remains the default for requests that do not ask for Markdown — the
  verifier checks this control leg explicitly

The scanner's probe is `GET /` with
`Accept: text/markdown, text/html;q=0.8, */*;q=0.5`; the check passes when
the response is ok and `Content-Type` is `text/markdown` (or `text/plain`
with a non-HTML body).

## Publish

### Option A — dashboard (manual)

1. Cloudflare dashboard → `askmilo.pro` → **AI Crawl Control**.
2. Enable **Markdown for Agents**.

### Option B — script (recommended)

Requires a Cloudflare API token with **Zone Settings edit** on
`askmilo.pro` (never commit it — export it):

```bash
export CLOUDFLARE_API_TOKEN=…                        # or CF_API_TOKEN
npm run markdown-negotiation:publish                 # dry run — shows planned PATCH
npm run markdown-negotiation:publish -- --apply      # PATCH settings/content_converter → "on"
```

The script is idempotent: it GETs the setting first and only PATCHes when
the value differs. Nothing else in the zone is touched.

## Verify

```bash
npm run markdown-negotiation:verify                 # exit 0 when the issue's bar holds
npm run markdown-negotiation:verify -- --json       # scanner-shaped JSON result
npm run markdown-negotiation:verify -- --url https://preview.example/   # other URL
```

The verifier runs the same `GET /` + `Accept: text/markdown, …` the scanner
does and passes only when a Markdown representation comes back **and** a
browser-shaped `Accept` still gets HTML. Spot-check by hand:

```bash
curl -sI -H 'Accept: text/markdown, text/html;q=0.8, */*;q=0.5' https://askmilo.pro/ \
  | grep -iE '^(content-type|x-markdown-tokens|vary):'
```

Then re-scan <https://askmilo.pro> —
`checks.contentAccessibility.markdownNegotiation.status` should report
`pass`. The change is live only once the zone setting is `on` in
production, not just in this repository.
