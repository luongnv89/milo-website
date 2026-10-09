// Publish the DNS-AID record set (scripts/dns-aid-records.mjs) to Cloudflare.
//
// Usage:
//   node scripts/publish-dns-aid.mjs              # dry-run: print planned changes
//   node scripts/publish-dns-aid.mjs --apply      # upsert the records via the API
//   node scripts/publish-dns-aid.mjs --apply --dnssec
//                                                 # also enable DNSSEC and print
//                                                 # the DS record for the registrar
//
// Required env for --apply / --dnssec:
//   CLOUDFLARE_API_TOKEN (or CF_API_TOKEN) — token with Zone.DNS edit permission
// Optional env:
//   CLOUDFLARE_ZONE_ID   (or CF_ZONE_ID)   — skips the zone lookup
//
// The token is never printed, written, or committed — it only reaches the
// api.cloudflare.com request Authorization header.

import {
  DNS_AID_RECORDS,
  DOMAIN,
  renderZone,
} from './dns-aid-records.mjs';

const API = 'https://api.cloudflare.com/client/v4';

const args = new Set(process.argv.slice(2));
const APPLY = args.has('--apply');
const WITH_DNSSEC = args.has('--dnssec');
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

// Cloudflare stores SVCB/HTTPS RDATA as structured fields, not one string.
function cfData(record) {
  return {
    svc_priority: record.svcPriority,
    target_name: record.targetName,
    value: record.svcParams,
  };
}

function dataEquals(a, b) {
  return (
    a.svc_priority === b.svc_priority &&
    a.target_name === b.target_name &&
    a.value === b.value
  );
}

async function zoneId() {
  if (ZONE_ID) return ZONE_ID;
  const zones = await cf(`/zones?name=${encodeURIComponent(DOMAIN)}`);
  if (!Array.isArray(zones) || zones.length !== 1) {
    fail(`expected exactly one Cloudflare zone for ${DOMAIN}, got ${zones?.length ?? 0}`);
  }
  return zones[0].id;
}

async function publish() {
  const id = await zoneId();
  for (const record of DNS_AID_RECORDS) {
    const fqdn = `${record.name}.${DOMAIN}`;
    const want = cfData(record);
    const existing = await cf(
      `/zones/${id}/dns_records?name=${encodeURIComponent(fqdn)}&type=${record.type}`,
    );
    const match = (existing ?? []).find((r) => r.type === record.type);
    if (match && dataEquals(match.data ?? {}, want)) {
      console.log(`○ unchanged ${record.type} ${fqdn}`);
      continue;
    }
    if (match) {
      await cf(`/zones/${id}/dns_records/${match.id}`, {
        method: 'PUT',
        body: {
          type: record.type,
          name: fqdn,
          data: want,
          ttl: record.ttl,
        },
      });
      console.log(`✓ updated  ${record.type} ${fqdn}`);
    } else {
      await cf(`/zones/${id}/dns_records`, {
        method: 'POST',
        body: {
          type: record.type,
          name: fqdn,
          data: want,
          ttl: record.ttl,
        },
      });
      console.log(`✓ created  ${record.type} ${fqdn}`);
    }
  }
}

async function enableDnssec(zone) {
  // One-time zone signing. The DS record Cloudflare returns must still be
  // added at the domain registrar — that step cannot be automated from here.
  const status = await cf(`/zones/${zone}/dnssec`, {
    method: 'PATCH',
    body: { status: 'active' },
  });
  console.log(`✓ DNSSEC status: ${status.status}`);
  if (status.ds) {
    console.log('  Add this DS record at the registrar to complete the chain:');
    console.log(`  ${status.ds}`);
  }
}

function plan() {
  console.log('DNS-AID dry run — planned records (dns/askmilo.pro.zone):');
  process.stdout.write('\n' + renderZone() + '\n');
  console.log('Planned changes at Cloudflare:');
  for (const r of DNS_AID_RECORDS) {
    console.log(`  upsert ${r.type} ${r.name}.${DOMAIN} ttl=${r.ttl}`);
  }
  console.log('DNSSEC: enable in Cloudflare (or run with --apply --dnssec),');
  console.log('        then add the printed DS record at the domain registrar.');
  console.log('\nVerify afterwards: npm run dns-aid:verify');
}

if (WITH_DNSSEC && !APPLY) {
  fail('--dnssec only makes sense with --apply');
}
if (APPLY && !TOKEN) {
  fail('missing CLOUDFLARE_API_TOKEN (or CF_API_TOKEN) — export it and retry');
}

if (!APPLY) {
  plan();
} else {
  await publish();
  if (WITH_DNSSEC) {
    await enableDnssec(await zoneId());
  } else {
    console.log('○ DNSSEC not enabled by this run — re-run with --dnssec or enable');
    console.log('  it in the Cloudflare dashboard (DNS → Settings → DNSSEC).');
  }
  console.log('Done. Verify with: npm run dns-aid:verify');
}
