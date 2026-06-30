import { Check } from 'lucide-react';

import { pricing, APP_STORE_URL } from '../data/content.js';
import { AppStoreButton } from './AppStoreButton.jsx';

export function PricingSection() {
  return (
    <section id="pricing" className="mx-auto max-w-5xl px-6 py-20">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-milo-sky">
          {pricing.eyebrow}
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
          {pricing.title}
        </h2>
        <p className="mt-3 text-lg text-white/70">{pricing.subtitle}</p>
      </div>

      <div className="mx-auto max-w-md">
        <div className="glass rounded-3xl p-8 sm:p-10">
          <div className="text-center">
            <div className="text-4xl font-bold tracking-tight text-white">{pricing.price}</div>
            <div className="mt-1 text-lg font-medium text-white/80">{pricing.suffix}</div>

            {/* Clear pricing context — US anchor with Apple regional pricing */}
            <div className="mt-3 inline-flex flex-col items-center gap-1 rounded-full border border-white/15 bg-white/5 px-4 py-2">
              <span className="text-sm font-semibold text-milo-sky">$8.99</span>
              <span className="text-xs text-white/60">US price · Apple sets local pricing</span>
            </div>

            {/* Regional price hint — informational, not a hard-coded table */}
            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-white/40">Regional pricing (Apple sets exact prices)</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-white/60">
                <span>🇺🇸 United States</span>
                <span className="text-right font-medium text-white/80">$8.99</span>
                <span>🇪🇺 Europe</span>
                <span className="text-right font-medium text-white/80">~€8.99</span>
                <span>🇬🇧 United Kingdom</span>
                <span className="text-right font-medium text-white/80">~£7.99</span>
                <span>🇯🇵 Japan</span>
                <span className="text-right font-medium text-white/80">~¥1,290</span>
                <span>🇨🇦 Canada</span>
                <span className="text-right font-medium text-white/80">~C$11.99</span>
                <span>🇦🇺 Australia</span>
                <span className="text-right font-medium text-white/80">~A$12.99</span>
              </div>
              <p className="mt-2 text-[11px] text-white/40">Exact prices shown on the App Store depend on your country. Prices marked with ~ are approximate.</p>
            </div>

            <div className="mt-2 text-xs text-white/50">One-time purchase. No subscription. No hidden fees.</div>
          </div>

          <ul className="mt-8 space-y-3 text-sm">
            {pricing.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3 text-white/80">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-milo-blue" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <AppStoreButton
              location="pricing"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-milo-blue px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:scale-[1.01] active:scale-[0.985]"
            />
          </div>

          <p className="mt-4 text-center text-xs text-white/50">{pricing.finePrint}</p>

          <p className="mt-3 text-center text-xs text-white/40">
            You bring your own keys from OpenAI, Anthropic, Google, etc. MILO never sees your usage data or keys.
          </p>
        </div>
      </div>
    </section>
  );
}
