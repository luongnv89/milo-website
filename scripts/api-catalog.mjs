// Canonical RFC 9727 API catalog for https://askmilo.pro/
//
// Implements
// https://isitagentready.com/.well-known/agent-skills/api-catalog/SKILL.md
//
// This module is the single source of truth:
//   - scripts/well-known.mjs           writes it to dist/.well-known/api-catalog
//                                      (deployed by GitHub Pages on merge)
//   - scripts/publish-api-catalog.mjs  upserts the Cloudflare transform rule
//                                      that answers the right Content-Type
//   - scripts/verify-api-catalog.mjs   replays the scanner's GET and validates
//                                      the live document against the same shape
//
// Honesty constraint: askmilo.pro is a static site — it publishes no HTTP API
// endpoints, no OpenAPI spec and no health endpoint. The one agent-facing API
// surface that genuinely exists is the read-only WebMCP tool set registered on
// the homepage (src/webmcp.js), anchored at the origin. Every link below points
// at a document the site actually serves; `status` is omitted because there is
// no status/health endpoint to point at (RFC 9727 marks it optional).

export const DOMAIN = 'askmilo.pro';
export const ORIGIN = `https://${DOMAIN}`;
export const HOME_URL = `${ORIGIN}/`;

// The well-known URI the scanner probes — GET /.well-known/api-catalog with
// Accept: application/linkset+json, application/json.
export const API_CATALOG_PATH = '/.well-known/api-catalog';
export const API_CATALOG_URL = `${ORIGIN}${API_CATALOG_PATH}`;

// The media type the catalog MUST be served as (RFC 9727 §4.2), and the
// profile parameter the RFC RECOMMENDS on the Content-Type header.
export const LINKSET_MEDIA_TYPE = 'application/linkset+json';
export const LINKSET_PROFILE = 'https://www.rfc-editor.org/info/rfc9727';
export const CONTENT_TYPE_VALUE =
  `${LINKSET_MEDIA_TYPE}; profile="${LINKSET_PROFILE}"`;

// Link relation types the catalog uses (RFC 9727 §3.1, RFC 8631).
export const CATALOG_RELS = [
  'service-desc',
  'service-doc',
  'service-meta',
];

// Relation types the guide requires on every linkset entry. `status` (a health
// endpoint) is optional and honestly absent — the static site has none.
export const REQUIRED_ENTRY_RELS = ['service-desc', 'service-doc'];

// The linkset document (RFC 9264 §4.2 serialization, RFC 9727 Appendix A.1
// shape): one link-context object per published API. The single entry is the
// WebMCP tool surface — anchored at the homepage where document.modelContext
// registers the tools — described by the documents the site already publishes.
export function buildApiCatalog() {
  return {
    linkset: [
      {
        anchor: HOME_URL,
        'service-desc': [
          {
            href: `${ORIGIN}/.well-known/agent-card.json`,
            type: 'application/json',
          },
          {
            href: `${ORIGIN}/.well-known/agent-skills/milo-hands-free-ai-via-siri/SKILL.md`,
            type: 'text/markdown',
          },
        ],
        'service-doc': [
          { href: `${ORIGIN}/llms.txt`, type: 'text/plain' },
          { href: `${ORIGIN}/llms-full.txt`, type: 'text/plain' },
        ],
        'service-meta': [
          {
            href: `${ORIGIN}/.well-known/agent-skills/index.json`,
            type: 'application/json',
          },
          {
            href: `${ORIGIN}/.well-known/ai-catalog.json`,
            type: 'application/json',
          },
        ],
      },
    ],
  };
}

// The document the build emits and the verifier's shape reference.
export const API_CATALOG = buildApiCatalog();

// ---------------------------------------------------------------------------
// Content-Type gap — GitHub Pages cannot serve application/linkset+json
// ---------------------------------------------------------------------------
//
// The well-known URI has no file extension, and GitHub Pages answers
// extensionless paths as application/octet-stream — never the media type the
// RFC requires. The site is fronted by a Cloudflare proxy, so the correct
// Content-Type is attached at the zone edge by a response-header Transform
// Rule, the same mechanism scripts/publish-link-headers.mjs uses for the Link
// header (and the mechanism the link-headers runbook documents). The rule also
// sets the self-referential `Link: </.well-known/api-catalog>;
// rel="api-catalog"` header RFC 9727 §2 asks for on HEAD/GET responses.
//
// Both managed rules share the http_response_headers_transform phase; the
// distinct description prefix below keeps each publish script's "replace only
// my rules" logic from touching the other's.

// Cloudflare Ruleset Engine expression scoping the rule to the catalog only.
export const RULE_EXPRESSION =
  `(http.request.uri.path eq "${API_CATALOG_PATH}")`;

// Stable description prefix identifying rules this tool manages.
export const RULE_DESCRIPTION_PREFIX = 'api-catalog:';
export const RULE_DESCRIPTION =
  `${RULE_DESCRIPTION_PREFIX} RFC 9727 linkset Content-Type + self Link — ` +
  'managed by scripts/publish-api-catalog.mjs';

// The api-catalog link relation the response carries on itself (RFC 9727 §2 —
// a HEAD/GET on the well-known URI SHALL answer a Link header with this rel).
export const SELF_LINK_VALUE =
  `<${API_CATALOG_PATH}>; rel="api-catalog"; type="${LINKSET_MEDIA_TYPE}"`;

// Render the Cloudflare response-header transform rule that fixes the
// Content-Type (and adds the self-referential api-catalog Link) on the
// well-known path.
export function renderRule() {
  return {
    action: 'rewrite',
    action_parameters: {
      headers: {
        'Content-Type': {
          operation: 'set',
          value: CONTENT_TYPE_VALUE,
        },
        Link: {
          operation: 'set',
          value: SELF_LINK_VALUE,
        },
      },
    },
    expression: RULE_EXPRESSION,
    description: RULE_DESCRIPTION,
    enabled: true,
  };
}

// True when a fetched/existing transform rule is one this tool manages.
export function isManagedRule(rule) {
  return (
    typeof rule?.description === 'string' &&
    rule.description.startsWith(RULE_DESCRIPTION_PREFIX)
  );
}
