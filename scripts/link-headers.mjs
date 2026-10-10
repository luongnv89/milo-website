// Canonical Link response-header set for https://askmilo.pro/ (RFC 8288).
//
// Implements
// https://isitagentready.com/.well-known/agent-skills/link-headers/SKILL.md
//
// This module is the single source of truth:
//   - scripts/publish-link-headers.mjs writes exactly this header to the
//     Cloudflare zone's http_response_headers_transform ruleset
//   - scripts/verify-link-headers.mjs  compares live Link headers against it
//   - index.html <link rel="..."> tags    are the HTML serialization of the
//                                         same set (kept in sync — test-guarded)
//
// GitHub Pages cannot send custom response headers. The site is fronted by a
// Cloudflare proxy (live responses already carry `server: cloudflare` and
// `cf-ray`), so the header is attached at the zone edge by a response-header
// Transform Rule. Nothing here is served by the site build.

export const DOMAIN = 'askmilo.pro';
export const HOME_URL = `https://${DOMAIN}/`;

export const HEADER_NAME = 'Link';

// Relation types the guide recognizes (RFC 8288 / RFC 9727 §3 / RFC 8631):
// api-catalog — a catalog of the site's machine-readable resources
// service-desc — a machine-readable description of the service
// service-doc — documentation for the service
// describedby — a resource that describes the homepage itself
export const REGISTERED_RELS = [
  'api-catalog',
  'service-desc',
  'service-doc',
  'describedby',
];

// The Link targets to advertise. Only resources the site actually serves are
// listed — pointing agents at documents that do not exist is worse than no
// header. `path` is relative to the origin; `type` is the RFC 8288 target
// attribute hinting the media type.
export const LINK_TARGETS = [
  {
    path: '/.well-known/ai-catalog.json',
    rel: 'api-catalog',
    type: 'application/json',
    note: 'agent resource catalog (AIR index) — the site catalog the DNS-AID _index record also points at',
  },
  {
    path: '/.well-known/agent-skills/milo-hands-free-ai-via-siri/SKILL.md',
    rel: 'service-desc',
    type: 'text/markdown',
    note: 'machine-readable description of the MILO agent skill',
  },
  {
    path: '/llms-full.txt',
    rel: 'service-doc',
    type: 'text/plain',
    note: 'full product documentation written for LLM consumers',
  },
  {
    path: '/llms.txt',
    rel: 'describedby',
    type: 'text/plain',
    note: 'concise machine-readable description of the site (llms.txt)',
  },
];

// Cloudflare Ruleset Engine expression scoping the transform rule to the
// homepage document only — the guide asks for the header on the homepage,
// and /index.html serves the same document.
export const RULE_EXPRESSION =
  '(http.request.uri.path eq "/" or http.request.uri.path eq "/index.html")';

// Stable description prefix identifying rules this tool manages. The publish
// script replaces rules carrying this prefix and never touches others.
export const RULE_DESCRIPTION_PREFIX = 'link-headers:';
export const RULE_DESCRIPTION =
  `${RULE_DESCRIPTION_PREFIX} agent-discovery Link header (RFC 8288) — ` +
  'managed by scripts/publish-link-headers.mjs';

// Render one link-value: <target>; rel="..."; type="...".
export function renderLinkValue(target) {
  let value = `<${target.path}>; rel="${target.rel}"`;
  if (target.type) value += `; type="${target.type}"`;
  return value;
}

// Render the whole header value — one Link header field carrying the
// comma-separated link-values (RFC 8288 §3; the guide accepts either multiple
// Link headers or comma-separated values, and a single `set` operation is the
// only deterministic way to emit the whole set via a Transform Rule).
export function renderHeaderValue(targets = LINK_TARGETS) {
  return targets.map(renderLinkValue).join(', ');
}

// Render the Cloudflare response-header transform rule that attaches the
// header to the homepage response.
export function renderRule(targets = LINK_TARGETS) {
  return {
    action: 'rewrite',
    action_parameters: {
      headers: {
        [HEADER_NAME]: {
          operation: 'set',
          value: renderHeaderValue(targets),
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
