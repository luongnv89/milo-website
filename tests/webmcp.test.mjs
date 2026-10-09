// Unit tests for src/webmcp.js — run with `npm test` (Node's built-in runner).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

import {
  SECTION_IDS,
  buildTools,
  getModelContext,
  registerWebMcpTools,
} from '../src/webmcp.js';
import { APP_STORE_URL, faqItems, providers } from '../src/data/content.js';

const EXPECTED = [
  'get_milo_overview',
  'get_pricing',
  'list_ai_providers',
  'search_faq',
  'get_download_link',
  'scroll_to_section',
];

function fakeModelContext() {
  const calls = [];
  return {
    calls,
    registerTool(tool, options) {
      calls.push({ tool, options });
      return Promise.resolve();
    },
  };
}

function parse(result) {
  // Results must survive structured serialization (no functions / React components).
  const roundTripped = JSON.parse(JSON.stringify(result));
  assert.deepEqual(roundTripped, result);
  assert.equal(result.content[0].type, 'text');
  return JSON.parse(result.content[0].text);
}

test('every tool is well-formed', () => {
  const tools = buildTools();
  assert.deepEqual(tools.map((t) => t.name), EXPECTED);
  for (const tool of tools) {
    assert.match(tool.name, /^[a-z_]+$/);
    assert.ok(tool.description.length > 20, `${tool.name} needs a description`);
    assert.equal(tool.inputSchema.type, 'object');
    assert.equal(typeof tool.execute, 'function');
  }
});

test('data tools are read-only and return serializable page data', async () => {
  const tools = Object.fromEntries(buildTools().map((t) => [t.name, t]));
  for (const name of EXPECTED.filter((n) => n !== 'scroll_to_section')) {
    assert.equal(tools[name].annotations?.readOnlyHint, true, name);
    parse(await tools[name].execute({}));
  }

  const overview = parse(await tools.get_milo_overview.execute({}));
  assert.equal(overview.name, 'MILO');
  assert.equal(overview.download.url, APP_STORE_URL);
  assert.ok(overview.features.every((f) => !('icon' in f)));

  const providerList = parse(await tools.list_ai_providers.execute({}));
  assert.deepEqual(
    providerList.providers.map((p) => p.id),
    providers.map((p) => p.id),
  );

  assert.equal(parse(await tools.get_download_link.execute({})).url, APP_STORE_URL);
  assert.ok(parse(await tools.get_pricing.execute({})).price);
});

test('search_faq filters case-insensitively and returns everything without a query', async () => {
  const tool = buildTools().find((t) => t.name === 'search_faq');
  assert.equal(parse(await tool.execute({})).count, faqItems.length);
  assert.equal(parse(await tool.execute(undefined)).count, faqItems.length);

  const hits = parse(await tool.execute({ query: '  PRIVATE ' }));
  assert.ok(hits.count > 0 && hits.count < faqItems.length);
  assert.ok(hits.items.every((i) => `${i.question} ${i.answer}`.toLowerCase().includes('private')));

  assert.equal(parse(await tool.execute({ query: 'zzz-no-such-thing' })).count, 0);
});

test('scroll_to_section scrolls to a known section and rejects others', async () => {
  const scrolled = [];
  const doc = {
    getElementById: (id) => (id === 'pricing' ? { scrollIntoView: (o) => scrolled.push(o) } : null),
  };
  const tool = buildTools({ doc }).find((t) => t.name === 'scroll_to_section');
  assert.equal(tool.annotations, undefined); // changes the view, so not read-only

  assert.deepEqual(parse(await tool.execute({ section: 'pricing' })), { scrolledTo: 'pricing' });
  assert.equal(scrolled.length, 1);
  await assert.rejects(tool.execute({ section: 'checkout' }), /Unknown section/);
  await assert.rejects(tool.execute({ section: 'faq' }), /not on this page/);
});

test('every advertised section id exists in the rendered components', () => {
  const dir = new URL('../src/components/', import.meta.url);
  const source = readdirSync(dir)
    .map((f) => readFileSync(new URL(f, dir), 'utf8'))
    .join('\n');
  for (const id of SECTION_IDS) {
    assert.ok(source.includes(`id="${id}"`), `no element with id="${id}"`);
  }
});

test('registers all tools with an abort signal when WebMCP exists', () => {
  const ctx = fakeModelContext();
  const controller = registerWebMcpTools({ modelContext: ctx });
  assert.deepEqual(ctx.calls.map((c) => c.tool.name), EXPECTED);
  assert.ok(ctx.calls.every((c) => c.options.signal === controller.signal));
  controller.abort();
  assert.ok(ctx.calls[0].options.signal.aborted);
});

test('does nothing when WebMCP is unavailable', () => {
  assert.equal(getModelContext(undefined, undefined), undefined);
  assert.equal(getModelContext({}, {}), undefined);
  assert.equal(getModelContext({ modelContext: {} }, undefined), undefined);
  assert.equal(registerWebMcpTools({ modelContext: undefined }), null);
});

test('prefers document.modelContext and falls back to navigator.modelContext', () => {
  const nav = fakeModelContext();
  const doc = fakeModelContext();
  assert.equal(getModelContext({ modelContext: nav }, { modelContext: doc }), doc);
  assert.equal(getModelContext({ modelContext: nav }, {}), nav);
  assert.equal(getModelContext({ modelContext: nav }, { modelContext: {} }), nav);
});

test('a throwing or rejecting registerTool never escapes', async () => {
  const warn = console.warn;
  const warnings = [];
  console.warn = (...args) => warnings.push(args);
  try {
    registerWebMcpTools({
      modelContext: {
        registerTool: () => {
          throw new Error('InvalidStateError');
        },
      },
    });
    registerWebMcpTools({ modelContext: { registerTool: () => Promise.reject(new Error('nope')) } });
    await new Promise((r) => setTimeout(r, 0));
  } finally {
    console.warn = warn;
  }
  assert.equal(warnings.length, EXPECTED.length * 2);
});
