// Canonical A2A Agent Card for https://askmilo.pro/ (A2A protocol §8,
// https://a2a-protocol.org/latest/specification/).
//
// Implements
// https://isitagentready.com/.well-known/agent-skills/a2a-agent-card/SKILL.md
//
// This module is the single source of truth:
//   - scripts/well-known.mjs        writes it to dist/.well-known/agent-card.json
//                                   (deployed by GitHub Pages on merge)
//   - scripts/verify-agent-card.mjs replays the scanner's GET and validates the
//                                   live card against the same shape
//
// Honesty constraint: the site is static — there is no A2A task endpoint, so
// `supportedInterfaces` declares the agent surface that actually exists: the
// read-only WebMCP tools registered by src/webmcp.js on the homepage. A2A
// §4.4.6 keeps `protocolBinding` an open-form string and §12.7 identifies
// custom bindings by URI, so the binding below is the WebMCP spec URL. No
// JSONRPC/GRPC/HTTP+JSON entry is claimed — §8.3.1 requires every declared
// interface to be one the URL genuinely serves.
import { readFileSync } from 'node:fs';

import { buildTools } from '../src/webmcp.js';

export const DOMAIN = 'askmilo.pro';
export const HOME_URL = `https://${DOMAIN}/`;
export const AGENT_CARD_PATH = '/.well-known/agent-card.json';
export const AGENT_CARD_URL = `${HOME_URL.slice(0, -1)}${AGENT_CARD_PATH}`;

// Custom-binding URI for the site's real agent interface (WebMCP tools in the
// browser — see src/webmcp.js). The core A2A bindings are exported for the
// negative test guard: claiming one would advertise an endpoint that 404s.
export const WEBMCP_PROTOCOL_BINDING =
  'https://webmachinelearning.github.io/webmcp/';
export const A2A_CORE_BINDINGS = ['JSONRPC', 'GRPC', 'HTTP+JSON'];

// A2A version declared on the interface — the card itself is written against
// A2A 1.x schema (`supportedInterfaces`/`protocolBinding` shape).
export const A2A_PROTOCOL_VERSION = '1.0';

const pkg = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
);

// Extra discovery metadata the WebMCP tool schema does not carry (AgentSkill
// requires `tags`; `examples` show agents what to ask). Keyed by tool name so
// a tool without metadata turns the sync test red instead of silently
// shipping an untagged skill.
export const TOOL_SKILL_META = {
  get_milo_overview: {
    tags: ['overview', 'product', 'ios'],
    examples: ['What is MILO?', 'What does the MILO iOS app do?'],
  },
  get_pricing: {
    tags: ['pricing', 'purchase'],
    examples: ['How much does MILO cost?', 'Is MILO a subscription?'],
  },
  list_ai_providers: {
    tags: ['providers', 'models', 'api-keys'],
    examples: [
      'Which AI providers does MILO support?',
      'Does MILO work with Claude?',
    ],
  },
  search_faq: {
    tags: ['faq', 'support', 'search'],
    examples: [
      'Does MILO see my prompts?',
      'What iOS version does MILO need?',
    ],
  },
  get_download_link: {
    tags: ['download', 'app-store', 'ios'],
    examples: ['Where do I download MILO?'],
  },
  scroll_to_section: {
    tags: ['navigation', 'site'],
    examples: ['Take me to the pricing section'],
  },
};

// The published how-to skill (advertised in the agentskills.io index) is also
// an agent-facing capability: an agent can follow it to set MILO up for the
// user. Its description is read from the SKILL.md frontmatter — the same
// source well-known.mjs digests — so the card and the index can not drift.
const SKILL_DOC_PATH =
  '../public/.well-known/agent-skills/milo-hands-free-ai-via-siri/SKILL.md';

function skillDocDescription() {
  const skill = readFileSync(new URL(SKILL_DOC_PATH, import.meta.url), 'utf8');
  const frontmatter = skill.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const description = frontmatter?.[1]
    .match(/^description:\s*(.+)$/m)?.[1]
    .trim();
  if (!description) {
    throw new Error(`agent-card: no frontmatter description in ${SKILL_DOC_PATH}`);
  }
  return description;
}

export const DOC_SKILLS = [
  {
    id: 'milo-hands-free-ai-via-siri',
    name: 'MILO hands-free AI via Siri',
    description: skillDocDescription(),
    tags: ['ios', 'siri', 'voice', 'setup'],
    examples: [
      'How do I ask ChatGPT or Claude through Siri hands-free?',
      'Set up MILO with my OpenAI API key',
    ],
  },
];

// Build the AgentCard object (A2A spec §4.4.1). Required fields only the
// guide and schema name are populated; optional fields that would claim
// capabilities the static site lacks (securitySchemes, signatures) stay out.
export function buildAgentCard() {
  return {
    name: 'MILO',
    description:
      'MILO is the iOS app that lets Siri answer with frontier AI: say "Hey Siri, ask MILO" and the request is routed to the model the user chose — GPT, Claude, Gemini or 200+ others — hands-free on iPhone and CarPlay (iOS 17.6+). askmilo.pro exposes read-only product tools to browser agents through WebMCP; no interactive A2A endpoint is served.',
    supportedInterfaces: [
      {
        url: HOME_URL,
        protocolBinding: WEBMCP_PROTOCOL_BINDING,
        protocolVersion: A2A_PROTOCOL_VERSION,
      },
    ],
    provider: { organization: 'MILO', url: HOME_URL },
    version: pkg.version,
    documentationUrl: `${HOME_URL}llms.txt`,
    iconUrl: `${HOME_URL}apple-touch-icon.png`,
    capabilities: { streaming: false, pushNotifications: false },
    defaultInputModes: ['text/plain', 'application/json'],
    defaultOutputModes: ['text/plain', 'application/json'],
    skills: [
      ...buildTools().map((tool) => {
        const meta = TOOL_SKILL_META[tool.name];
        return {
          id: tool.name,
          name: tool.title,
          description: tool.description,
          tags: meta?.tags ?? [],
          ...(meta?.examples ? { examples: [...meta.examples] } : {}),
        };
      }),
      ...DOC_SKILLS.map((skill) => ({ ...skill })),
    ],
  };
}

// The card the build emits and the verifier's shape reference.
export const AGENT_CARD = buildAgentCard();
