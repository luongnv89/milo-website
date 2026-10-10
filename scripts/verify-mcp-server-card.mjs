// Verify the live MCP Server Card on https://askmilo.pro/ — the same fetch
// the isitagentready scanner runs for checks.discovery.mcpServerCard (GET
// /.well-known/mcp/server-card.json, then a pass when the response is a 200
// JSON document carrying the Server Card fields the implementation guide
// requires: serverInfo with name and version, a transport endpoint URL, and
// capabilities — per the SEP-1649 draft schema).
//
// Usage:
//   node scripts/verify-mcp-server-card.mjs              # report, exit 1 on fail
//   node scripts/verify-mcp-server-card.mjs --json       # machine-readable result
//   node scripts/verify-mcp-server-card.mjs --url <url>  # check a different URL
//
// Pure functions are exported for tests (tests/mcp-server-card.test.mjs);
// network only happens in main().

import { pathToFileURL } from 'node:url';

import { MCP_SERVER_CARD_PATH, MCP_SERVER_CARD_URL } from './mcp-server-card.mjs';

// Fields the guide names on the card itself (SEP-1649 draft required set).
const REQUIRED_CARD_STRINGS = ['$schema', 'version', 'protocolVersion'];
const REQUIRED_SERVER_INFO_STRINGS = ['name', 'version'];
const REQUIRED_TRANSPORT_STRINGS = ['type', 'endpoint'];

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

// Structural validation of a parsed card against the guide + SEP-1649 draft
// schema. Returns { ok, problems[] } — every problem is a human-readable
// clause the scanner's verdict message can surface verbatim.
export function validateServerCard(card) {
  const problems = [];
  if (typeof card !== 'object' || card === null || Array.isArray(card)) {
    return { ok: false, problems: ['document is not a JSON object'] };
  }

  for (const field of REQUIRED_CARD_STRINGS) {
    if (!isNonEmptyString(card[field])) {
      problems.push(`missing or empty required field "${field}"`);
    }
  }

  if (typeof card.serverInfo !== 'object' || card.serverInfo === null) {
    problems.push('missing required field "serverInfo"');
  } else {
    for (const field of REQUIRED_SERVER_INFO_STRINGS) {
      if (!isNonEmptyString(card.serverInfo[field])) {
        problems.push(`serverInfo.${field} is missing or empty`);
      }
    }
  }

  if (typeof card.transport !== 'object' || card.transport === null) {
    problems.push('missing required field "transport"');
  } else {
    for (const field of REQUIRED_TRANSPORT_STRINGS) {
      if (!isNonEmptyString(card.transport[field])) {
        problems.push(`transport.${field} is missing or empty`);
      }
    }
  }

  if (typeof card.capabilities !== 'object' || card.capabilities === null) {
    problems.push('missing required field "capabilities"');
  } else if (
    !card.capabilities.tools &&
    !card.capabilities.resources &&
    !card.capabilities.prompts
  ) {
    problems.push(
      'capabilities declares none of tools, resources or prompts',
    );
  }

  if (card.tools !== undefined) {
    if (!Array.isArray(card.tools) || card.tools.length === 0) {
      problems.push('"tools" is present but not a non-empty array');
    } else {
      card.tools.forEach((tool, i) => {
        const at = `tools[${i}]`;
        if (typeof tool !== 'object' || tool === null) {
          problems.push(`${at} is not an object`);
          return;
        }
        if (!isNonEmptyString(tool.name)) {
          problems.push(`${at}.name is missing or empty`);
        }
      });
    }
  }

  return { ok: problems.length === 0, problems };
}

// Evaluate the fetch the scanner makes. `ok`/`status` are the HTTP verdict;
// the card passes only on 2xx + parseable JSON + the required fields above.
export function evaluateServerCardResponse({ ok, status, contentType, body } = {}) {
  const evidence = {
    httpStatus: status ?? null,
    contentType: contentType ?? null,
  };

  if (!ok) {
    return {
      status: 'fail',
      message: `MCP Server Card not served — HTTP ${status ?? 'no response'}`,
      evidence,
    };
  }

  let card;
  try {
    card = JSON.parse(body ?? '');
  } catch {
    return {
      status: 'fail',
      message: 'MCP Server Card is not valid JSON',
      evidence,
    };
  }

  const { ok: valid, problems } = validateServerCard(card);
  if (!valid) {
    return {
      status: 'fail',
      message: `MCP Server Card is invalid: ${problems.join('; ')}`,
      evidence,
    };
  }

  return {
    status: 'pass',
    message: `serves a valid MCP Server Card (${card.serverInfo.name} v${card.serverInfo.version})`,
    evidence,
  };
}

// ---------------------------------------------------------------------------
// Live fetch (network — main only)
// ---------------------------------------------------------------------------

async function probe(url) {
  const res = await fetch(url, { method: 'GET', redirect: 'follow' });
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
  const url = urlFlag !== -1 ? argv[urlFlag + 1] : MCP_SERVER_CARD_URL;
  if (!url) {
    console.error('✗ --url requires a value');
    process.exit(1);
  }

  let result;
  try {
    result = evaluateServerCardResponse(await probe(url));
  } catch (err) {
    console.error(`✗ GET ${url} failed: ${err.message}`);
    process.exit(1);
  }

  const out = { url, ...result };
  if (asJson) {
    console.log(JSON.stringify(out, null, 2));
  } else {
    console.log(`MCP Server Card verification for ${url}`);
    console.log(
      `  GET ${MCP_SERVER_CARD_PATH} → ` +
        `${out.evidence.contentType ?? 'no content-type'} (HTTP ${out.evidence.httpStatus})`,
    );
    console.log(`${out.status === 'pass' ? '✓' : '✗'} ${out.message}`);
  }
  process.exit(out.status === 'pass' ? 0 : 1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
