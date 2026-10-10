// Verify live Markdown content negotiation on https://askmilo.pro/ — the same
// fetch the isitagentready scanner runs for
// checks.contentAccessibility.markdownNegotiation (GET / with
// `Accept: text/markdown, text/html;q=0.8, */*;q=0.5`, then a pass when the
// response is ok and its Content-Type is text/markdown — or text/plain with
// a non-HTML body), evaluated against this issue's bar: Markdown is served
// on request AND HTML remains the default representation (the guide's
// second requirement), verified by a browser-Accept control fetch.
//
// Usage:
//   node scripts/verify-markdown-negotiation.mjs              # report, exit 1 on fail
//   node scripts/verify-markdown-negotiation.mjs --json       # machine-readable result
//   node scripts/verify-markdown-negotiation.mjs --url <url>  # check a different URL
//
// Pure functions are exported for tests (tests/markdown-negotiation.test.mjs);
// network only happens in main().

import { pathToFileURL } from 'node:url';

import {
  HOME_URL,
  SCANNER_ACCEPT,
  BROWSER_ACCEPT,
  MARKDOWN_MEDIA_TYPE,
  HTML_MEDIA_TYPE,
  TOKENS_HEADER,
} from './markdown-negotiation.mjs';

// ---------------------------------------------------------------------------
// Response evaluation — mirrors the scanner's looksMarkdown predicate:
// text/markdown always counts; text/plain counts only when the body does not
// start with '<' (i.e. is not HTML served with a plain content type).
// ---------------------------------------------------------------------------

export function looksMarkdown(contentType, body = '') {
  const ct = (contentType ?? '').toLowerCase();
  if (ct.includes(MARKDOWN_MEDIA_TYPE)) return true;
  if (ct.includes('text/plain') && !body.trimStart().startsWith('<')) {
    return true;
  }
  return false;
}

// Evaluate the markdown leg — the fetch the scanner makes. `ok` is the
// fetch-style 2xx flag; `status` the HTTP code; vary/tokensHeader are
// evidence the scanner records, never pass/fail inputs.
export function evaluateMarkdownLeg({ ok, status, contentType, vary, tokensHeader, body } = {}) {
  const served = Boolean(ok) && looksMarkdown(contentType, body);
  return {
    status: served ? 'pass' : 'fail',
    message: served
      ? 'serves Markdown via Accept negotiation'
      : 'no Markdown negotiation — response is not a Markdown representation',
    evidence: {
      httpStatus: status ?? null,
      contentType: contentType ?? null,
      varyAccept: (vary ?? '').toLowerCase().includes('accept'),
      [TOKENS_HEADER]: tokensHeader ?? null,
    },
  };
}

// Evaluate the control leg — a browser Accept must still get HTML, per the
// guide's "HTML remains the default for requests without the markdown
// accept header".
export function evaluateHtmlLeg({ ok, status, contentType } = {}) {
  const ct = (contentType ?? '').toLowerCase();
  const served = Boolean(ok) && ct.includes(HTML_MEDIA_TYPE);
  return {
    status: served ? 'pass' : 'fail',
    message: served
      ? 'HTML remains the default representation'
      : `default response is not HTML (Content-Type: ${contentType ?? 'none'}, HTTP ${status ?? '?'})`,
    evidence: {
      httpStatus: status ?? null,
      contentType: contentType ?? null,
    },
  };
}

// Overall verdict: the issue's bar holds only when both legs pass.
export function evaluateNegotiation(markdownLeg, htmlLeg) {
  const pass = markdownLeg.status === 'pass' && htmlLeg.status === 'pass';
  return {
    status: pass ? 'pass' : 'fail',
    message: pass
      ? 'Markdown negotiation live — Markdown on request, HTML by default'
      : [
          markdownLeg.status === 'fail' ? `markdown leg: ${markdownLeg.message}` : null,
          htmlLeg.status === 'fail' ? `default leg: ${htmlLeg.message}` : null,
        ]
          .filter(Boolean)
          .join('; '),
    markdownLeg,
    htmlLeg,
  };
}

// ---------------------------------------------------------------------------
// Live fetch (network — main only)
// ---------------------------------------------------------------------------

async function probe(url, accept) {
  const res = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
    headers: { Accept: accept },
  });
  return {
    ok: res.ok,
    status: res.status,
    contentType: res.headers.get('content-type'),
    vary: res.headers.get('vary'),
    tokensHeader: res.headers.get(TOKENS_HEADER),
    body: await res.text(),
  };
}

async function main() {
  const argv = process.argv.slice(2);
  const asJson = argv.includes('--json');
  const urlFlag = argv.indexOf('--url');
  const url = urlFlag !== -1 ? argv[urlFlag + 1] : HOME_URL;
  if (!url) {
    console.error('✗ --url requires a value');
    process.exit(1);
  }

  let markdownProbe, htmlProbe;
  try {
    markdownProbe = await probe(url, SCANNER_ACCEPT);
    htmlProbe = await probe(url, BROWSER_ACCEPT);
  } catch (err) {
    console.error(`✗ GET ${url} failed: ${err.message}`);
    process.exit(1);
  }

  const out = {
    url,
    ...evaluateNegotiation(
      evaluateMarkdownLeg(markdownProbe),
      evaluateHtmlLeg(htmlProbe),
    ),
  };

  if (asJson) {
    console.log(JSON.stringify(out, null, 2));
  } else {
    console.log(`Markdown-negotiation verification for ${url}`);
    const md = out.markdownLeg;
    console.log(
      `  ${md.status === 'pass' ? '✓' : '✗'} Accept: ${SCANNER_ACCEPT}` +
        ` → ${md.evidence.contentType ?? 'no content-type'} (HTTP ${md.evidence.httpStatus})`,
    );
    console.log(
      `      vary-accept=${md.evidence.varyAccept} ` +
        `${TOKENS_HEADER}=${md.evidence[TOKENS_HEADER] ?? 'absent'}`,
    );
    const hd = out.htmlLeg;
    console.log(
      `  ${hd.status === 'pass' ? '✓' : '✗'} browser Accept → ` +
        `${hd.evidence.contentType ?? 'no content-type'} (HTTP ${hd.evidence.httpStatus})`,
    );
    console.log(`${out.status === 'pass' ? '✓' : '✗'} ${out.message}`);
  }
  process.exit(out.status === 'pass' ? 0 : 1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
