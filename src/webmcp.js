/**
 * WebMCP — exposes a few read-only site actions to AI agents in the browser
 * through `navigator.modelContext.registerTool()`.
 *
 * Spec: https://webmachinelearning.github.io/webmcp/
 *
 * Every tool answers from data already rendered on the page (src/data/content.js),
 * so what an agent reads always matches what a visitor sees. There is no server,
 * account or purchase flow behind these tools; the App Store tool only returns
 * the public listing URL.
 *
 * Client-only: imported from main.jsx, never from App.jsx, so the SSR/prerender
 * build never touches `navigator` or `document`. Browsers without WebMCP skip
 * registration entirely.
 */
import {
  APP_STORE_URL,
  PRIMARY_CTA_LABEL,
  faqItems,
  featureCards,
  heroContent,
  modelsSection,
  pricing,
  providers,
} from './data/content.js';

const SITE_URL = 'https://askmilo.pro/';

// Section ids rendered by the landing page (see src/components/*Section.jsx).
export const SECTION_IDS = [
  'problem',
  'how',
  'features',
  'screens',
  'models',
  'comparison',
  'story',
  'pricing',
  'faq',
  'feedback',
];

const NO_INPUT = { type: 'object', properties: {}, additionalProperties: false };

// MCP-style tool result: one text block carrying JSON.
function textResult(data) {
  return { content: [{ type: 'text', text: JSON.stringify(data) }] };
}

function pricingData() {
  return {
    price: pricing.price,
    model: pricing.title,
    priceLine: pricing.priceLine,
    includes: [...pricing.features],
    finePrint: pricing.finePrint,
  };
}

function downloadData() {
  return {
    label: PRIMARY_CTA_LABEL,
    url: APP_STORE_URL,
    requirements: heroContent.eyebrow,
  };
}

/**
 * Build the WebMCP tool definitions. Pure apart from `scroll_to_section`,
 * which needs a document at execute time; pass one in for tests.
 */
export function buildTools({ doc = typeof document !== 'undefined' ? document : undefined } = {}) {
  return [
    {
      name: 'get_milo_overview',
      title: 'MILO overview',
      description:
        'Summarize MILO, the iOS app that lets Siri route hands-free voice questions to GPT, Claude, Gemini and other AI models: what it does, where it runs, key features and price.',
      inputSchema: NO_INPUT,
      annotations: { readOnlyHint: true },
      execute: async () =>
        textResult({
          name: 'MILO',
          website: SITE_URL,
          headline: heroContent.headline,
          summary: heroContent.subhead,
          platform: heroContent.eyebrow,
          features: featureCards.map(({ title, description }) => ({ title, description })),
          pricing: pricingData(),
          download: downloadData(),
        }),
    },
    {
      name: 'get_pricing',
      title: 'MILO pricing',
      description:
        'Get MILO pricing: the one-time App Store price, what the purchase includes, and how AI provider usage is billed.',
      inputSchema: NO_INPUT,
      annotations: { readOnlyHint: true },
      execute: async () => textResult(pricingData()),
    },
    {
      name: 'list_ai_providers',
      title: 'Supported AI providers',
      description:
        'List the AI providers and models MILO can route Siri questions to, with a short note on each.',
      inputSchema: NO_INPUT,
      annotations: { readOnlyHint: true },
      execute: async () =>
        textResult({
          summary: modelsSection.lead,
          providers: providers.map(({ id, title, bullets }) => ({
            id,
            name: title,
            highlights: [...bullets],
          })),
        }),
    },
    {
      name: 'search_faq',
      title: 'Search the MILO FAQ',
      description:
        'Return MILO FAQ entries (question and answer). Pass a query to keep only entries whose question or answer contains it; omit it to get every entry.',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Optional case-insensitive text to look for, e.g. "privacy" or "API key".',
          },
        },
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: async (input = {}) => {
        const query = typeof input?.query === 'string' ? input.query.trim().toLowerCase() : '';
        const items = faqItems
          .filter(
            ({ question, answer }) =>
              !query ||
              question.toLowerCase().includes(query) ||
              answer.toLowerCase().includes(query),
          )
          .map(({ question, answer }) => ({ question, answer }));
        return textResult({ query: query || null, count: items.length, items });
      },
    },
    {
      name: 'get_download_link',
      title: 'MILO App Store link',
      description:
        'Get the App Store link to download MILO, plus device requirements. Returns the URL only; it does not open it or start a purchase.',
      inputSchema: NO_INPUT,
      annotations: { readOnlyHint: true },
      execute: async () => textResult(downloadData()),
    },
    {
      name: 'scroll_to_section',
      title: 'Go to a page section',
      description:
        'Scroll the askmilo.pro landing page to one of its sections so the visitor can see it.',
      inputSchema: {
        type: 'object',
        properties: {
          section: {
            type: 'string',
            enum: SECTION_IDS,
            description:
              'Section id: problem, how (how it works), features, screens (screenshots), models, comparison, story (founder story), pricing, faq, or feedback.',
          },
        },
        required: ['section'],
        additionalProperties: false,
      },
      execute: async (input = {}) => {
        const section = input?.section;
        if (!SECTION_IDS.includes(section)) {
          throw new Error(`Unknown section "${section}". Use one of: ${SECTION_IDS.join(', ')}.`);
        }
        const el = doc?.getElementById(section);
        if (!el) throw new Error(`Section "${section}" is not on this page.`);
        const reduceMotion =
          typeof window !== 'undefined' &&
          window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        return textResult({ scrolledTo: section });
      },
    },
  ];
}

/** The browser's WebMCP context, or undefined when the API is unavailable. */
export function getModelContext(
  nav = typeof navigator !== 'undefined' ? navigator : undefined,
  doc = typeof document !== 'undefined' ? document : undefined,
) {
  const ctx = nav?.modelContext ?? doc?.modelContext;
  return typeof ctx?.registerTool === 'function' ? ctx : undefined;
}

/**
 * Register every tool on the page's WebMCP context. Returns the AbortController
 * whose `abort()` unregisters them, or null when WebMCP is unavailable.
 */
export function registerWebMcpTools({ modelContext = getModelContext(), doc } = {}) {
  if (!modelContext) return null;
  const controller = new AbortController();
  const warn = (err) => console.warn('WebMCP tool registration failed', err);
  for (const tool of buildTools(doc ? { doc } : undefined)) {
    try {
      // The current spec returns a Promise; earlier implementations return undefined.
      Promise.resolve(modelContext.registerTool(tool, { signal: controller.signal })).catch(warn);
    } catch (err) {
      warn(err);
    }
  }
  return controller;
}
