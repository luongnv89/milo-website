import { providers } from '../data/content.js';

export function CompareSection() {
  return (
    <section id="providers" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-section font-semibold text-white">
          Choose your AI. Your keys. One Siri voice.
        </h2>
        <p className="mt-4 text-white/70">
          Pick any of 8 providers (200+ models) or stay on-device. Switch by voice. Keys stay yours; only the model you choose sees prompts.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {providers.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/[0.08]"
          >
            <p.icon className={`h-6 w-6 ${p.color}`} />
            <h3 className="mt-3 font-semibold text-white">{p.title}</h3>
            <ul className="mt-2 space-y-1 text-[13px] leading-relaxed text-white/60">
              {p.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
