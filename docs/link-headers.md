# Link response headers for askmilo.pro

Runbook for publishing the `Link` response headers that
`checks.discoverability.linkHeaders` on <https://isitagentready.com> scans for.

- **Spec:** [RFC 8288 — Web Linking](https://www.rfc-editor.org/rfc/rfc8288) ·
  [RFC 9727 §3 — api-catalog](https://www.rfc-editor.org/rfc/rfc9727#section-3) ·
  [RFC 8631 — service-desc / service-doc / describedby](https://www.rfc-editor.org/rfc/rfc8631)
- **Guide:** <https://isitagentready.com/.well-known/agent-skills/link-headers/SKILL.md>
- **Header source of truth:** [`scripts/link-headers.mjs`](../scripts/link-headers.mjs)

GitHub Pages cannot send custom response headers — there is no `_headers`
file or server config it honors. The site is fronted by a Cloudflare proxy
(live responses already carry `server: cloudflare` and `cf-ray`), so the
header is attached at the zone edge by a **response-header Transform Rule**
— the mechanism the guide itself recommends. The same discovery hints also
live in `index.html` as `<link rel="…">` elements (the HTML serialization of
the same RFC 8288 link set), which ship with the normal site deploy; the HTTP
header still needs one operator action, as below. Merging the PR that added
these files does **not** make the check pass on its own.

## The header set

Sent on the homepage (`/`, and `/index.html` which serves the same document),
one `Link` header carrying four comma-separated link-values:

| Target | rel | Points agents at |
|--------|-----|-------------------|
| `/.well-known/ai-catalog.json` | `api-catalog` | The site's machine-readable catalog of agent-facing resources (the same index the DNS-AID `_index` record advertises) |
| `/.well-known/agent-skills/milo-hands-free-ai-via-siri/SKILL.md` | `service-desc` | Machine-readable description of the MILO agent skill |
| `/llms-full.txt` | `service-doc` | Full product documentation written for LLM consumers |
| `/llms.txt` | `describedby` | Concise machine-readable description of the site |

All four relation types come from the guide's registered set; every target is
a resource the site actually serves (test-guarded against `public/`).

## Publish

### Option A — dashboard (manual)

1. Cloudflare dashboard → `askmilo.pro` → **Rules → Transform Rules →
   Response Header Transform Rules → Create rule**.
2. Name it `link-headers: agent-discovery Link header`, set **When incoming
   requests match…** to a custom expression:
   `(http.request.uri.path eq "/" or http.request.uri.path eq "/index.html")`.
3. Under **Then…**, choose **Set static** for header `Link` with the value
   printed by `npm run link-headers:publish` (the dry run shows it verbatim).

### Option B — script (recommended)

Requires a Cloudflare API token with **Zone Transform Rules edit** on
`askmilo.pro` (never commit it — export it):

```bash
export CLOUDFLARE_API_TOKEN=…               # or CF_API_TOKEN
npm run link-headers:publish                # dry run — shows planned rule
npm run link-headers:publish -- --apply     # upsert the transform rule
```

The script is idempotent: it reads the phase entrypoint ruleset, keeps every
rule it does not manage, and rewrites only rules tagged with the
`link-headers:` description prefix. Nothing else in the zone is touched.

## Verify

```bash
npm run link-headers:verify                 # exit 0 when the issue's bar holds
npm run link-headers:verify -- --json       # scanner-shaped JSON result
npm run link-headers:verify -- --url https://preview.example/   # other URL
```

The verifier runs the same `GET /` the scanner does, parses the `Link`
header(s) per RFC 8288, and passes only when at least one link carries a
registered discovery rel **and** the live set matches
[`scripts/link-headers.mjs`](../scripts/link-headers.mjs) (no drift).
Spot-check by hand:

```bash
curl -sI https://askmilo.pro/ | grep -i '^link:'
```

Then re-scan <https://askmilo.pro> — `checks.discoverability.linkHeaders.status`
should report `pass`. The change is live only once the header is on the
production response, not just in this repository.
