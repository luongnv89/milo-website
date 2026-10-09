import { Check } from 'lucide-react';

import { comparisonRows, comparisonSection } from '../data/content.js';

export function ComparisonSection() {
  return (
    <section id="comparison" className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <p className="eyebrow">{comparisonSection.eyebrow}</p>
        <h2 className="display-section mt-4 max-w-3xl text-ink">{comparisonSection.title}</h2>
        <p className="mt-4 max-w-2xl text-lg text-ink-2">{comparisonSection.lead}</p>

        <div className="mt-12 space-y-4 lg:hidden">
          {comparisonRows.map((row) => (
            <div key={row.feature} className="overflow-hidden rounded-2xl border border-line bg-card">
              <table
                className="w-full border-collapse text-left"
                aria-label={`iPhone comparison for ${row.feature}`}
              >
                <caption className="sr-only">
                  Feature comparison for {row.feature}: MILO, ChatGPT, Claude, and Gemini on iPhone.
                </caption>
                <thead className="bg-paper-2 text-xs uppercase tracking-wider text-ink-3">
                  <tr>
                    <th scope="col" className="w-[34%] px-4 py-3 font-medium">
                      Assistant
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      {row.feature}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  <tr>
                    <th
                      scope="row"
                      className="bg-accent-soft px-4 py-4 text-sm font-semibold text-ink"
                    >
                      MILO
                    </th>
                    <td className="bg-accent-soft/60 px-4 py-4 text-sm font-medium leading-relaxed text-ink">
                      <span className="inline-flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-ink" aria-hidden="true" />
                        <span>{row.milo}</span>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-3 text-sm font-medium text-ink">
                      ChatGPT
                    </th>
                    <td className="px-4 py-3 text-sm leading-relaxed text-ink-2">{row.chatgpt}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-3 text-sm font-medium text-ink">
                      Claude
                    </th>
                    <td className="px-4 py-3 text-sm leading-relaxed text-ink-2">{row.claude}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-3 text-sm font-medium text-ink">
                      Gemini
                    </th>
                    <td className="px-4 py-3 text-sm leading-relaxed text-ink-2">{row.gemini}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>

        <div className="mt-12 hidden overflow-x-auto rounded-2xl border border-line bg-card lg:block">
          <table className="min-w-[760px] table-fixed border-collapse text-left">
            <caption className="sr-only">
              Feature comparison of MILO, ChatGPT, Claude, and Gemini on iPhone.
            </caption>
            <thead className="bg-paper-2 text-xs uppercase tracking-wider text-ink-3">
              <tr>
                <th scope="col" className="w-[32%] px-4 py-3 font-medium">
                  Feature
                </th>
                <th
                  scope="col"
                  className="w-[17%] bg-accent-soft px-4 py-3 font-semibold text-ink"
                >
                  MILO
                </th>
                <th scope="col" className="w-[17%] px-4 py-3 font-medium">
                  ChatGPT
                </th>
                <th scope="col" className="w-[17%] px-4 py-3 font-medium">
                  Claude
                </th>
                <th scope="col" className="w-[17%] px-4 py-3 font-medium">
                  Gemini
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="align-top">
                  <th scope="row" className="px-4 py-4 text-sm font-medium leading-relaxed text-ink">
                    {row.feature}
                  </th>
                  <td className="bg-accent-soft/60 px-4 py-4 text-sm font-medium leading-relaxed text-ink">
                    <span className="inline-flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-ink" aria-hidden="true" />
                      <span>{row.milo}</span>
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm leading-relaxed text-ink-2">{row.chatgpt}</td>
                  <td className="px-4 py-4 text-sm leading-relaxed text-ink-2">{row.claude}</td>
                  <td className="px-4 py-4 text-sm leading-relaxed text-ink-2">{row.gemini}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
