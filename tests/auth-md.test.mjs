// Guard tests for /auth.md (#58) — run with `npm test` (Node's built-in
// runner, no network access required).
//
// Issue #58 asks for an auth.md at the site root per
// https://isitagentready.com/.well-known/agent-skills/auth-md/SKILL.md — the
// scanner's checks.discovery.authMd fetch is a bare GET /auth.md that fails
// on 404. The site has no OAuth authorization server, so the guide's
// self-contained clause governs: the document must name the agent audience,
// its registration/provisioning endpoint(s) (honestly: none exist), the
// supported method(s) and how credentials are used. These tests pin that
// shape plus the honesty guard — the doc must never advertise OAuth or
// agent_auth endpoints that would 404.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

import {
  AUTH_MD_PATH,
  AUTH_MD_URL,
  evaluateAuthMdResponse,
  validateAuthMdDocument,
} from '../scripts/verify-auth-md.mjs';

const AUTH_MD_FILE = 'public/auth.md';
const doc = readFileSync(AUTH_MD_FILE, 'utf8');
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

// ---------------------------------------------------------------------------
// Document shape — the guide's required surface
// ---------------------------------------------------------------------------

test('auth.md exists at the site root and is non-empty', () => {
  assert.ok(existsSync(AUTH_MD_FILE));
  assert.ok(doc.trim().length > 0);
});

test('auth.md H1 contains "auth.md" (the guide requirement)', () => {
  const h1 = doc.match(/^#[ \t]+(.+)$/m);
  assert.ok(h1, 'document has no H1');
  assert.match(h1[1], /auth\.md/);
});

test('committed document passes the verifier’s full shape check', () => {
  const { ok, problems } = validateAuthMdDocument(doc);
  assert.deepEqual(problems, []);
  assert.ok(ok);
});

test('document is self-contained: audience, endpoints, methods, credentials', () => {
  // The guide's no-OAuth fallback requires the doc to address each topic.
  assert.match(doc, /audience/i);
  assert.match(doc, /registr|provision/i);
  assert.match(doc, /method|anonymous|unauthenticated/i);
  assert.match(doc, /credential|api[- ]key|token/i);
});

// ---------------------------------------------------------------------------
// Honesty guards — no endpoint is advertised that the site does not serve
// ---------------------------------------------------------------------------

test('document advertises no fabricated OAuth/agent_auth endpoints', () => {
  // agent_auth's register_uri, OAuth AS/PRM endpoint URLs and registration
  // endpoints would all point agents at machinery this static site lacks —
  // the same honesty rule the agent-card tests apply to A2A bindings.
  for (const forbidden of [
    /register_uri/i,
    /registration_endpoint/i,
    /token_endpoint/i,
    /authorization_endpoint/i,
    /"agent_auth"/,
    /agent_auth["':]/i,
  ]) {
    assert.doesNotMatch(doc, forbidden);
  }
  // The doc may *discuss* the well-known OAuth paths (to say they are not
  // published) but must never present one as a served URL.
  assert.doesNotMatch(
    doc,
    /https?:\/\/\S*\.well-known\/oauth-authorization-server/i,
  );
  assert.doesNotMatch(
    doc,
    /https?:\/\/\S*\.well-known\/oauth-protected-resource/i,
  );
  assert.doesNotMatch(doc, /https?:\/\/\S*\.well-known\/openid-configuration/i);
});

test('document contains no secret-scan hazard strings', () => {
  // Slugged App Store URL shapes match the sk-* real-key scan.
  assert.doesNotMatch(doc, /sk-milo/);
});

// ---------------------------------------------------------------------------
// Wiring — the verifier and the probed URL
// ---------------------------------------------------------------------------

test('auth.md path and URL are the ones the scanner probes', () => {
  assert.equal(AUTH_MD_PATH, '/auth.md');
  assert.equal(AUTH_MD_URL, 'https://askmilo.pro/auth.md');
});

test('package.json exposes an auth-md:verify script', () => {
  assert.equal(
    pkg.scripts['auth-md:verify'],
    'node scripts/verify-auth-md.mjs',
  );
});

// ---------------------------------------------------------------------------
// Live-response evaluation — the verdict the verifier reports
// ---------------------------------------------------------------------------

test('evaluate passes a 200 response carrying the committed doc', () => {
  const res = evaluateAuthMdResponse({
    ok: true,
    status: 200,
    contentType: 'text/markdown; charset=utf-8',
    body: doc,
  });
  assert.equal(res.status, 'pass');
  assert.equal(res.evidence.httpStatus, 200);
});

test('evaluate still passes on a non-markdown Content-Type', () => {
  // The scanner's Accept includes text/plain and */* — the verdict keys on
  // the body, not the media type.
  const res = evaluateAuthMdResponse({
    ok: true,
    status: 200,
    contentType: 'text/plain; charset=utf-8',
    body: doc,
  });
  assert.equal(res.status, 'pass');
});

test('evaluate fails a 404 the way the scanner saw it', () => {
  const res = evaluateAuthMdResponse({
    ok: false,
    status: 404,
    contentType: 'text/html; charset=utf-8',
    body: '<html>not found</html>',
  });
  assert.equal(res.status, 'fail');
  assert.match(res.message, /404/);
});

test('evaluate fails when the H1 lacks auth.md', () => {
  const res = evaluateAuthMdResponse({
    ok: true,
    status: 200,
    contentType: 'text/markdown',
    body: '# Authentication\n\nSome auth notes for agents.\n',
  });
  assert.equal(res.status, 'fail');
  assert.match(res.message, /H1/);
});

test('evaluate fails on a doc that fabricates OAuth endpoints', () => {
  const fake = `${doc}\n\nregister_uri: https://askmilo.pro/agent/register\n`;
  const res = evaluateAuthMdResponse({
    ok: true,
    status: 200,
    contentType: 'text/markdown',
    body: fake,
  });
  assert.equal(res.status, 'fail');
  assert.match(res.message, /register_uri/);
});
