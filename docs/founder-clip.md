# Founder clip — operator runbook

Issue: <https://github.com/luongnv89/milo-website/issues/24>

The founder story section can embed a short founder video or voice clip next to
the existing photo and personal note. The embed mechanism already shipped in
PR #31 — `src/components/FounderClip.jsx`, wired into `FounderStory.jsx`, gated,
accessible (`<track>` captions / transcript / `aria-label`) and lazy
(`preload="none"`, so the clip costs zero bytes until a visitor presses play).

This runbook is the one remaining step, and it is a human step on purpose:
the clip exists to make the founder section read as a **real person**, so it
must be a genuine recording of the founder. Never commit AI-generated, stock,
or fabricated media — `public/milo-promo-portrait-final.mp4` is a
Remotion-rendered promo, not a founder clip.

## 1. Record

- ~20–30 seconds, phone-recorded or Loom — authenticity beats production value.
- Suggested content: the "Hey Siri, ask MILO" flow in the car — say it, let
  MILO answer. It doubles as a product demo.
- Voice-only also satisfies the issue: record audio and ship `audioUrl`.

## 2. Export

| Asset | Filename | Notes |
|-------|----------|-------|
| Video | `founder-clip.mp4` | H.264 + AAC; keep it small (≤10 MB) |
| Voice-only | `founder-clip.m4a` | alternative to video, not additional |
| Captions | `founder-clip.vtt` | WebVTT — **required with video** (accessibility AC) |
| Poster frame | `founder-clip-poster.jpg` | optional; shown before playback |

## 3. Install

1. Copy the file(s) into `public/media/` (expected names above).
2. In `src/data/content.js`, under `founderStory`, set:
   - `videoUrl: '/media/founder-clip.mp4'` — or `audioUrl: '/media/founder-clip.m4a'` for voice-only;
   - `videoCaptionsUrl: '/media/founder-clip.vtt'` and/or `clipTranscript: '…'`
     (at least one is required for video — the embed warns in dev and the
     guard tests fail without it);
   - optionally `videoPosterUrl` and `clipLabel`.
3. Run `npm test` — `tests/founder-clip.test.mjs` fails if a configured local
   URL has no matching file under `public/`, or if a video ships without
   captions/transcript.
4. Run `npm run build`, then `npm run dev` and spot-check the founder section:
   the clip renders under the personal note, does not autoplay, and fetches no
   media until the visitor presses play.

## Rollback

Set `videoUrl`/`audioUrl` back to `null` in `src/data/content.js` — the embed
gate hides the clip with no other change.
