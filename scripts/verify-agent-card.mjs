// Verify the live A2A Agent Card on https://askmilo.pro/ — the same fetch the
// isitagentready scanner runs for checks.discovery.a2aAgentCard (GET
// /.well-known/agent-card.json, then a pass when the response is a 200 JSON
// document carrying the AgentCard fields the implementation guide requires:
// name, version, description, supportedInterfaces with URL and transport
// protocol, capabilities, and skills each with id/name/description).
//
// Usage:
//   node scripts/verify-agent-card.mjs              # report, exit 1 on fail
//   node scripts/verify-agent-card.mjs --json       # machine-readable result
//   node scripts/verify-agent-card.mjs --url <url>  # check a different URL
//
// Pure functions are exported for tests (tests/agent-card.test.mjs); network
// only happens in main().

import { pathToFileURL } from 'node:url';

import { AGENT_CARD_PATH, AGENT_CARD_URL } from './agent-card.mjs';

// Fields the guide names on the card itself (A2A spec §4.4.1 required set).
const REQUIRED_CARD_STRINGS = ['name', 'version', 'description'];
// Fields the guide requires on every skill (A2A spec §4.4.5 required set is
// id/name/description/tags — the guide omits tags but the spec requires it).
const REQUIRED_SKILL_FIELDS = ['id', 'name', 'description'];

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

// Structural validation of a parsed card against the guide + A2A schema.
// Returns { ok, problems[] } — every problem is a human-readable clause the
// scanner's verdict message can surface verbatim.
export function validateAgentCard(card) {
  const problems = [];
  if (typeof card !== 'object' || card === null || Array.isArray(card)) {
    return { ok: false, problems: ['document is not a JSON object'] };
  }

  for (const field of REQUIRED_CARD_STRINGS) {
    if (!isNonEmptyString(card[field])) {
      problems.push(`missing or empty required field "${field}"`);
    }
  }

  if (!Array.isArray(card.supportedInterfaces) || card.supportedInterfaces.length === 0) {
    problems.push('missing or empty required field "supportedInterfaces"');
  } else {
    card.supportedInterfaces.forEach((iface, i) => {
      const at = `supportedInterfaces[${i}]`;
      if (typeof iface !== 'object' || iface === null) {
        problems.push(`${at} is not an object`);
        return;
      }
      if (!isAbsoluteHttpUrl(iface.url)) {
        problems.push(`${at}.url is not an absolute HTTP(S) URL`);
      }
      if (!isNonEmptyString(iface.protocolBinding)) {
        problems.push(`${at}.protocolBinding is missing or empty`);
      }
      if (!isNonEmptyString(iface.protocolVersion)) {
        problems.push(`${at}.protocolVersion is missing or empty`);
      }
    });
  }

  if (typeof card.capabilities !== 'object' || card.capabilities === null) {
    problems.push('missing required field "capabilities"');
  }

  for (const field of ['defaultInputModes', 'defaultOutputModes']) {
    if (!Array.isArray(card[field]) || card[field].length === 0) {
      problems.push(`missing or empty required field "${field}"`);
    }
  }

  if (!Array.isArray(card.skills) || card.skills.length === 0) {
    problems.push('missing or empty required field "skills"');
  } else {
    card.skills.forEach((skill, i) => {
      const at = `skills[${i}]`;
      if (typeof skill !== 'object' || skill === null) {
        problems.push(`${at} is not an object`);
        return;
      }
      for (const field of REQUIRED_SKILL_FIELDS) {
        if (!isNonEmptyString(skill[field])) {
          problems.push(`${at}.${field} is missing or empty`);
        }
      }
      if (!Array.isArray(skill.tags) || skill.tags.length === 0) {
        problems.push(`${at}.tags is missing or empty`);
      }
    });
  }

  return { ok: problems.length === 0, problems };
}

// Evaluate the fetch the scanner makes. `ok`/`status` are the HTTP verdict;
// the card passes only on 2xx + parseable JSON + the required fields above.
export function evaluateAgentCardResponse({ ok, status, contentType, body } = {}) {
  const evidence = {
    httpStatus: status ?? null,
    contentType: contentType ?? null,
  };

  if (!ok) {
    return {
      status: 'fail',
      message: `A2A Agent Card not served — HTTP ${status ?? 'no response'}`,
      evidence,
    };
  }

  let card;
  try {
    card = JSON.parse(body ?? '');
  } catch {
    return {
      status: 'fail',
      message: 'A2A Agent Card is not valid JSON',
      evidence,
    };
  }

  const { ok: valid, problems } = validateAgentCard(card);
  if (!valid) {
    return {
      status: 'fail',
      message: `A2A Agent Card is invalid: ${problems.join('; ')}`,
      evidence,
    };
  }

  return {
    status: 'pass',
    message: `serves a valid A2A Agent Card (${card.name} v${card.version}, ${card.skills.length} skills)`,
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
  const url = urlFlag !== -1 ? argv[urlFlag + 1] : AGENT_CARD_URL;
  if (!url) {
    console.error('✗ --url requires a value');
    process.exit(1);
  }

  let result;
  try {
    result = evaluateAgentCardResponse(await probe(url));
  } catch (err) {
    console.error(`✗ GET ${url} failed: ${err.message}`);
    process.exit(1);
  }

  const out = { url, ...result };
  if (asJson) {
    console.log(JSON.stringify(out, null, 2));
  } else {
    console.log(`A2A Agent Card verification for ${url}`);
    console.log(
      `  GET ${AGENT_CARD_PATH} → ` +
        `${out.evidence.contentType ?? 'no content-type'} (HTTP ${out.evidence.httpStatus})`,
    );
    console.log(`${out.status === 'pass' ? '✓' : '✗'} ${out.message}`);
  }
  process.exit(out.status === 'pass' ? 0 : 1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
