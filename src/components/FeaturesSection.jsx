import { Check, X } from 'lucide-react';

import { featureCards, comparisonRows } from '../data/content.js';

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
              <card.icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl font-semibold text-white">{card.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Comparison vs named competitors (#74) — refocused on Siri core job (#78) */}
      <div className="mt-16">
        <div className="glass rounded-3xl p-6 sm:p-8">
          <p className="text-xs uppercase tracking-widest text-white/50">MILO vs ChatGPT, Claude, and Gemini on iPhone</p>
          <div className="mt-6 divide-y divide-white/5">
            {/* Header row for named competitors (scannable on mobile too) */}
            <div className="grid grid-cols-1 gap-3 py-2 text-[10px] uppercase tracking-widest text-white/40 sm:grid-cols-[1.6fr,1fr,1fr,1fr,1fr] sm:items-center">
              <div>Feature</div>
              <div className="font-medium text-green-400">MILO</div>
              <div>ChatGPT</div>
              <div>Claude</div>
              <div>Gemini</div>
            </div>
            {comparisonRows.map((row) => (
              <div
                key={row.feature}
                className="grid grid-cols-1 gap-3 py-4 sm:grid-cols-[1.6fr,1fr,1fr,1fr,1fr] sm:items-center"
              >
                <p className="text-sm font-medium text-white">{row.feature}</p>
                <p className="inline-flex items-center gap-2 text-sm text-white">
                  <Check className="h-4 w-4 flex-shrink-0 text-green-400" />
                  {row.milo}
                </p>
                <p className="inline-flex items-center gap-1 text-xs text-white/55">
                  <X className="h-3 w-3 flex-shrink-0 text-white/30" />
                  {row.chatgpt}
                </p>
                <p className="inline-flex items-center gap-1 text-xs text-white/55">
                  <X className="h-3 w-3 flex-shrink-0 text-white/30" />
                  {row.claude}
                </p>
                <p className="inline-flex items-center gap-1 text-xs text-white/55">
                  <X className="h-3 w-3 flex-shrink-0 text-white/30" />
                  {row.gemini}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
