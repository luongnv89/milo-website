// Verify the live /auth.md on https://askmilo.pro/ — the same fetch the
// isitagentready scanner runs for checks.discovery.authMd (GET /auth.md with
// Accept: text/markdown, text/plain, */*, then a pass when the response is a
// 200 Markdown document whose H1 contains "auth.md", per
// https://isitagentready.com/.well-known/agent-skills/auth-md/SKILL.md).
//
// The site has no OAuth authorization server (static read-only site — see
// docs/auth-md.md), so the guide's self-contained fallback applies and the
// verifier also checks the four things that clause requires the document to
// carry: the agent audience, registration/provisioning endpoint(s) — ours
// honestly documents that none exist — the supported method(s), and how
// credentials are used.
//
// Usage:
//   node scripts/verify-auth-md.mjs              # report, exit 1 on fail
//   node scripts/verify-auth-md.mjs --json       # machine-readable result
//   node scripts/verify-auth-md.mjs --url <url>  # check a different URL
//
// Pure functions are exported for tests (tests/auth-md.test.mjs); network
// only happens in main().

import { pathToFileURL } from 'node:url';

export const AUTH_MD_PATH = '/auth.md';
export const AUTH_MD_URL = `https://askmilo.pro${AUTH_MD_PATH}`;

// The guide: "an H1 heading that contains `auth.md`" (e.g. `# auth.md`).
const H1_AUTH_MD = /^#[ \t]+.*auth\.md/im;

// The guide's self-contained clause: when no OAuth metadata is available the
// document must still name its audience, its registration/provisioning
// endpoint(s) — an honest "none exist" counts — the supported method(s), and
// how credentials are used. Each matcher is deliberately loose: it checks
// the topic is addressed, not a fixed wording.
const SELF_CONTAINED_CHECKS = [
  { name: 'agent audience', pattern: /audience/i },
  {
    name: 'registration or provisioning endpoints',
    pattern: /registr|provision/i,
  },
  { name: 'supported method(s)', pattern: /method|anonymous|unauthenticated/i },
  { name: 'credential use', pattern: /credential|api[- ]key|token/i },
];

// Endpoint-declaration shapes that would fabricate machinery the static site
// does not have. A doc advertising one of these is claiming an OAuth/AS
// endpoint that does not exist — the same honesty rule the agent-card tests
// apply to A2A bindings.
const FABRICATED_ENDPOINT_PATTERNS = [
  { name: 'agent_auth block', pattern: /"agent_auth"|agent_auth["':]/i },
  { name: 'register_uri', pattern: /register_uri/i },
  { name: 'registration endpoint URL', pattern: /registration_endpoint/i },
  { name: 'token endpoint', pattern: /token_endpoint/i },
  {
    name: 'served oauth-authorization-server',
    pattern: /https?:\/\/\S*\.well-known\/oauth-authorization-server/i,
  },
];

// Structural validation of a served auth.md body against the guide.
// Returns { ok, problems[] } — every problem is a clause the scanner's
// verdict message can surface verbatim.
export function validateAuthMdDocument(body) {
  const problems = [];
  if (typeof body !== 'string' || body.trim().length === 0) {
    return { ok: false, problems: ['document is empty or not text'] };
  }
  if (!H1_AUTH_MD.test(body)) {
    problems.push('H1 heading does not contain "auth.md"');
  }
  for (const check of SELF_CONTAINED_CHECKS) {
    if (!check.pattern.test(body)) {
      problems.push(`document does not address ${check.name}`);
    }
  }
  for (const fabrication of FABRICATED_ENDPOINT_PATTERNS) {
    if (fabrication.pattern.test(body)) {
      problems.push(`document advertises a ${fabrication.name} that does not exist`);
    }
  }
  return { ok: problems.length === 0, problems };
}

// Evaluate the fetch the scanner makes: pass only on 2xx + a body that meets
// the guide's shape (H1 + self-contained sections + no invented endpoints).
export function evaluateAuthMdResponse({ ok, status, contentType, body } = {}) {
  const evidence = {
    httpStatus: status ?? null,
    contentType: contentType ?? null,
  };

  if (!ok) {
    return {
      status: 'fail',
      message: `auth.md not served — HTTP ${status ?? 'no response'}`,
      evidence,
    };
  }

  const { ok: valid, problems } = validateAuthMdDocument(body);
  if (!valid) {
    return {
      status: 'fail',
      message: `auth.md is invalid: ${problems.join('; ')}`,
      evidence,
    };
  }

  return {
    status: 'pass',
    message: 'serves a valid auth.md (self-contained: no OAuth server exists)',
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
    headers: { Accept: 'text/markdown, text/plain, */*' },
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
  const url = urlFlag !== -1 ? argv[urlFlag + 1] : AUTH_MD_URL;
  if (!url) {
    console.error('✗ --url requires a value');
    process.exit(1);
  }

  let result;
  try {
    result = evaluateAuthMdResponse(await probe(url));
  } catch (err) {
    console.error(`✗ GET ${url} failed: ${err.message}`);
    process.exit(1);
  }

  const out = { url, ...result };
  if (asJson) {
    console.log(JSON.stringify(out, null, 2));
  } else {
    console.log(`auth.md verification for ${url}`);
    console.log(
      `  GET ${AUTH_MD_PATH} → ` +
        `${out.evidence.contentType ?? 'no content-type'} (HTTP ${out.evidence.httpStatus})`,
    );
    console.log(`${out.status === 'pass' ? '✓' : '✗'} ${out.message}`);
  }
  process.exit(out.status === 'pass' ? 0 : 1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
