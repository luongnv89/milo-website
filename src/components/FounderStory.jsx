import { founderStory } from '../data/content.js';
import { AppStoreButton } from './AppStoreButton.jsx';

export function FounderStory() {
  return (
    <section id="story" className="bg-slate-950 py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="glass rounded-3xl p-8 sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-milo-sky">
            {founderStory.eyebrow}
          </p>

          <div className="mt-6 space-y-5 text-lg leading-relaxed text-white/85">
            {founderStory.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-milo-blue text-lg font-bold text-white">
                {founderStory.name.charAt(0)}
              </span>
              <p className="font-display font-semibold text-white">{founderStory.signoff}</p>
            </div>
            <AppStoreButton location="founder_story" label="Try MILO" />
          </div>
        </div>
      </div>
    </section>
  );
}
