import { modelsSection, providers } from '../data/content.js';

export function ModelsSection() {
  return (
    <section id="models" className="bg-paper-2 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <p className="eyebrow">{modelsSection.eyebrow}</p>
        <h2 className="display-section mt-4 max-w-3xl text-ink">{modelsSection.title}</h2>
        <p className="mt-4 max-w-2xl text-lg text-ink-2">{modelsSection.lead}</p>

        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
          {providers.map((p) => (
            <div key={p.id} className="bg-card p-5 sm:p-6">
              <p.icon className="h-5 w-5 text-ink-2" aria-hidden="true" />
              <h3 className="mt-4 text-[15px] font-medium text-ink">{p.title}</h3>
              <ul className="mt-1.5 space-y-0.5 text-sm text-ink-3">
                {p.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
