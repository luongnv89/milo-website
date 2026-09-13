import { featureCards, featuresSection } from '../data/content.js';

export function FeaturesSection() {
  return (
    <section id="features" className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <p className="eyebrow">{featuresSection.eyebrow}</p>
        <h2 className="display-section mt-4 max-w-3xl text-ink">{featuresSection.title}</h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((card) => (
            <div key={card.title} className="card p-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-paper-2">
                <card.icon className="h-5 w-5 text-ink" aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-medium text-ink">{card.title}</h3>
              <p className="mt-2 text-[15px] text-ink-2">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
