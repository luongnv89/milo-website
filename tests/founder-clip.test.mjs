// Guard tests for the founder video/voice clip embed (#24) — run with `npm test`
// (Node's built-in runner, no network access required).
//
// The clip recording itself is a human action (see docs/founder-clip.md); these
// tests pin the activation contract on both sides of it:
//   - dormant today: FounderClip's gate keeps zero markup/requests in the page;
//   - on activation: a configured local URL must resolve to a real asset under
//     public/, and video must carry captions or a transcript.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

import { founderStory } from '../src/data/content.js';

const clipSrc = readFileSync('src/components/FounderClip.jsx', 'utf8');
const storySrc = readFileSync('src/components/FounderStory.jsx', 'utf8');

const CLIP_KEYS = [
  'videoUrl',
  'audioUrl',
  'videoPosterUrl',
  'videoCaptionsUrl',
  'clipTranscript',
  'clipLabel',
];

// ---------------------------------------------------------------------------
// Activation contract — FounderStory feeds FounderClip from founderStory
// ---------------------------------------------------------------------------

test('founderStory exposes every FounderClip field', () => {
  for (const key of CLIP_KEYS) {
    assert.ok(
      Object.hasOwn(founderStory, key),
      `founderStory.${key} is missing — the operator's edit point is undocumented`,
    );
    assert.ok(
      founderStory[key] === null || typeof founderStory[key] === 'string',
      `founderStory.${key} must be null or a string, got ${typeof founderStory[key]}`,
    );
  }
});

test('FounderStory wires every clip field into FounderClip', () => {
  const wiring = {
    videoUrl: 'videoUrl={founderStory.videoUrl}',
    audioUrl: 'audioUrl={founderStory.audioUrl}',
    posterUrl: 'posterUrl={founderStory.videoPosterUrl}',
    captionsUrl: 'captionsUrl={founderStory.videoCaptionsUrl}',
    transcript: 'transcript={founderStory.clipTranscript}',
    label: 'label={founderStory.clipLabel}',
  };
  for (const [prop, needle] of Object.entries(wiring)) {
    assert.ok(storySrc.includes(needle), `FounderStory no longer passes ${prop} to FounderClip`);
  }
});

// ---------------------------------------------------------------------------
// Embed invariants — the issue's perf + accessibility criteria, pinned
// ---------------------------------------------------------------------------

test('embed is gated — renders nothing until a clip URL exists', () => {
  assert.match(clipSrc, /if \(!videoUrl && !audioUrl\) return null;/);
});

test('clip is lazy — media does not download until the visitor plays it', () => {
  // Both the <video> and the <audio> element must opt out of preloading.
  const count = (clipSrc.match(/preload="none"/g) || []).length;
  assert.equal(count, 2, `expected preload="none" on video AND audio, found ${count}`);
});

test('clip is accessible — captions track, aria-label, dev warning', () => {
  assert.match(clipSrc, /<track\s+kind="captions"/);
  assert.match(clipSrc, /aria-label=/);
  // Dev-mode warning when a clip is configured with no accessible alternative.
  assert.match(clipSrc, /console\.warn/);
});

// ---------------------------------------------------------------------------
// Activation guards — run vacuously while dormant, enforce for real on drop-in
// ---------------------------------------------------------------------------

test('configured local clip assets exist under public/', () => {
  for (const key of ['videoUrl', 'audioUrl', 'videoPosterUrl', 'videoCaptionsUrl']) {
    const url = founderStory[key];
    if (url === null || url.startsWith('http')) continue; // external URLs unverifiable here
    assert.ok(url.startsWith('/'), `founderStory.${key} must be site-relative or absolute http(s)`);
    assert.ok(
      existsSync(`public${url}`),
      `founderStory.${key} is ${url} but public${url} does not exist — ` +
        'drop the asset in public/media/ first (docs/founder-clip.md)',
    );
  }
});

test('a configured video clip ships an accessible text alternative', () => {
  if (founderStory.videoUrl === null) return; // dormant — nothing to caption yet
  assert.ok(
    founderStory.videoCaptionsUrl !== null || founderStory.clipTranscript !== null,
    'videoUrl is set without videoCaptionsUrl or clipTranscript — ' +
      'the clip needs captions or a transcript (issue #24 accessibility criterion)',
  );
});

test('only one primary medium is configured', () => {
  assert.ok(
    !(founderStory.videoUrl !== null && founderStory.audioUrl !== null),
    'videoUrl and audioUrl are both set — FounderClip renders video and ignores audio',
  );
});

test('the media asset slot exists', () => {
  assert.ok(existsSync('public/media/README.md'), 'public/media/ asset slot is missing');
});
