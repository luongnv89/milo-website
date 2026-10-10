// Unit tests for the Markdown-negotiation artifact set — run with `npm test`
// (Node's built-in runner, no network access required).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  BROWSER_ACCEPT,
  DOMAIN,
  HOME_URL,
  MARKDOWN_MEDIA_TYPE,
  HTML_MEDIA_TYPE,
  SCANNER_ACCEPT,
  SETTING_ID,
  SETTING_VALUE,
  TOKENS_HEADER,
  renderSettingPayload,
} from '../scripts/markdown-negotiation.mjs';
import {
  evaluateHtmlLeg,
  evaluateMarkdownLeg,
  evaluateNegotiation,
  looksMarkdown,
} from '../scripts/verify-markdown-negotiation.mjs';

// ---------------------------------------------------------------------------
// Canonical config integrity
// ---------------------------------------------------------------------------

test('scanner Accept replay is the exact header the check sends', () => {
  // From the scanner source (rendering/markdown-negotiation.ts):
  // accept: 'text/markdown, text/html;q=0.8, */*;q=0.5'
  assert.equal(SCANNER_ACCEPT, 'text/markdown, text/html;q=0.8, */*;q=0.5');
  assert.ok(SCANNER_ACCEPT.includes(MARKDOWN_MEDIA_TYPE));
});

test('browser Accept control header does not ask for markdown', () => {
  assert.ok(!BROWSER_ACCEPT.includes(MARKDOWN_MEDIA_TYPE));
  assert.ok(BROWSER_ACCEPT.includes(HTML_MEDIA_TYPE));
});

test('zone setting targets Cloudflare content_converter → on', () => {
  assert.equal(SETTING_ID, 'content_converter');
  assert.equal(SETTING_VALUE, 'on');
  assert.deepEqual(renderSettingPayload(), { value: 'on' });
});

test('home URL is the production homepage the scanner probes', () => {
  assert.equal(HOME_URL, `https://${DOMAIN}/`);
  assert.equal(DOMAIN, 'askmilo.pro');
});

// ---------------------------------------------------------------------------
// looksMarkdown — the scanner's predicate
// ---------------------------------------------------------------------------

test('looksMarkdown accepts text/markdown regardless of body', () => {
  assert.equal(looksMarkdown('text/markdown; charset=utf-8', '# Hi'), true);
  assert.equal(looksMarkdown('text/markdown'), true);
  assert.equal(looksMarkdown('Text/Markdown; charset=utf-8'), true);
});

test('looksMarkdown accepts text/plain only with a non-HTML body', () => {
  assert.equal(looksMarkdown('text/plain; charset=utf-8', '# Title\n\nbody'), true);
  assert.equal(looksMarkdown('text/plain', '   plain text'), true);
  // HTML served as text/plain must not count — the scanner guards on '<'.
  assert.equal(looksMarkdown('text/plain', '<!DOCTYPE html><html>'), false);
  assert.equal(looksMarkdown('text/plain', '  <div>x</div>'), false);
});

test('looksMarkdown rejects HTML and unrelated content types', () => {
  assert.equal(looksMarkdown('text/html; charset=utf-8', '<html>'), false);
  assert.equal(looksMarkdown('application/json', '{}'), false);
  assert.equal(looksMarkdown('', '# md'), false);
  assert.equal(looksMarkdown(null, '# md'), false);
  assert.equal(looksMarkdown(undefined), false);
});

// ---------------------------------------------------------------------------
// evaluateMarkdownLeg — the scanner-shaped verdict
// ---------------------------------------------------------------------------

test('evaluateMarkdownLeg passes on a Markdown for Agents response', () => {
  const result = evaluateMarkdownLeg({
    ok: true,
    status: 200,
    contentType: 'text/markdown; charset=utf-8',
    vary: 'accept',
    tokensHeader: '725',
    body: '---\ntitle: MILO\n---\n\n# MILO',
  });
  assert.equal(result.status, 'pass');
  assert.equal(result.evidence.varyAccept, true);
  assert.equal(result.evidence[TOKENS_HEADER], '725');
});

test('evaluateMarkdownLeg fails when the response stays HTML', () => {
  const result = evaluateMarkdownLeg({
    ok: true,
    status: 200,
    contentType: 'text/html; charset=utf-8',
    body: '<!DOCTYPE html><html>…',
  });
  assert.equal(result.status, 'fail');
  assert.match(result.message, /no Markdown negotiation/);
});

test('evaluateMarkdownLeg fails on non-ok responses even if markdown', () => {
  const result = evaluateMarkdownLeg({
    ok: false,
    status: 404,
    contentType: 'text/markdown',
    body: '# not found',
  });
  assert.equal(result.status, 'fail');
  assert.equal(result.evidence.httpStatus, 404);
});

test('evaluateMarkdownLeg records absent tokens header as null evidence', () => {
  const result = evaluateMarkdownLeg({
    ok: true,
    status: 200,
    contentType: 'text/markdown',
  });
  assert.equal(result.status, 'pass');
  assert.equal(result.evidence[TOKENS_HEADER], null);
  assert.equal(result.evidence.varyAccept, false);
});

// ---------------------------------------------------------------------------
// evaluateHtmlLeg — the guide's "HTML remains the default" requirement
// ---------------------------------------------------------------------------

test('evaluateHtmlLeg passes on a normal HTML response', () => {
  const result = evaluateHtmlLeg({
    ok: true,
    status: 200,
    contentType: 'text/html; charset=utf-8',
  });
  assert.equal(result.status, 'pass');
});

test('evaluateHtmlLeg fails when default representation is not HTML', () => {
  for (const contentType of ['text/markdown', 'text/plain', null]) {
    const result = evaluateHtmlLeg({ ok: true, status: 200, contentType });
    assert.equal(result.status, 'fail', `contentType=${contentType}`);
  }
  const notOk = evaluateHtmlLeg({
    ok: false,
    status: 500,
    contentType: 'text/html',
  });
  assert.equal(notOk.status, 'fail');
});

// ---------------------------------------------------------------------------
// evaluateNegotiation — the issue's bar: both legs must pass
// ---------------------------------------------------------------------------

test('evaluateNegotiation passes only when both legs pass', () => {
  const mdPass = evaluateMarkdownLeg({
    ok: true,
    status: 200,
    contentType: 'text/markdown',
  });
  const htmlPass = evaluateHtmlLeg({
    ok: true,
    status: 200,
    contentType: 'text/html',
  });
  const out = evaluateNegotiation(mdPass, htmlPass);
  assert.equal(out.status, 'pass');
});

test('evaluateNegotiation fails when markdown leg fails', () => {
  const mdFail = evaluateMarkdownLeg({
    ok: true,
    status: 200,
    contentType: 'text/html',
  });
  const htmlPass = evaluateHtmlLeg({
    ok: true,
    status: 200,
    contentType: 'text/html',
  });
  const out = evaluateNegotiation(mdFail, htmlPass);
  assert.equal(out.status, 'fail');
  assert.match(out.message, /markdown leg:/);
});

test('evaluateNegotiation fails when the default leg fails', () => {
  const mdPass = evaluateMarkdownLeg({
    ok: true,
    status: 200,
    contentType: 'text/markdown',
  });
  const htmlFail = evaluateHtmlLeg({
    ok: true,
    status: 200,
    contentType: 'text/markdown',
  });
  const out = evaluateNegotiation(mdPass, htmlFail);
  assert.equal(out.status, 'fail');
  assert.match(out.message, /default leg:/);
});

// ---------------------------------------------------------------------------
// Wiring — scripts and runbook stay reachable
// ---------------------------------------------------------------------------

test('package.json exposes publish and verify scripts', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  assert.equal(
    pkg.scripts['markdown-negotiation:publish'],
    'node scripts/publish-markdown-negotiation.mjs',
  );
  assert.equal(
    pkg.scripts['markdown-negotiation:verify'],
    'node scripts/verify-markdown-negotiation.mjs',
  );
});

test('runbook documents the guide, the setting and the plan requirement', () => {
  const doc = readFileSync('docs/markdown-negotiation.md', 'utf8');
  assert.ok(doc.includes('markdown-negotiation/SKILL.md'));
  assert.ok(doc.includes(SETTING_ID));
  assert.ok(doc.includes('Pro or Business'));
  assert.ok(doc.includes('markdown-negotiation:verify'));
});
