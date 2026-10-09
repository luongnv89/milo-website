# DNS-AID records for askmilo.pro

Runbook for publishing the DNS for AI Discovery (DNS-AID) record set that
`checks.discoverability.dnsAid` on <https://isitagentready.com> scans for.

- **Spec:** [draft-mozleywilliams-dnsop-dnsaid-02](https://datatracker.ietf.org/doc/draft-mozleywilliams-dnsop-dnsaid/)
- **Guide:** <https://isitagentready.com/.well-known/agent-skills/dns-aid/SKILL.md>
- **Record source of truth:** [`scripts/dns-aid-records.mjs`](../scripts/dns-aid-records.mjs)
- **Zone-file form:** [`dns/askmilo.pro.zone`](../dns/askmilo.pro.zone)

DNS records live at the DNS provider (Cloudflare — `askmilo.pro` is delegated to
`boyd`/`rosalie.ns.cloudflare.com`), not in this repository. The site itself is
served from GitHub Pages; nothing in `public/` or `dist/` can publish a DNS
record. Merging the PR that added these files does **not** make the check pass —
the records must be applied once by an operator, as below.

## The record set

```dns
_index._agents.askmilo.pro. 3600 IN SVCB 1 askmilo.pro. alpn="h2,h3" port=443 mandatory=alpn,port key65409="ai-catalog.json"
```

One ServiceMode SVCB record at the organizational-index name (draft-02 §3.2):

- **`_index._agents`** — the well-known DNS-SD-style entry point to the
  organization's agent index.
- **`SVCB 1 askmilo.pro.`** — ServiceMode (`SvcPriority > 0`) pointing at the
  origin that serves the index. `TargetName` must not contain underscores
  because TLS certificates are used to talk to it.
- **`alpn="h2,h3" port=443 mandatory=alpn,port`** — the index is fetched over
  HTTPS on the standard port.
- **`key65409="ai-catalog.json"`** — the RFC 8615 well-known path of the index
  document, `https://askmilo.pro/.well-known/ai-catalog.json`. The `well-known`
  SvcParamKey has no IANA assignment yet, so it rides in the RFC 9460 generic
  `keyNNNNN` form using the dns-aid-core interim private-use number (65409).

No `_a2a._agents` or `_mcp._agents` records are published on purpose: the site
exposes no A2A or MCP endpoint, and advertising endpoints that do not exist is
worse than no record. Add them — one record per real endpoint — when those ship.

## Publish

### Option A — dashboard (manual)

1. Cloudflare dashboard → `askmilo.pro` → **DNS → Records → Add record**.
2. Type `SVCB`, name `_index._agents`, priority `1`, target `askmilo.pro`,
   TTL 3600, and set the service parameters to
   `alpn="h2,h3" port=443 mandatory=alpn,port key65409="ai-catalog.json"`.
3. **DNS → Settings → DNSSEC → Enable**. Cloudflare shows a DS record — add it
   at the domain registrar (the registrar currently shown in the domain's
   WHOIS) to finish the chain of trust.

### Option B — script (recommended)

Requires a Cloudflare API token with **Zone.DNS edit** on `askmilo.pro`
(never commit it — export it):

```bash
export CLOUDFLARE_API_TOKEN=…        # or CF_API_TOKEN
npm run dns-aid:publish              # dry run — shows planned changes
npm run dns-aid:publish -- --apply   # upsert the SVCB record
npm run dns-aid:publish -- --apply --dnssec
                                     # also enable DNSSEC and print the DS
                                     # record to add at the registrar
```

The script is idempotent: it creates the record when absent and updates it when
the stored data differs.

## Verify

```bash
npm run dns-aid:verify               # exit 0 when the issue's bar holds
npm run dns-aid:verify -- --json     # scanner-shaped JSON result
```

The verifier runs the same seven DoH queries the scanner does
(`SVCB`/`HTTPS`/`TXT` on `_index._agents`, `_a2a._agents`, `_mcp._agents`) plus a
`DS` lookup, and passes only when at least one ServiceMode record answers **and**
the answers are DNSSEC-validated (AD bit). Spot-check by hand:

```bash
dig +dnssec SVCB _index._agents.askmilo.pro   # answer + RRSIG expected
dig +short DS askmilo.pro                     # DS expected once DNSSEC is live
```

Then re-scan <https://askmilo.pro> — `checks.discoverability.dnsAid.status`
should report `pass`. The change is live only once these record queries return
answers on the public resolvers, not just inside Cloudflare.
