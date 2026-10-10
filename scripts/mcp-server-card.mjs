// Canonical MCP Server Card for https://askmilo.pro/ (SEP-1649 / SEP-2127,
// https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127).
//
// Implements
// https://isitagentready.com/.well-known/agent-skills/mcp-server-card/SKILL.md
//
// This module is the single source of truth:
//   - scripts/well-known.mjs            writes it to
//                                       dist/.well-known/mcp/server-card.json
//                                       (deployed by GitHub Pages on merge)
//   - scripts/verify-mcp-server-card.mjs replays the scanner's GET and validates
//                                       the live card against the same shape
//
// Honesty constraint: the site is static — there is no network MCP endpoint,
// so `transport` declares the agent surface that actually exists: the
// read-only WebMCP tools registered by src/webmcp.js on the homepage. The
// draft schema types `transport.type` as an open string ("streamable-http",
// "stdio", "sse" are examples), so the WebMCP spec URI is used as the binding
// identifier — the same URI the A2A Agent Card uses as its custom
// `protocolBinding` (scripts/agent-card.mjs). No `streamable-http`/`sse`/
// `stdio` type is claimed: advertising one would point agents at a JSON-RPC
// endpoint that 404s. Likewise `capabilities` and `tools` list only the
// WebMCP tools the page really registers — no resources or prompts exist.
import { readFileSync } from 'node:fs';

import { buildTools } from '../src/webmcp.js';

export const DOMAIN = 'askmilo.pro';
export const HOME_URL = `https://${DOMAIN}/`;
export const MCP_SERVER_CARD_PATH = '/.well-known/mcp/server-card.json';
export const MCP_SERVER_CARD_URL = `${HOME_URL.slice(0, -1)}${MCP_SERVER_CARD_PATH}`;

// Transport identifier for the site's real agent interface (WebMCP tools in
// the browser — see src/webmcp.js). The wire transports exported below are
// the negative test guard: claiming one would advertise an MCP endpoint the
// site does not serve.
export const WEBMCP_TRANSPORT_TYPE =
  'https://webmachinelearning.github.io/webmcp/';
export const MCP_WIRE_TRANSPORTS = ['streamable-http', 'sse', 'stdio'];

// MCP protocol version the WebMCP tool shapes follow: tool descriptors and
// `{content: [{type: 'text', ...}]}` results conform to MCP 2025-06-18 data
// types (the WebMCP spec maps tools onto MCP primitives). It describes the
// shape of the tool surface, not a wire endpoint.
export const MCP_PROTOCOL_VERSION = '2025-06-18';

// Card document format version named by the SEP-1649 draft schema.
export const SERVER_CARD_VERSION = '1.0';
export const SERVER_CARD_SCHEMA =
  'https://static.modelcontextprotocol.io/schemas/mcp-server-card/v1.json';

const pkg = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
);

// Build the Server Card object (SEP-1649 draft schema — the shape the
// implementation guide prescribes: serverInfo, transport.endpoint and
// capabilities). Optional fields that would claim machinery the static site
// lacks (requires, resources, prompts) stay out; `authentication` is declared
// explicitly because nothing here needs a credential.
export function buildServerCard() {
  return {
    $schema: SERVER_CARD_SCHEMA,
    version: SERVER_CARD_VERSION,
    protocolVersion: MCP_PROTOCOL_VERSION,
    serverInfo: {
      name: 'askmilo-pro-webmcp',
      title: 'MILO — askmilo.pro WebMCP tools',
      version: pkg.version,
    },
    description:
      'Read-only MILO product tools exposed to in-browser agents via WebMCP on the askmilo.pro landing page.',
    iconUrl: `${HOME_URL}apple-touch-icon.png`,
    documentationUrl: `${HOME_URL}llms.txt`,
    transport: {
      type: WEBMCP_TRANSPORT_TYPE,
      endpoint: HOME_URL,
    },
    capabilities: {
      tools: { listChanged: false },
    },
    authentication: { required: false, schemes: [] },
    instructions:
      'Open https://askmilo.pro/ in a browser with WebMCP support; the page registers these tools on navigator.modelContext. There is no network MCP endpoint — the tools run in-page against content already rendered for visitors.',
    tools: buildTools().map((tool) => ({
      name: tool.name,
      title: tool.title,
      description: tool.description,
      inputSchema: tool.inputSchema,
    })),
  };
}

// The card the build emits and the verifier's shape reference.
export const MCP_SERVER_CARD = buildServerCard();
