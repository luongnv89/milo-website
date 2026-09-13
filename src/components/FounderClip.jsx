/**
 * FounderClip (#24) — gated embed for an optional founder video/voice clip.
 *
 * Ships zero media by default: with no `videoUrl` and no `audioUrl` this
 * component renders `null`. It exists so that once a human records a REAL
 * founder clip (see the comment above `founderStory` in ../data/content.js)
 * and wires the resulting URL into `founderStory`, the embed activates with
 * zero further code changes — no new imports, no JSX edits, nothing to wire.
 *
 * Do NOT use this component to embed fabricated, AI-generated, or stock
 * media as if it were the founder speaking. It is only for a genuine
 * recording of the actual person.
 */
export function FounderClip({ videoUrl, audioUrl, posterUrl, captionsUrl, transcript, label }) {
  if (!videoUrl && !audioUrl) return null;

  if (import.meta.env.DEV && !captionsUrl && !transcript) {
    console.warn(
      'FounderClip: videoUrl/audioUrl is set without a captionsUrl or transcript — ' +
        'the founder clip has no accessible text alternative (see #24 acceptance criteria).'
    );
  }

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-paper-2 p-4">
      {videoUrl ? (
        <video
          controls
          preload="none"
          poster={posterUrl}
          playsInline
          aria-label={label || 'Founder video clip'}
          className="w-full rounded-xl"
        >
          <source src={videoUrl} />
          {captionsUrl && (
            <track kind="captions" src={captionsUrl} srcLang="en" label="English" default />
          )}
        </video>
      ) : (
        <audio controls preload="none" aria-label={label || 'Founder voice clip'} className="w-full">
          <source src={audioUrl} />
        </audio>
      )}

      {transcript && <p className="mt-3 text-xs text-ink-3">{transcript}</p>}
    </div>
  );
}
