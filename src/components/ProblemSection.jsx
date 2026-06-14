import { problemSection } from '../data/content.js';

export function ProblemSection() {
  return (
    <section id="problem" className="bg-slate-950 py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-milo-sky">
          {problemSection.eyebrow}
        </p>
        <h2 className="mt-5 font-display text-section font-semibold text-white">
          {problemSection.title}
        </h2>
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-white/75">
          {problemSection.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
