import { featureCards } from '../data/content.js';

export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="font-display text-section font-semibold text-white">
          Ask real AI through Siri. That’s the job.
        </h2>
        <p className="mt-4 text-white/70">
          The core flow: voice via Siri → short spoken answer → your model → private.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {featureCards.map((card) => (
          <div key={card.title} className="glass rounded-3xl p-8">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-milo-blue/15 text-milo-sky">
              <card.icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="font-display text-xl font-semibold text-white">{card.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
