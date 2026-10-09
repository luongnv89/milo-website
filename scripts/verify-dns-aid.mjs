// Verify the live DNS-AID record set for askmilo.pro over DNS-over-HTTPS —
// the same queries the isitagentready scanner runs
// (checks.discoverability.dnsAid.details.queriesAttempted), evaluated against
// this issue's bar: at least one ServiceMode SVCB/HTTPS record under _agents
// AND DNSSEC-validated answers.
//
// Usage:
//   node scripts/verify-dns-aid.mjs           # human-readable report, exit 1 on fail
//   node scripts/verify-dns-aid.mjs --json    # machine-readable result only
//
// Pure functions are exported for tests (tests/dns-aid.test.mjs); network only
// happens in main().

import { pathToFileURL } from 'node:url';

import {
  DNS_AID_RECORDS,
  SCANNER_QUERIES,
  DOMAIN,
} from './dns-aid-records.mjs';

const RESOLVERS = [
  'https://cloudflare-dns.com/dns-query',
  'https://dns.google/resolve',
];

export const RR_TYPE = { SVCB: 64, HTTPS: 65, TXT: 16, DS: 43 };

// ---------------------------------------------------------------------------
// SVCB/HTTPS RDATA parsing
// ---------------------------------------------------------------------------

const KNOWN_PARAM_KEYS = {
  0: 'mandatory',
  1: 'alpn',
  2: 'no-default-alpn',
  3: 'port',
  4: 'ipv4hint',
  5: 'ech',
  6: 'ipv6hint',
  7: 'dohpath',
};

function paramKeyName(n) {
  return KNOWN_PARAM_KEYS[n] ?? `key${n}`;
}

// Decode a (possibly empty) uncompressed domain name from wire format.
// RFC 9460 forbids name compression inside SVCB RDATA.
function readName(buf, offset) {
  const labels = [];
  let pos = offset;
  while (pos < buf.length) {
    const len = buf[pos];
    pos += 1;
    if (len === 0) return { name: labels.length ? labels.join('.') + '.' : '.', end: pos };
    if (len > 63 || pos + len > buf.length) return null;
    labels.push(buf.subarray(pos, pos + len).toString('ascii'));
    pos += len;
  }
  return null;
}

function decodeSvcbWire(hex) {
  const buf = Buffer.from(hex.replace(/\s+/g, ''), 'hex');
  if (buf.length < 3) return null;
  const svcPriority = buf.readUInt16BE(0);
  const target = readName(buf, 2);
  if (!target) return null;
  const params = {};
  let pos = target.end;
  while (pos + 4 <= buf.length) {
    const key = buf.readUInt16BE(pos);
    const len = buf.readUInt16BE(pos + 2);
    const value = buf.subarray(pos + 4, pos + 4 + len);
    if (value.length !== len) return null;
    pos += 4 + len;
    const name = paramKeyName(key);
    if (key === 1) {
      // alpn: comma-separated length-prefixed protocol ids
      const alpns = [];
      let i = 0;
      while (i < value.length) {
        const l = value[i];
        alpns.push(value.subarray(i + 1, i + 1 + l).toString('ascii'));
        i += 1 + l;
      }
      params[name] = `"${alpns.join(',')}"`;
    } else if (key === 3) {
      params[name] = String(value.readUInt16BE(0));
    } else if (key === 0) {
      const keys = [];
      for (let i = 0; i + 2 <= value.length; i += 2) {
        keys.push(paramKeyName(value.readUInt16BE(i)));
      }
      params[name] = keys.join(',');
    } else {
      params[name] = `"${value.toString('ascii').replace(/[^\x20-\x7e]/g, '?')}"`;
    }
  }
  if (pos !== buf.length) return null;
  return { svcPriority, targetName: target.name, params };
}

// Parse an SVCB/HTTPS answer's `data` field from a DoH JSON response.
// Handles both the presentation form ("1 target. alpn=h2 ...") and the
// RFC 3597 generic form ("\# <len> <hex>") some resolvers return.
// Returns { svcPriority, targetName, params, raw } or null when unparsable.
export function parseSvcbRdata(data) {
  if (typeof data !== 'string' || !data.trim()) return null;
  const trimmed = data.trim();
  if (trimmed.startsWith('\\#')) {
    const parts = trimmed.split(/\s+/);
    const hex = parts.slice(2).join('');
    if (!hex || parts.length < 3) return null;
    const decoded = decodeSvcbWire(hex);
    return decoded ? { ...decoded, raw: trimmed } : null;
  }
  // Presentation form: "<priority> <target> <params...>".
  const m = trimmed.match(/^(\d+)\s+(\S+)(?:\s+(.*))?$/);
  if (!m) return null;
  const params = {};
  if (m[3]) {
    for (const tok of m[3].trim().split(/\s+/)) {
      const eq = tok.indexOf('=');
      if (eq === -1) params[tok] = true;
      else params[tok.slice(0, eq)] = tok.slice(eq + 1);
    }
  }
  return {
    svcPriority: Number(m[1]),
    targetName: m[2],
    params,
    raw: trimmed,
  };
}

// ---------------------------------------------------------------------------
// Record-set evaluation
// ---------------------------------------------------------------------------

// One ServiceMode SVCB/HTTPS record is acceptable iff it parses, has
// SvcPriority > 0, and its TargetName is a cert-usable name (no underscores —
// draft-02 §3.2 forbids them because TLS auth uses the TargetName).
export function isValidServiceRecord(record) {
  if (!record || record.svcPriority < 1) return false;
  if (!record.targetName || record.targetName.includes('_')) return false;
  return true;
}

// answers: [{ name, type, answers: [{ name, type, data }] | undefined,
//             status, ad }] — one entry per attempted query.
// Returns the scanner-shaped result plus this issue's verdict fields.
export function evaluateScan(attempts, expected = DNS_AID_RECORDS) {
  const records = [];
  const txtIndexEntries = [];
  let serviceRecordCount = 0;
  let aliasRecordCount = 0;
  let sawAnswer = false;
  let sawUnsignedAnswer = false;

  for (const attempt of attempts) {
    const answers = attempt.answers ?? [];
    if (answers.length === 0) continue;
    sawAnswer = true;
    // AD must be explicitly set for an answer to count as validated.
    if (attempt.ad !== true) sawUnsignedAnswer = true;
    for (const answer of answers) {
      if (answer.type === RR_TYPE.SVCB || answer.type === RR_TYPE.HTTPS) {
        const parsed = parseSvcbRdata(answer.data);
        records.push({
          name: attempt.name,
          type: answer.type === RR_TYPE.SVCB ? 'SVCB' : 'HTTPS',
          parsed,
          validService: isValidServiceRecord(parsed),
          alias: parsed?.svcPriority === 0,
        });
        if (parsed?.svcPriority === 0) aliasRecordCount += 1;
        else if (isValidServiceRecord(parsed)) serviceRecordCount += 1;
      } else if (answer.type === RR_TYPE.TXT) {
        const data = String(answer.data ?? '').replace(/^"|"$/g, '');
        if (data) txtIndexEntries.push(data);
      }
    }
  }

  const dnssecValidated =
    sawAnswer && !sawUnsignedAnswer;

  // Does the live data carry our published intent?
  const drift = [];
  for (const want of expected) {
    const fqdn = `${want.name}.${DOMAIN}.`.toLowerCase();
    const live = records.find(
      (r) =>
        `${r.name}.`.toLowerCase() === fqdn &&
        r.type === want.type &&
        r.parsed &&
        r.parsed.svcPriority === want.svcPriority &&
        r.parsed.targetName.toLowerCase() === want.targetName.toLowerCase(),
    );
    if (!live) drift.push(`${want.type} ${want.name}`);
  }

  let status = 'fail';
  let message = 'DNS-AID well-known entrypoint records not found';
  if (serviceRecordCount === 0) {
    if (aliasRecordCount > 0) {
      message = 'only AliasMode records found — a ServiceMode record is required';
    }
  } else if (!dnssecValidated) {
    message = 'DNS-AID records found but answers are not DNSSEC-validated';
  } else if (drift.length > 0) {
    message = `DNS-AID live but missing expected record(s): ${drift.join(', ')}`;
  } else {
    status = 'pass';
    message = 'DNS-AID ServiceMode record(s) present and DNSSEC-validated';
  }

  return {
    status,
    message,
    serviceRecordCount,
    aliasRecordCount,
    txtIndexEntryCount: txtIndexEntries.length,
    txtIndexEntries,
    dnssecValidated,
    records,
    drift,
  };
}

// ---------------------------------------------------------------------------
// Live lookup (network — main only)
// ---------------------------------------------------------------------------

async function doh(name, type) {
  const q = `name=${encodeURIComponent(name)}&type=${type}&do=1`;
  let lastError;
  for (const base of RESOLVERS) {
    try {
      const res = await fetch(`${base}?${q}`, {
        headers: { Accept: 'application/dns-json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return {
        name,
        type,
        status: json.Status,
        ad: json.AD === true,
        answers: Array.isArray(json.Answer) ? json.Answer : [],
        resolver: base,
      };
    } catch (err) {
      lastError = err;
    }
  }
  return { name, type, error: String(lastError?.message ?? lastError) };
}

async function main() {
  const asJson = process.argv.includes('--json');
  const queries = [
    ...SCANNER_QUERIES,
    { name: DOMAIN, type: 'DS' },
  ];
  const results = await Promise.all(
    queries.map(({ name, type }) => doh(name, type)),
  );
  const ds = results.pop();
  const evaluation = evaluateScan(results);
  const out = {
    domain: DOMAIN,
    ...evaluation,
    dsPublished: (ds.answers ?? []).length > 0,
    queriesAttempted: SCANNER_QUERIES.map((q) => `${q.type} ${q.name}`),
  };

  if (asJson) {
    console.log(JSON.stringify(out, null, 2));
  } else {
    console.log(`DNS-AID verification for ${DOMAIN}`);
    for (const r of results) {
      const mark =
        (r.answers ?? []).length > 0 ? '✓' : r.error ? '✗' : '○';
      const extra = r.error
        ? `resolver error: ${r.error}`
        : `${(r.answers ?? []).length} answer(s), AD=${r.ad}`;
      console.log(`  ${mark} ${r.type} ${r.name} — ${extra}`);
    }
    console.log(`  serviceRecordCount=${out.serviceRecordCount} ` +
      `aliasRecordCount=${out.aliasRecordCount} ` +
      `txtIndexEntryCount=${out.txtIndexEntryCount}`);
    console.log(`  dnssecValidated=${out.dnssecValidated} dsPublished=${out.dsPublished}`);
    console.log(`${out.status === 'pass' ? '✓' : '✗'} ${out.message}`);
  }
  process.exit(out.status === 'pass' ? 0 : 1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
