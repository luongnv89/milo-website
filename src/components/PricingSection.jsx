import { Check } from 'lucide-react';

import { pricing } from '../data/content.js';
import { AppStoreButton } from './AppStoreButton.jsx';

export function PricingSection() {
  return (
    <section id="pricing" className="bg-paper-2 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{pricing.eyebrow}</p>
          <h2 className="display-section mt-4 text-ink">{pricing.title}</h2>
        </div>

        <div className="card mx-auto mt-12 max-w-md p-8 text-center sm:p-10">
          <div className="text-6xl font-semibold leading-none tracking-tight text-ink">{pricing.price}</div>
          <p className="mt-3 text-sm text-ink-3">{pricing.priceLine}</p>

          <ul className="mt-8 space-y-3 text-left text-[15px] text-ink-2">
            {pricing.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="mt-1 h-4 w-4 flex-shrink-0 text-ink" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <AppStoreButton location="pricing" className="btn-primary mt-8 w-full" />

          <p className="mt-4 text-xs text-ink-3">{pricing.finePrint}</p>
        </div>
      </div>
    </section>
  );
}
