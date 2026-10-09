// Unit tests for the DNS-AID artifact set — run with `npm test`
// (Node's built-in runner, no network access required).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

import {
  DNS_AID_RECORDS,
  SCANNER_QUERIES,
  WELL_KNOWN_PATH,
  DOMAIN,
  renderZone,
} from '../scripts/dns-aid-records.mjs';
import {
  RR_TYPE,
  parseSvcbRdata,
  isValidServiceRecord,
  evaluateScan,
} from '../scripts/verify-dns-aid.mjs';

// ---------------------------------------------------------------------------
// Record-set integrity (mutation-sensitive: a wrong record breaks these)
// ---------------------------------------------------------------------------

test('record set publishes only the organization index SVCB record', () => {
  assert.equal(DNS_AID_RECORDS.length, 1);
  const r = DNS_AID_RECORDS[0];
  assert.equal(r.name, '_index._agents');
  assert.equal(r.type, 'SVCB');
  assert.ok(r.svcPriority >= 1, 'must be ServiceMode (priority > 0)');
  assert.equal(r.targetName, `${DOMAIN}.`);
});

test('record set follows the draft: no underscore in TargetName', () => {
  for (const r of DNS_AID_RECORDS) {
    assert.ok(
      !r.targetName.includes('_'),
      `TargetName ${r.targetName} must not contain underscores`,
    );
  }
});

test('record set carries alpn and port connection parameters', () => {
  const params = DNS_AID_RECORDS[0].svcParams;
  assert.match(params, /alpn="[^"]+"/);
  assert.match(params, /port=443/);
  assert.match(params, /mandatory=alpn,port/);
});

test('well-known SvcParam uses the interim private-use key and a real file', () => {
  const params = DNS_AID_RECORDS[0].svcParams;
  assert.match(params, /key65409="[^"]+"/);
  assert.match(params, new RegExp(`key65409="${WELL_KNOWN_PATH}"`));
  assert.ok(
    existsSync(`public/.well-known/${WELL_KNOWN_PATH}`),
    `public/.well-known/${WELL_KNOWN_PATH} must exist — the record points at it`,
  );
});

test('committed zone file stays in sync with the record set', () => {
  const zone = readFileSync('dns/askmilo.pro.zone', 'utf8');
  assert.equal(zone, renderZone());
});

test('scanner query list covers SVCB, HTTPS and TXT on the _agents labels', () => {
  const names = SCANNER_QUERIES.map((q) => `${q.type} ${q.name}`);
  for (const label of ['_index._agents', '_a2a._agents', '_mcp._agents']) {
    for (const type of ['SVCB', 'HTTPS']) {
      assert.ok(
        names.includes(`${type} ${label}.${DOMAIN}`),
        `missing ${type} ${label}.${DOMAIN}`,
      );
    }
  }
  assert.ok(names.includes(`TXT _index._agents.${DOMAIN}`));
});

// ---------------------------------------------------------------------------
// parseSvcbRdata
// ---------------------------------------------------------------------------

test('parseSvcbRdata parses the presentation form', () => {
  const parsed = parseSvcbRdata(
    '1 askmilo.pro. alpn="h2,h3" port=443 mandatory=alpn,port key65409="ai-catalog.json"',
  );
  assert.equal(parsed.svcPriority, 1);
  assert.equal(parsed.targetName, 'askmilo.pro.');
  assert.equal(parsed.params.alpn, '"h2,h3"');
  assert.equal(parsed.params.port, '443');
  assert.equal(parsed.params.mandatory, 'alpn,port');
  assert.equal(parsed.params.key65409, '"ai-catalog.json"');
});

test('parseSvcbRdata parses the RFC 3597 wire form', () => {
  // priority 1, target askmilo.pro., alpn=h2, port=443 — pre-encoded wire RDATA
  const wire =
    '\\# 28 00010761736B6D696C6F0370726F00000100030268320003000201BB';
  const parsed = parseSvcbRdata(wire);
  assert.equal(parsed.svcPriority, 1);
  assert.equal(parsed.targetName, 'askmilo.pro.');
  assert.equal(parsed.params.alpn, '"h2"');
  assert.equal(parsed.params.port, '443');
});

test('parseSvcbRdata rejects empty and malformed data', () => {
  assert.equal(parseSvcbRdata(''), null);
  assert.equal(parseSvcbRdata(null), null);
  assert.equal(parseSvcbRdata('not a record'), null);
  assert.equal(parseSvcbRdata('\\# 02 00'), null);
});

// ---------------------------------------------------------------------------
// isValidServiceRecord / evaluateScan
// ---------------------------------------------------------------------------

test('isValidServiceRecord enforces ServiceMode and a cert-usable target', () => {
  assert.equal(isValidServiceRecord({ svcPriority: 1, targetName: 'askmilo.pro.' }), true);
  assert.equal(isValidServiceRecord({ svcPriority: 0, targetName: 'askmilo.pro.' }), false);
  assert.equal(isValidServiceRecord({ svcPriority: 1, targetName: '_bad.example.' }), false);
  assert.equal(isValidServiceRecord(null), false);
});

function svcbAttempt({ ad, data, name = `_index._agents.${DOMAIN}` }) {
  return {
    name,
    type: 'SVCB',
    ad,
    answers: [{ name, type: RR_TYPE.SVCB, data }],
  };
}

test('evaluateScan passes on a ServiceMode record with AD-set answers', () => {
  const result = evaluateScan([
    svcbAttempt({ ad: true, data: '1 askmilo.pro. alpn="h2,h3" port=443' }),
  ]);
  assert.equal(result.status, 'pass');
  assert.equal(result.serviceRecordCount, 1);
  assert.equal(result.dnssecValidated, true);
});

test('evaluateScan fails when every _agents name is NXDOMAIN', () => {
  const result = evaluateScan([
    { name: `_index._agents.${DOMAIN}`, type: 'SVCB', ad: false, answers: [] },
    { name: `_index._agents.${DOMAIN}`, type: 'HTTPS', ad: false, answers: [] },
  ]);
  assert.equal(result.status, 'fail');
  assert.equal(result.serviceRecordCount, 0);
  assert.equal(result.dnssecValidated, false);
});

test('evaluateScan fails on unsigned answers even with a ServiceMode record', () => {
  const result = evaluateScan([
    svcbAttempt({ ad: false, data: '1 askmilo.pro. alpn="h2" port=443' }),
  ]);
  assert.equal(result.status, 'fail');
  assert.equal(result.dnssecValidated, false);
  assert.match(result.message, /not DNSSEC-validated/);
});

test('evaluateScan does not count AliasMode records as service records', () => {
  const result = evaluateScan([
    svcbAttempt({ ad: true, data: '0 askmilo.pro.' }),
  ]);
  assert.equal(result.status, 'fail');
  assert.equal(result.aliasRecordCount, 1);
  assert.equal(result.serviceRecordCount, 0);
});

test('evaluateScan reports drift when the live record is not the published one', () => {
  const result = evaluateScan([
    svcbAttempt({ ad: true, data: '1 other.example.com. alpn="h2" port=443' }),
  ]);
  assert.equal(result.status, 'fail');
  assert.deepEqual(result.drift, ['SVCB _index._agents']);
});

test('evaluateScan counts TXT index entries separately', () => {
  const result = evaluateScan([
    svcbAttempt({ ad: true, data: '1 askmilo.pro. alpn="h2" port=443' }),
    {
      name: `_index._agents.${DOMAIN}`,
      type: 'TXT',
      ad: true,
      answers: [
        { name: `_index._agents.${DOMAIN}`, type: RR_TYPE.TXT, data: '"agent:https"' },
      ],
    },
  ]);
  assert.equal(result.status, 'pass');
  assert.equal(result.txtIndexEntryCount, 1);
});
