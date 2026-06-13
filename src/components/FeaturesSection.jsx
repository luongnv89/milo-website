import { Check, X } from 'lucide-react';

import { featureCards, comparisonRows } from '../data/content.js';

export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="font-display text-section font-semibold text-white">
          A real AI answer, without lifting a finger.
        </h2>
        <p className="mt-4 text-white/70">
          Four things MILO does that a standalone chat app on iOS simply can’t.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {featureCards.map((card) => (
          <div key={card.title} className="glass rounded-3xl p-8">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-milo-blue/15 text-milo-sky">
              <card.icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl font-semibold text-white">{card.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Slim, honest comparison — MILO vs. standalone AI apps on iOS */}
      <div className="mt-16">
        <div className="glass rounded-3xl p-6 sm:p-8">
          <p className="text-xs uppercase tracking-widest text-white/50">MILO vs. a standalone AI app on iOS</p>
          <div className="mt-6 divide-y divide-white/5">
            {comparisonRows.map((row) => (
              <div
                key={row.feature}
                className="grid grid-cols-1 gap-3 py-4 sm:grid-cols-[1.4fr_1fr_1fr] sm:items-center"
              >
                <p className="text-sm font-medium text-white">{row.feature}</p>
                <p className="inline-flex items-center gap-2 text-sm text-white">
                  <Check className="h-4 w-4 flex-shrink-0 text-green-400" />
                  {row.milo}
                </p>
                <p className="inline-flex items-center gap-2 text-sm text-white/55">
                  <X className="h-4 w-4 flex-shrink-0 text-white/30" />
                  {row.others}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
