// Canonical DNS-AID record set for askmilo.pro.
//
// Implements draft-mozleywilliams-dnsop-dnsaid-02 ("DNS for AI Discovery")
// following https://isitagentready.com/.well-known/agent-skills/dns-aid/SKILL.md
//
// This module is the single source of truth:
//   - scripts/publish-dns-aid.mjs writes exactly these records to Cloudflare DNS
//   - scripts/verify-dns-aid.mjs  compares live DNS answers against them
//   - dns/askmilo.pro.zone        is the rendered form (kept in sync — test-guarded)
//
// Records live at the DNS provider (Cloudflare), not in this repo; nothing here
// is served by the site build.

export const DOMAIN = 'askmilo.pro';
export const ZONE = `${DOMAIN}.`;

// Well-known URI (RFC 8615) of the organization agent index the _index record
// points at. The draft's `well-known` SvcParamKey has no IANA number yet, so it
// is carried in the RFC 9460 generic form keyNNNNN using the dns-aid-core
// interim private-use assignment (65400–65409; well-known = 65409).
export const WELL_KNOWN_PATH = 'ai-catalog.json';
export const INDEX_URL = `https://${DOMAIN}/.well-known/${WELL_KNOWN_PATH}`;

// Private-use SvcParamKey numbers used by dns-aid-core until IANA assigns the
// registered names (draft-02 §7.1). Do not invent new numbers.
export const SVC_PARAM_KEYS = {
  cap: 'key65400',
  'cap-sha256': 'key65401',
  bap: 'key65402',
  policy: 'key65403',
  realm: 'key65404',
  sig: 'key65405',
  'well-known': 'key65409',
};

// The DNS-AID records to publish. Only records for endpoints the site actually
// serves are listed: askmilo.pro is a static site, so the one honest record is
// the organization index pointer (draft-02 §3.2). Do NOT add _a2a._agents or
// _mcp._agents until a real A2A/MCP endpoint exists — advertising endpoints the
// domain does not offer is worse than no record.
export const DNS_AID_RECORDS = [
  {
    // Owner name relative to the zone apex.
    name: '_index._agents',
    type: 'SVCB',
    ttl: 3600,
    // ServiceMode: SvcPriority > 0. TargetName MUST NOT contain underscores
    // (draft-02 §3.2) — it is the TLS name the index is fetched from.
    svcPriority: 1,
    targetName: ZONE,
    svcParams:
      'alpn="h2,h3" port=443 ' +
      `mandatory=alpn,port ${SVC_PARAM_KEYS['well-known']}="${WELL_KNOWN_PATH}"`,
    comment:
      'Organization agent index -> ' + INDEX_URL +
      ' (well-known path carried as key65409, interim private-use key for ' +
      'the unregistered "well-known" SvcParamKey)',
  },
];

// Names the isitagentready scanner probes (from checks.discoverability.dnsAid
// details.queriesAttempted): SVCB + HTTPS + TXT on each label.
export const SCANNER_LABELS = ['_index._agents', '_a2a._agents', '_mcp._agents'];
export const SCANNER_TYPES = ['SVCB', 'HTTPS'];
export const SCANNER_TXT_LABEL = '_index._agents';

export const SCANNER_QUERIES = [
  ...SCANNER_LABELS.flatMap((label) =>
    SCANNER_TYPES.map((type) => ({ name: `${label}.${DOMAIN}`, type })),
  ),
  { name: `${SCANNER_TXT_LABEL}.${DOMAIN}`, type: 'TXT' },
];

// Render one record in master zone-file presentation form.
export function renderZoneLine(record, origin = ZONE) {
  const fqdn = `${record.name}.${origin}`;
  const params = record.svcParams ? ` ${record.svcParams}` : '';
  return `${fqdn} ${record.ttl} IN ${record.type} ${record.svcPriority} ${record.targetName}${params}`;
}

// Render the full record set as a zone-file fragment.
export function renderZone(origin = ZONE) {
  const lines = [
    '; -------------------------------------------------------------------',
    '; DNS-AID records for ' + origin,
    '; draft-mozleywilliams-dnsop-dnsaid-02 — DNS for AI Discovery',
    '; Apply at the DNS provider (Cloudflare). Do not load as a full zone.',
    '; -------------------------------------------------------------------',
  ];
  for (const record of DNS_AID_RECORDS) {
    if (record.comment) lines.push(`; ${record.comment}`);
    lines.push(renderZoneLine(record, origin));
  }
  return lines.join('\n') + '\n';
}
