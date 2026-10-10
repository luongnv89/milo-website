// Publish the api-catalog Content-Type transform rule (scripts/api-catalog.mjs)
// to the Cloudflare zone fronting askmilo.pro.
//
// Usage:
//   node scripts/publish-api-catalog.mjs           # dry-run: print planned rule
//   node scripts/publish-api-catalog.mjs --apply   # upsert the transform rule
//
// Required env for --apply:
//   CLOUDFLARE_API_TOKEN (or CF_API_TOKEN) — token with Zone Transform Rules
//                                            edit permission on the zone
// Optional env:
//   CLOUDFLARE_ZONE_ID   (or CF_ZONE_ID)   — skips the zone lookup
//
// The token is never printed, written, or committed — it only reaches the
// api.cloudflare.com request Authorization header.
//
// Mechanism: a zone-level ruleset for the http_response_headers_transform
// phase whose managed rule `set`s Content-Type (and the self-referential
// api-catalog Link) on responses for /.well-known/api-catalog — the path
// GitHub Pages would otherwise answer as application/octet-stream. The update
// replaces the phase ruleset's rule list, so every foreign rule — including
// the link-headers: rule managed by scripts/publish-link-headers.mjs — is
// read first and carried back verbatim; only rules tagged with the managed
// description prefix are rewritten.

import {
  DOMAIN,
  API_CATALOG_PATH,
  CONTENT_TYPE_VALUE,
  SELF_LINK_VALUE,
  isManagedRule,
  renderRule,
} from './api-catalog.mjs';

const API = 'https://api.cloudflare.com/client/v4';
const PHASE = 'http_response_headers_transform';

const args = new Set(process.argv.slice(2));
const APPLY = args.has('--apply');
const TOKEN =
  process.env.CLOUDFLARE_API_TOKEN || process.env.CF_API_TOKEN || '';
const ZONE_ID =
  process.env.CLOUDFLARE_ZONE_ID || process.env.CF_ZONE_ID || '';

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

async function cf(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json || json.success === false) {
    const errs = json?.errors?.map((e) => `${e.code}: ${e.message}`).join('; ');
    fail(`Cloudflare ${method} ${path} -> HTTP ${res.status} ${errs ?? ''}`.trim());
  }
  return json.result;
}

// The entrypoint lookup is also how we learn whether the phase ruleset
// exists; an absent ruleset answers 404, which is not a hard failure.
async function cfEntrypoint(zone) {
  const res = await fetch(
    `${API}/zones/${zone}/rulesets/phases/${PHASE}/entrypoint`,
    { headers: { Authorization: `Bearer ${TOKEN}` } },
  );
  if (res.status === 404) return null;
  const json = await res.json().catch(() => null);
  if (!res.ok || !json || json.success === false) {
    const errs = json?.errors?.map((e) => `${e.code}: ${e.message}`).join('; ');
    fail(`Cloudflare GET entrypoint -> HTTP ${res.status} ${errs ?? ''}`.trim());
  }
  return json.result;
}

async function zoneId() {
  if (ZONE_ID) return ZONE_ID;
  const zones = await cf(`/zones?name=${encodeURIComponent(DOMAIN)}`);
  if (!Array.isArray(zones) || zones.length !== 1) {
    fail(`expected exactly one Cloudflare zone for ${DOMAIN}, got ${zones?.length ?? 0}`);
  }
  return zones[0].id;
}

// Reduce a fetched rule to the fields the update call accepts, keeping the id
// so foreign rules survive the full-list replace with their identity intact.
function cleanRule(rule) {
  const out = {
    action: rule.action,
    action_parameters: rule.action_parameters,
    expression: rule.expression,
    description: rule.description,
    enabled: rule.enabled !== false,
  };
  if (rule.id) out.id = rule.id;
  return out;
}

function plan() {
  const rule = renderRule();
  console.log(`api-catalog dry run — planned transform rule for ${DOMAIN}:`);
  console.log(`  phase:      ${PHASE} (zone entrypoint)`);
  console.log(`  expression: ${rule.expression}`);
  for (const [name, header] of Object.entries(rule.action_parameters.headers)) {
    console.log(`  sets:       ${name}: ${header.value}`);
  }
  console.log('\nThe rule list is PUT in full: any existing rules in the phase');
  console.log('are preserved; only rules tagged with the managed description');
  console.log(`prefix are replaced. Live check afterwards: ${DOMAIN}${API_CATALOG_PATH}`);
  console.log('\nVerify afterwards: npm run api-catalog:verify');
}

async function publish() {
  const id = await zoneId();
  const ruleset = await cfEntrypoint(id);
  const existing = ruleset?.rules ?? [];
  const kept = existing.filter((r) => !isManagedRule(r)).map(cleanRule);
  const dropped = existing.length - kept.length;
  const rules = [...kept, renderRule()];

  // Idempotency: compare the rendered rule against the managed one on file.
  const current = existing.find(isManagedRule);
  const wanted = renderRule();
  if (
    current &&
    current.enabled !== false &&
    current.expression === wanted.expression &&
    current.action === wanted.action &&
    current.action_parameters?.headers?.['Content-Type']?.value ===
      wanted.action_parameters.headers['Content-Type'].value &&
    current.action_parameters?.headers?.Link?.value ===
      wanted.action_parameters.headers.Link.value
  ) {
    console.log(`○ unchanged  transform rule already covers ${API_CATALOG_PATH}`);
    return;
  }

  await cf(`/zones/${id}/rulesets/phases/${PHASE}/entrypoint`, {
    method: 'PUT',
    body: { rules },
  });
  console.log(
    `✓ upserted  ${PHASE} rule on ${DOMAIN} ` +
      `(${dropped > 0 ? `replaced ${dropped} managed rule(s), ` : ''}` +
      `${kept.length} foreign rule(s) kept)`,
  );
  console.log(`            Content-Type -> ${CONTENT_TYPE_VALUE}`);
  console.log(`            Link         -> ${SELF_LINK_VALUE}`);
}

if (APPLY && !TOKEN) {
  fail('missing CLOUDFLARE_API_TOKEN (or CF_API_TOKEN) — export it and retry');
}

if (!APPLY) {
  plan();
} else {
  await publish();
  console.log('Done. Verify with: npm run api-catalog:verify');
}
