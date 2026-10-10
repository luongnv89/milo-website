// Guard tests for the free-model/API-token resource guidance (#68) — run with
// `npm test` (Node's built-in runner, no network access required).
//
// Issue #68 asks for two community directories — free-llm-models.custats.info
// and freetokens.custats.info — to be linked from MILO's setup guidance with
// selection/key-creation/limits guidance, and for alternate documentation
// representations (support.html, llms.txt, llms-full.txt, the agent SKILL.md,
// and the WebMCP tools) to carry equivalent resource guidance.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { freeKeyResources } from '../src/data/content.js';
import { buildTools } from '../src/webmcp.js';

const MODELS_URL = 'https://free-llm-models.custats.info/';
const TOKENS_URL = 'https://freetokens.custats.info/';
const BOTH = [MODELS_URL, TOKENS_URL];

const modelsSectionSrc = readFileSync('src/components/ModelsSection.jsx', 'utf8');
const supportSrc = readFileSync('public/support.html', 'utf8');
const llmsSrc = readFileSync('public/llms.txt', 'utf8');
const llmsFullSrc = readFileSync('public/llms-full.txt', 'utf8');
const skillSrc = readFileSync(
  'public/.well-known/agent-skills/milo-hands-free-ai-via-siri/SKILL.md',
  'utf8',
);

// ---------------------------------------------------------------------------
// Content contract — the single source every surface renders or mirrors
// ---------------------------------------------------------------------------

test('freeKeyResources links exactly the two custats directories over https', () => {
  assert.equal(freeKeyResources.links.length, 2);
  for (const link of freeKeyResources.links) {
    assert.ok(link.href.startsWith('https://'), `${link.href} must be https`);
    assert.ok(link.label.length > 0 && link.description.length > 0);
  }
  assert.deepEqual(
    freeKeyResources.links.map((l) => l.href).sort(),
    [...BOTH].sort(),
  );
});

test('freeKeyResources carries selection, key-creation and limits guidance', () => {
  const text = `${freeKeyResources.title} ${freeKeyResources.lead} ${freeKeyResources.guidance}`;
  assert.match(text, /API key/i);
  assert.match(text, /Settings → API Keys/);
  assert.match(text, /limits/i);
  assert.match(text, /eligib/i);
  // AC3: never guarantee that every listed offer works or stays free.
  assert.match(text, /not every offer/i);
  assert.match(text, /may not stay free/i);
});

// ---------------------------------------------------------------------------
// Landing page — the Models section is the prominent setup-guidance surface
// ---------------------------------------------------------------------------

test('ModelsSection renders the freeKeyResources block', () => {
  assert.ok(modelsSectionSrc.includes('freeKeyResources'), 'ModelsSection must use freeKeyResources');
  assert.ok(modelsSectionSrc.includes('freeKeyResources.links.map'), 'link cards must render');
});

test('ModelsSection resource links open externally and are mobile-readable', () => {
  assert.match(modelsSectionSrc, /target="_blank"/);
  assert.match(modelsSectionSrc, /rel="noopener noreferrer"/);
  // Long domains must wrap on narrow screens.
  assert.match(modelsSectionSrc, /break-all/);
});

// ---------------------------------------------------------------------------
// Alternate documentation representations carry equivalent guidance
// ---------------------------------------------------------------------------

test('support.html links both directories under setup guidance', () => {
  for (const url of BOTH) {
    assert.ok(supportSrc.includes(`href="${url}"`), `support.html must link ${url}`);
  }
  assert.match(supportSrc, /limits/i);
  assert.match(supportSrc, /eligib/i);
  assert.match(supportSrc, /not every offer/i);
});

test('llms.txt and llms-full.txt carry both resource links and the caveat', () => {
  for (const src of [llmsSrc, llmsFullSrc]) {
    for (const url of BOTH) {
      assert.ok(src.includes(url), `llms doc must link ${url}`);
    }
    assert.match(src, /limits/i);
    assert.match(src, /eligib/i);
    assert.match(src, /not every (listed )?offer/i);
  }
});

test('agent SKILL.md carries the resources, the flow and the do-not-claim line', () => {
  for (const url of BOTH) {
    assert.ok(skillSrc.includes(url), `SKILL.md must link ${url}`);
  }
  assert.match(skillSrc, /Settings → API\s+Keys/);
  assert.match(skillSrc, /limits/i);
  assert.match(skillSrc, /eligib/i);
  assert.match(skillSrc, /not every offer works with MILO/i);
});

// ---------------------------------------------------------------------------
// WebMCP — what an agent reads matches what a visitor sees
// ---------------------------------------------------------------------------

test('list_ai_providers returns the same freeKeyResources the page renders', async () => {
  const tool = buildTools().find((t) => t.name === 'list_ai_providers');
  const result = await tool.execute({});
  const data = JSON.parse(JSON.parse(JSON.stringify(result)).content[0].text);
  assert.equal(data.freeKeyResources.title, freeKeyResources.title);
  assert.deepEqual(
    data.freeKeyResources.links.map((l) => l.url).sort(),
    [...BOTH].sort(),
  );
  assert.equal(data.freeKeyResources.guidance, freeKeyResources.guidance);
});
