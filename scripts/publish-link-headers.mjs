// Publish the Link response-header transform rule (scripts/link-headers.mjs)
// to the Cloudflare zone fronting askmilo.pro.
//
// Usage:
//   node scripts/publish-link-headers.mjs           # dry-run: print planned rule
//   node scripts/publish-link-headers.mjs --apply   # upsert the transform rule
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
// phase whose managed rule `set`s the Link header on homepage responses.
// The update replaces the phase ruleset's rule list, so every foreign rule is
// read first and carried back verbatim — only rules tagged with the managed
// description prefix are rewritten.

import {
  DOMAIN,
  HOME_URL,
  HEADER_NAME,
  LINK_TARGETS,
  isManagedRule,
  renderHeaderValue,
  renderRule,
} from './link-headers.mjs';

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
  console.log(`Link-header dry run — planned transform rule for ${DOMAIN}:`);
  console.log(`  phase:      ${PHASE} (zone entrypoint)`);
  console.log(`  expression: ${renderRule().expression}`);
  console.log(`  sets:       ${HEADER_NAME}: ${renderHeaderValue()}`);
  console.log('\nThe rule list is PUT in full: any existing rules in the phase');
  console.log('are preserved; only rules tagged with the managed description');
  console.log(`prefix are replaced. Live check afterwards: ${HOME_URL}`);
  console.log('\nVerify afterwards: npm run link-headers:verify');
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
    current.action_parameters?.headers?.[HEADER_NAME]?.operation === 'set' &&
    current.action_parameters?.headers?.[HEADER_NAME]?.value ===
      wanted.action_parameters.headers[HEADER_NAME].value
  ) {
    console.log(`○ unchanged  transform rule already sets ${HEADER_NAME} on ${HOME_URL}`);
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
  for (const t of LINK_TARGETS) {
    console.log(`            ${t.rel} -> ${t.path}`);
  }
}

if (APPLY && !TOKEN) {
  fail('missing CLOUDFLARE_API_TOKEN (or CF_API_TOKEN) — export it and retry');
}

if (!APPLY) {
  plan();
} else {
  await publish();
  console.log('Done. Verify with: npm run link-headers:verify');
}
