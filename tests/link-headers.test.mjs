// Unit tests for the Link-header artifact set — run with `npm test`
// (Node's built-in runner, no network access required).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

import {
  DOMAIN,
  HEADER_NAME,
  LINK_TARGETS,
  REGISTERED_RELS,
  RULE_DESCRIPTION_PREFIX,
  RULE_EXPRESSION,
  isManagedRule,
  renderHeaderValue,
  renderLinkValue,
  renderRule,
} from '../scripts/link-headers.mjs';
import {
  evaluateLinkHeaders,
  parseLinkHeader,
  parseLinkValue,
  splitLinkValues,
} from '../scripts/verify-link-headers.mjs';

// ---------------------------------------------------------------------------
// Link-set integrity (mutation-sensitive: a wrong target breaks these)
// ---------------------------------------------------------------------------

test('link set uses only relation types the guide registers', () => {
  assert.ok(LINK_TARGETS.length >= 1);
  for (const t of LINK_TARGETS) {
    assert.ok(
      REGISTERED_RELS.includes(t.rel),
      `${t.rel} is not one of ${REGISTERED_RELS.join(', ')}`,
    );
  }
  // Cover the full registered set — the check looks for discovery rels.
  const rels = new Set(LINK_TARGETS.map((t) => t.rel));
  assert.deepEqual([...rels].sort(), [...REGISTERED_RELS].sort());
});

test('every link target is a resource the site actually serves', () => {
  for (const t of LINK_TARGETS) {
    assert.ok(t.path.startsWith('/'), `${t.path} must be a site-relative path`);
    assert.ok(
      existsSync(`public${t.path}`),
      `public${t.path} must exist — the header points agents at it`,
    );
  }
});

test('link set stays inside the askmilo.pro origin', () => {
  for (const t of LINK_TARGETS) {
    assert.ok(!t.path.includes('://'), 'targets are origin-relative paths');
  }
});

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

test('renderLinkValue emits RFC 8288 <target>; rel="..."; type="..."', () => {
  assert.equal(
    renderLinkValue(LINK_TARGETS[0]),
    '</.well-known/ai-catalog.json>; rel="api-catalog"; type="application/json"',
  );
});

test('renderHeaderValue comma-joins the set and round-trips the parser', () => {
  const value = renderHeaderValue();
  const links = parseLinkHeader(value);
  assert.equal(links.length, LINK_TARGETS.length);
  for (const [i, want] of LINK_TARGETS.entries()) {
    assert.equal(links[i].target, want.path);
    assert.deepEqual(links[i].rels, [want.rel]);
    assert.equal(links[i].params.type, want.type);
  }
});

test('renderRule emits a scoped response-header transform rule', () => {
  const rule = renderRule();
  assert.equal(rule.action, 'rewrite');
  assert.equal(rule.enabled, true);
  assert.equal(rule.expression, RULE_EXPRESSION);
  assert.ok(rule.expression.includes('http.request.uri.path eq "/"'));
  assert.ok(rule.description.startsWith(RULE_DESCRIPTION_PREFIX));
  const header = rule.action_parameters.headers[HEADER_NAME];
  assert.equal(header.operation, 'set');
  assert.equal(header.value, renderHeaderValue());
});

test('isManagedRule matches only the managed description prefix', () => {
  assert.equal(isManagedRule(renderRule()), true);
  assert.equal(isManagedRule({ description: 'someone else’s rule' }), false);
  assert.equal(isManagedRule({}), false);
  assert.equal(isManagedRule(null), false);
});

// ---------------------------------------------------------------------------
// index.html stays in sync with the header set (HTML serialization)
// ---------------------------------------------------------------------------

test('homepage head mirrors every link target as a <link> element', () => {
  const html = readFileSync('index.html', 'utf8');
  const head = html.split('</head>')[0];
  for (const t of LINK_TARGETS) {
    assert.match(
      head,
      new RegExp(
        `<link[^>]*rel="${t.rel}"[^>]*href="${t.path.replace(/[/.]/g, '\\$&')}"`,
      ),
      `index.html must carry <link rel="${t.rel}" href="${t.path}">`,
    );
  }
});

// ---------------------------------------------------------------------------
// splitLinkValues / parseLinkValue
// ---------------------------------------------------------------------------

test('splitLinkValues splits on top-level commas only', () => {
  assert.deepEqual(
    splitLinkValues('</a>; rel="describedby", </b>; rel="service-doc"'),
    ['</a>; rel="describedby"', '</b>; rel="service-doc"'],
  );
  // Commas inside < > or quotes never split.
  assert.deepEqual(
    splitLinkValues('</a?x=1,y=2>; rel="describedby", </b>; rel="x,y"'),
    ['</a?x=1,y=2>; rel="describedby"', '</b>; rel="x,y"'],
  );
});

test('parseLinkValue extracts target, params and space-separated rels', () => {
  const parsed = parseLinkValue(
    '</.well-known/ai-catalog.json>; rel="api-catalog"; type="application/json"',
  );
  assert.equal(parsed.target, '/.well-known/ai-catalog.json');
  assert.deepEqual(parsed.rels, ['api-catalog']);
  assert.equal(parsed.params.type, 'application/json');
});

test('parseLinkValue reads multi-rel values per RFC 8288', () => {
  const parsed = parseLinkValue('</x>; rel="describedby alternate"');
  assert.deepEqual(parsed.rels, ['describedby', 'alternate']);
});

test('parseLinkValue rejects values without a <target>', () => {
  assert.equal(parseLinkValue('rel="describedby"'), null);
  assert.equal(parseLinkValue(''), null);
});

test('parseLinkHeader returns [] on absent or empty input', () => {
  assert.deepEqual(parseLinkHeader(''), []);
  assert.deepEqual(parseLinkHeader(null), []);
  assert.deepEqual(parseLinkHeader(undefined), []);
});

// ---------------------------------------------------------------------------
// evaluateLinkHeaders — the scanner-shaped verdict
// ---------------------------------------------------------------------------

test('evaluateLinkHeaders passes on the canonical header value', () => {
  const result = evaluateLinkHeaders([renderHeaderValue()]);
  assert.equal(result.status, 'pass');
  assert.equal(result.registeredRelCount, LINK_TARGETS.length);
  assert.equal(result.drift.length, 0);
});

test('evaluateLinkHeaders fails when no Link header is present', () => {
  const result = evaluateLinkHeaders([]);
  assert.equal(result.status, 'fail');
  assert.equal(result.linkCount, 0);
  assert.match(result.message, /No Link headers/);
});

test('evaluateLinkHeaders fails on links without registered rels', () => {
  const result = evaluateLinkHeaders([
    '</style.css>; rel="stylesheet"',
  ]);
  assert.equal(result.status, 'fail');
  assert.equal(result.linkCount, 1);
  assert.equal(result.registeredRelCount, 0);
});

test('evaluateLinkHeaders reports drift when a target is missing', () => {
  const partial = renderHeaderValue(LINK_TARGETS.slice(1));
  const result = evaluateLinkHeaders([partial]);
  assert.equal(result.status, 'fail');
  assert.ok(result.drift.length > 0);
  assert.ok(
    result.drift.some(
      (d) => d === `${LINK_TARGETS[0].rel} ${LINK_TARGETS[0].path}`,
    ),
  );
});

test('evaluateLinkHeaders accepts repeated Link header lines', () => {
  const [first, ...rest] = LINK_TARGETS.map(renderLinkValue);
  const result = evaluateLinkHeaders([first, rest.join(', ')]);
  assert.equal(result.status, 'pass');
  assert.equal(result.linkCount, LINK_TARGETS.length);
});

test(`evaluateLinkHeaders matches absolute ${DOMAIN} targets too`, () => {
  const absolute = LINK_TARGETS.map(
    (t) => `<https://${DOMAIN}${t.path}>; rel="${t.rel}"`,
  ).join(', ');
  const result = evaluateLinkHeaders([absolute]);
  assert.equal(result.status, 'pass');
});
