// Enable Cloudflare's "Markdown for Agents" (scripts/markdown-negotiation.mjs)
// on the zone fronting askmilo.pro.
//
// Usage:
//   node scripts/publish-markdown-negotiation.mjs           # dry-run: print plan
//   node scripts/publish-markdown-negotiation.mjs --apply   # PATCH the setting
//
// Required env for --apply:
//   CLOUDFLARE_API_TOKEN (or CF_API_TOKEN) — token with Zone Settings edit
//                                          permission on the zone
// Optional env:
//   CLOUDFLARE_ZONE_ID   (or CF_ZONE_ID)   — skips the zone lookup
//
// The token is never printed, written, or committed — it only reaches the
// api.cloudflare.com request Authorization header.
//
// Mechanism: Markdown for Agents is a single zone setting
// (`content_converter`). The script GETs it first and only PATCHes when the
// value differs, so repeated runs are idempotent and nothing else in the
// zone is touched. The feature requires a Pro or Business zone plan — a
// plan-limited zone answers the PATCH with an entitlement error, which the
// script surfaces verbatim with a remediation hint.

import {
  DOMAIN,
  HOME_URL,
  SCANNER_ACCEPT,
  SETTING_ID,
  SETTING_VALUE,
  renderSettingPayload,
} from './markdown-negotiation.mjs';

const API = 'https://api.cloudflare.com/client/v4';
const SETTING_PATH = (zone) => `/zones/${zone}/settings/${SETTING_ID}`;

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
  let res;
  try {
    res = await fetch(`${API}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (err) {
    fail(`Cloudflare ${method} ${path} failed: ${err.message}`);
  }
  const json = await res.json().catch(() => null);
  if (!res.ok || !json || json.success === false) {
    const errs = json?.errors?.map((e) => `${e.code}: ${e.message}`).join('; ');
    return { error: `Cloudflare ${method} ${path} -> HTTP ${res.status} ${errs ?? ''}`.trim() };
  }
  return { result: json.result };
}

async function zoneId() {
  if (ZONE_ID) return ZONE_ID;
  const { result, error } = await cf(`/zones?name=${encodeURIComponent(DOMAIN)}`);
  if (error) fail(error);
  if (!Array.isArray(result) || result.length !== 1) {
    fail(`expected exactly one Cloudflare zone for ${DOMAIN}, got ${result?.length ?? 0}`);
  }
  return result[0].id;
}

function plan() {
  console.log(`Markdown-negotiation dry run — planned change for ${DOMAIN}:`);
  console.log(`  PATCH ${SETTING_PATH('{zone_id}')}`);
  console.log(`  body: ${JSON.stringify(renderSettingPayload())}`);
  console.log('\nThis turns on Cloudflare Markdown for Agents zone-wide: any page');
  console.log(`requested with Accept: ${SCANNER_ACCEPT}`);
  console.log('is converted to Markdown at the edge (Content-Type: text/markdown).');
  console.log('Requires a Pro or Business zone plan and a token with Zone');
  console.log('Settings edit. Dashboard path: AI Crawl Control → Markdown for');
  console.log(`Agents. Live check afterwards: ${HOME_URL}`);
  console.log('\nVerify afterwards: npm run markdown-negotiation:verify');
}

async function publish() {
  const id = await zoneId();

  const { result: current, error: readError } = await cf(SETTING_PATH(id));
  if (readError) fail(readError);

  // Zone settings answer { id, value, editable, ... }; `value` is the state.
  if (current?.value === SETTING_VALUE) {
    console.log(`○ unchanged  ${SETTING_ID} already "${SETTING_VALUE}" on ${DOMAIN}`);
    return;
  }

  const { result, error } = await cf(SETTING_PATH(id), {
    method: 'PATCH',
    body: renderSettingPayload(),
  });
  if (error) {
    console.error(`✗ ${error}`);
    console.error('  Markdown for Agents requires a Pro or Business zone plan.');
    console.error('  Check the zone plan, or enable it in the dashboard:');
    console.error('  AI Crawl Control → Markdown for Agents.');
    process.exit(1);
  }

  console.log(`✓ enabled    ${SETTING_ID} = "${result?.value ?? SETTING_VALUE}" on ${DOMAIN}`);
  console.log(`             requests with Accept: ${SCANNER_ACCEPT}`);
  console.log('             now get Content-Type: text/markdown from the edge');
}

if (APPLY && !TOKEN) {
  fail('missing CLOUDFLARE_API_TOKEN (or CF_API_TOKEN) — export it and retry');
}

if (!APPLY) {
  plan();
} else {
  await publish();
  console.log('Done. Verify with: npm run markdown-negotiation:verify');
}
