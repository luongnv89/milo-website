import { problemSection } from '../data/content.js';

export function ProblemSection() {
  return (
    <section id="problem" className="border-y border-line bg-paper-2 py-24 sm:py-32">
      <div className="mx-auto grid max-w-4xl gap-8 px-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow">{problemSection.eyebrow}</p>
          <p className="display-section mt-4 font-serif italic text-ink">{problemSection.quote}</p>
        </div>
        <div className="lg:col-span-7">
          <h2 className="font-sans text-2xl font-medium tracking-tight text-ink sm:text-3xl">
            {problemSection.title}
          </h2>
          <p className="mt-4 text-lg text-ink-2">{problemSection.body}</p>
        </div>
      </div>
    </section>
  );
}
