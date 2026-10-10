# RFC 9727 API catalog for askmilo.pro

Runbook for the API catalog — the `checks.discovery.apiCatalog` check on
<https://isitagentready.com>.

- **Spec:** [RFC 9727 — api-catalog well-known URI and link relation](https://www.rfc-editor.org/rfc/rfc9727)
  (linkset format [RFC 9264 §4.2](https://www.rfc-editor.org/rfc/rfc9264#section-4.2),
  relation types [RFC 8631](https://www.rfc-editor.org/rfc/rfc8631))
- **Guide:** <https://isitagentready.com/.well-known/agent-skills/api-catalog/SKILL.md>
- **Config source of truth:** [`scripts/api-catalog.mjs`](../scripts/api-catalog.mjs)

## What gets shipped

`npm run build` ends with `scripts/well-known.mjs`, which now writes three
generated artifacts into `dist/.well-known/`:

- `agent-skills/index.json` — the agentskills.io index (existing)
- `agent-card.json` — the A2A Agent Card (existing)
- `api-catalog` — the RFC 9727 linkset catalog (this issue)

The file is **extensionless on purpose**: the well-known URI is literally
`/.well-known/api-catalog` and GitHub Pages resolves only real file paths —
it will not map the request to `api-catalog.json`. The catalog is generated,
not committed, so its links always mirror the documents the site actually
publishes (a test fails the build if a link points at something that is
neither in `public/` nor emitted by the generator).

## The linkset

One entry — the site's only agent-facing API surface is the read-only WebMCP
tool set registered on the homepage (`src/webmcp.js`), anchored at the origin:

| Relation | Targets | Why |
|----------|---------|-----|
| `anchor` | `https://askmilo.pro/` | The WebMCP tools register on the homepage document |
| `service-desc` | `/.well-known/agent-card.json` · `/.well-known/agent-skills/milo-hands-free-ai-via-siri/SKILL.md` | Machine-readable descriptions of the agent service (A2A card; published skill doc) |
| `service-doc` | `/llms.txt` · `/llms-full.txt` | Human/LLM-readable product documentation |
| `service-meta` | `/.well-known/agent-skills/index.json` · `/.well-known/ai-catalog.json` | Metadata indexes describing the published skill set and agent resources |

`status` is deliberately absent — the static site has no health endpoint, and
RFC 9727 marks the relation optional. Inventing one would point agents at a
404 (the same honesty rule `agent-card` applies to A2A bindings, test-guarded).

## The Content-Type gap — one operator action required

The guide requires `Content-Type: application/linkset+json` on the response,
but GitHub Pages serves extensionless files as `application/octet-stream` and
offers no header control. The site is fronted by Cloudflare, so the correct
header is attached at the zone edge by a **response-header Transform Rule** —
the same mechanism [link-headers](link-headers.md) uses. The rule is scoped to
`(http.request.uri.path eq "/.well-known/api-catalog")` and sets:

- `Content-Type: application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"`
- `Link: </.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"`
  (the self-referential header RFC 9727 §2 asks for on GET/HEAD)

Until that rule is applied, the file deploys and returns HTTP 200 but the
verifier reports the wrong Content-Type — merging this PR alone does **not**
make the check pass.

### Publish — dashboard (manual)

1. Cloudflare dashboard → `askmilo.pro` → **Rules → Transform Rules →
   Response Header Transform Rules → Create rule**.
2. Name it `api-catalog: RFC 9727 linkset Content-Type + self Link`, set
   **When incoming requests match…** to a custom expression:
   `(http.request.uri.path eq "/.well-known/api-catalog")`.
3. Under **Then…**, **Set static** the two headers above (the dry run prints
   them verbatim).

### Publish — script (recommended)

Requires a Cloudflare API token with **Zone Transform Rules edit** on
`askmilo.pro` (never commit it — export it):

```bash
export CLOUDFLARE_API_TOKEN=…               # or CF_API_TOKEN
npm run api-catalog:publish                 # dry run — shows planned rule
npm run api-catalog:publish -- --apply      # upsert the transform rule
```

The script shares the `http_response_headers_transform` phase with
`link-headers:publish`. Each tool manages only rules carrying its own
description prefix (`api-catalog:` here, `link-headers:` there) and carries
every foreign rule back verbatim, so the two never touch each other's rules.

## Verify

```bash
npm run api-catalog:verify                  # exit 0 when the issue's bar holds
npm run api-catalog:verify -- --json        # scanner-shaped JSON result
npm run api-catalog:verify -- --url https://preview.example/.well-known/api-catalog
```

The verifier replays the scanner's probe (`GET /.well-known/api-catalog` with
`Accept: application/linkset+json, application/json`) and passes only on HTTP
200 + `application/linkset+json` Content-Type + a valid linkset document with
anchored entries. Spot-check by hand:

```bash
curl -si -H 'Accept: application/linkset+json' \
  https://askmilo.pro/.well-known/api-catalog | head -20
```

Then re-scan <https://askmilo.pro> —
`checks.discovery.apiCatalog.status` should report `pass`. The check is live
only once both halves are on production: the deployed file **and** the
transform rule — the file ships with the merge, the rule needs the publish
step above.

> **Related:** the homepage `Link` header and `<link rel="api-catalog">` tag
> continue to point at `/.well-known/ai-catalog.json` — the AIR-format agent
> resource index, which RFC 9727 §4.2 explicitly allows as an alternate
> catalog format. The new well-known URI is the RFC 9727 linkset catalog;
> both are honest targets for the relation.
