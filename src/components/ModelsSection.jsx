import { ArrowUpRight } from 'lucide-react';

import { freeKeyResources, modelsSection, providers } from '../data/content.js';

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
              {p.comingSoon ? (
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-3">
                  Coming soon
                </p>
              ) : null}
              <ul className="mt-1.5 space-y-0.5 text-sm text-ink-3">
                {p.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="card mt-8 p-6 sm:p-8">
          <h3 className="text-[17px] font-medium text-ink">{freeKeyResources.title}</h3>
          <p className="mt-2 text-sm text-ink-2">{freeKeyResources.lead}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {freeKeyResources.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border border-line bg-paper-2 p-4 transition-colors hover:border-line-strong"
              >
                <span className="flex items-center gap-1.5 break-all text-[15px] font-medium text-ink">
                  {link.label}
                  <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-ink-3" aria-hidden="true" />
                </span>
                <span className="mt-1 block text-sm text-ink-2">{link.description}</span>
              </a>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink-2">{freeKeyResources.guidance}</p>
        </div>
      </div>
    </section>
  );
}
