// Canonical Markdown content-negotiation config for https://askmilo.pro/
//
// Implements
// https://isitagentready.com/.well-known/agent-skills/markdown-negotiation/SKILL.md
//
// This module is the single source of truth:
//   - scripts/publish-markdown-negotiation.mjs PATCHes exactly this setting
//     onto the Cloudflare zone
//   - scripts/verify-markdown-negotiation.mjs probes the live site with
//     exactly this Accept header and evaluates the response
//   - docs/markdown-negotiation.md is the operator runbook
//
// GitHub Pages cannot do server-driven content negotiation — there is no
// server config it honors. The site is fronted by a Cloudflare proxy (live
// responses already carry `server: cloudflare` and `cf-ray`), so the
// negotiation is performed at the zone edge by Cloudflare's native
// "Markdown for Agents" feature — the guide's recommended mechanism for
// Cloudflare zones ("no application code changes needed"). Enabling it is a
// single zone setting (`content_converter`); once `on`, the edge converts
// HTML to Markdown on the fly whenever the request's Accept header includes
// text/markdown, answering `Content-Type: text/markdown; charset=utf-8`
// with an `x-markdown-tokens` count and `Vary: Accept`. Nothing here is
// served by the site build.

export const DOMAIN = 'askmilo.pro';
export const HOME_URL = `https://${DOMAIN}/`;

// The Accept header the isitagentready scanner sends for
// checks.contentAccessibility.markdownNegotiation (scanner source:
// packages/scanner/src/checks/rendering/markdown-negotiation.ts probes
// `accept: 'text/markdown, text/html;q=0.8, */*;q=0.5'`). Replaying it
// verbatim keeps the verifier honest — the live edge sees the same header
// the scanner sends.
export const SCANNER_ACCEPT = 'text/markdown, text/html;q=0.8, */*;q=0.5';

// A browser-shaped Accept header for the control leg — the guide requires
// that HTML remains the default representation for requests that do not
// ask for Markdown.
export const BROWSER_ACCEPT =
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8';

// The Cloudflare zone setting that turns Markdown for Agents on
// (PATCH /zones/{id}/settings/content_converter {"value": "on"} — Zone
// Settings edit permission; Pro or Business plan required).
export const SETTING_ID = 'content_converter';
export const SETTING_VALUE = 'on';

// The media type the check (and the guide) requires on negotiated responses.
export const MARKDOWN_MEDIA_TYPE = 'text/markdown';
// The media type that must remain the default representation.
export const HTML_MEDIA_TYPE = 'text/html';

// The guide's optional token-count header — evidence only, never required.
export const TOKENS_HEADER = 'x-markdown-tokens';

// Render the zone-settings payload the publish script PATCHes.
export function renderSettingPayload() {
  return { value: SETTING_VALUE };
}
