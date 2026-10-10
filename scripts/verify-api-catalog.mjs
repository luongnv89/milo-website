// Verify the live RFC 9727 API catalog on https://askmilo.pro/ — the same
// fetch the isitagentready scanner runs for checks.discovery.apiCatalog (GET
// /.well-known/api-catalog with Accept: application/linkset+json,
// application/json), then a pass when the response is 200, carries the
// linkset+json Content-Type, and the body is a linkset document whose entries
// carry an anchor plus service-desc/service-doc links (RFC 9727 §4.2,
// Appendix A.1; the implementation guide's required set).
//
// Usage:
//   node scripts/verify-api-catalog.mjs              # report, exit 1 on fail
//   node scripts/verify-api-catalog.mjs --json       # machine-readable result
//   node scripts/verify-api-catalog.mjs --url <url>  # check a different URL
//
// Pure functions are exported for tests (tests/api-catalog.test.mjs); network
// only happens in main().

import { pathToFileURL } from 'node:url';

import {
  API_CATALOG_PATH,
  API_CATALOG_URL,
  LINKSET_MEDIA_TYPE,
  REQUIRED_ENTRY_RELS,
} from './api-catalog.mjs';

// The Accept header the isitagentready scanner sends on the probe — replaying
// it verbatim keeps the verifier honest.
export const SCANNER_ACCEPT = 'application/linkset+json, application/json';

// Relation types a catalog entry may carry (RFC 9727 §3.1, RFC 8631) — used
// to spot-check link objects beneath whichever relations are present.
const KNOWN_ENTRY_RELS = [...REQUIRED_ENTRY_RELS, 'service-meta', 'status', 'item'];

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isAbsoluteHttpUrl(value) {
  if (!isNonEmptyString(value)) return false;
  try {
    const u = new URL(value);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

// Structural validation of a parsed catalog against the guide + RFC 9727.
// Returns { ok, problems[] } — every problem is a human-readable clause the
// scanner's verdict message can surface verbatim.
export function validateApiCatalog(doc) {
  const problems = [];
  if (typeof doc !== 'object' || doc === null || Array.isArray(doc)) {
    return { ok: false, problems: ['document is not a JSON object'] };
  }

  if (!Array.isArray(doc.linkset) || doc.linkset.length === 0) {
    problems.push('missing or empty required field "linkset"');
    return { ok: false, problems };
  }

  doc.linkset.forEach((entry, i) => {
    const at = `linkset[${i}]`;
    if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
      problems.push(`${at} is not an object`);
      return;
    }
    if (!isAbsoluteHttpUrl(entry.anchor)) {
      problems.push(`${at}.anchor is not an absolute HTTP(S) URL`);
    }
    for (const rel of REQUIRED_ENTRY_RELS) {
      if (!Array.isArray(entry[rel]) || entry[rel].length === 0) {
        problems.push(`${at} is missing required relation "${rel}"`);
      }
    }
    for (const rel of KNOWN_ENTRY_RELS) {
      if (entry[rel] === undefined) continue;
      if (!Array.isArray(entry[rel])) {
        problems.push(`${at}.${rel} is not an array`);
        continue;
      }
      entry[rel].forEach((link, j) => {
        if (typeof link !== 'object' || link === null || !isAbsoluteHttpUrl(link.href)) {
          problems.push(`${at}.${rel}[${j}].href is not an absolute HTTP(S) URL`);
        }
      });
    }
  });

  return { ok: problems.length === 0, problems };
}

// The media type a Content-Type header must carry — parameters such as
// profile= or charset are ignored for the match.
export function isLinksetContentType(contentType) {
  return (
    isNonEmptyString(contentType) &&
    contentType.split(';')[0].trim().toLowerCase() === LINKSET_MEDIA_TYPE
  );
}

// Evaluate the fetch the scanner makes. `ok`/`status` are the HTTP verdict;
// the catalog passes only on 2xx + linkset+json Content-Type + parseable
// linkset document with the required shape.
export function evaluateApiCatalogResponse({ ok, status, contentType, body } = {}) {
  const evidence = {
    httpStatus: status ?? null,
    contentType: contentType ?? null,
  };

  if (!ok) {
    return {
      status: 'fail',
      message: `API Catalog not served — HTTP ${status ?? 'no response'}`,
      evidence,
    };
  }

  if (!isLinksetContentType(contentType)) {
    return {
      status: 'fail',
      message:
        `API Catalog served with wrong Content-Type ` +
        `(${contentType ?? 'none'} — expected ${LINKSET_MEDIA_TYPE})`,
      evidence,
    };
  }

  let doc;
  try {
    doc = JSON.parse(body ?? '');
  } catch {
    return {
      status: 'fail',
      message: 'API Catalog is not valid JSON',
      evidence,
    };
  }

  const { ok: valid, problems } = validateApiCatalog(doc);
  if (!valid) {
    return {
      status: 'fail',
      message: `API Catalog is invalid: ${problems.join('; ')}`,
      evidence,
    };
  }

  return {
    status: 'pass',
    message: `serves a valid RFC 9727 API catalog (${doc.linkset.length} linkset entries)`,
    evidence,
  };
}

// ---------------------------------------------------------------------------
// Live fetch (network — main only)
// ---------------------------------------------------------------------------

async function probe(url) {
  const res = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
    headers: { Accept: SCANNER_ACCEPT },
  });
  return {
    ok: res.ok,
    status: res.status,
    contentType: res.headers.get('content-type'),
    body: await res.text(),
  };
}

async function main() {
  const argv = process.argv.slice(2);
  const asJson = argv.includes('--json');
  const urlFlag = argv.indexOf('--url');
  const url = urlFlag !== -1 ? argv[urlFlag + 1] : API_CATALOG_URL;
  if (!url) {
    console.error('✗ --url requires a value');
    process.exit(1);
  }

  let result;
  try {
    result = evaluateApiCatalogResponse(await probe(url));
  } catch (err) {
    console.error(`✗ GET ${url} failed: ${err.message}`);
    process.exit(1);
  }

  const out = { url, ...result };
  if (asJson) {
    console.log(JSON.stringify(out, null, 2));
  } else {
    console.log(`API catalog verification for ${url}`);
    console.log(
      `  GET ${API_CATALOG_PATH} → ` +
        `${out.evidence.contentType ?? 'no content-type'} (HTTP ${out.evidence.httpStatus})`,
    );
    console.log(`${out.status === 'pass' ? '✓' : '✗'} ${out.message}`);
  }
  process.exit(out.status === 'pass' ? 0 : 1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
