import { founderStory } from '../data/content.js';
import { AppStoreButton } from './AppStoreButton.jsx';
import { FounderClip } from './FounderClip.jsx';

export function FounderStory() {
  return (
    <section id="story" className="bg-paper py-24 sm:py-32">
      <div className="mx-auto grid max-w-5xl gap-10 px-6 lg:grid-cols-[280px_1fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow">{founderStory.eyebrow}</p>
          {founderStory.photo ? (
            <img
              src={founderStory.photo}
              alt={founderStory.name}
              className="mt-6 h-16 w-16 rounded-full object-cover"
              loading="lazy"
            />
          ) : (
            <span className="mt-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent text-lg font-bold text-white">
              {founderStory.name.charAt(0)}
            </span>
          )}
          <p className="mt-4 font-medium text-ink">{founderStory.signoff}</p>
          <p className="text-sm text-ink-3">Builds and uses MILO daily</p>
        </div>

        <div>
          <div className="space-y-6 text-lg leading-relaxed text-ink sm:text-xl">
            {founderStory.paragraphs.map((p, i) =>
              i === 0 ? (
                <p key={i} className="font-serif text-2xl leading-snug text-ink sm:text-3xl">
                  {p}
                </p>
              ) : (
                <p key={i}>{p}</p>
              )
            )}
          </div>

          {founderStory.personalNote && (
            <blockquote className="mt-8 border-l-2 border-ink pl-5 font-serif text-xl italic text-ink-2">
              {founderStory.personalNote}
            </blockquote>
          )}

          <FounderClip
            videoUrl={founderStory.videoUrl}
            audioUrl={founderStory.audioUrl}
            posterUrl={founderStory.videoPosterUrl}
            captionsUrl={founderStory.videoCaptionsUrl}
            transcript={founderStory.clipTranscript}
            label={founderStory.clipLabel}
          />

          <div className="mt-10">
            <AppStoreButton location="founder_story" />
          </div>
        </div>
      </div>
    </section>
  );
}
