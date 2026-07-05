import { Check } from 'lucide-react';

import { comparisonRows } from '../data/content.js';

export function ComparisonSection() {
  return (
    <section id="comparison" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-milo-sky">
          The hands-free difference
        </p>
        <h2 className="mt-5 font-display text-section font-semibold text-white">
          Ask hands-free. They make you open the app first.
        </h2>
        <p className="mt-4 text-white/70">
          No app to open — just ask Siri. See where MILO pulls ahead, feature by feature.
        </p>
      </div>

      <div className="glass rounded-3xl p-6 sm:p-8">
        <div className="space-y-4 lg:hidden">
          {comparisonRows.map((row) => (
            <div key={row.feature} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
              <table
                className="w-full border-collapse text-left"
                aria-label={`iPhone comparison for ${row.feature}`}
              >
                <caption className="sr-only">
                  Feature comparison for {row.feature}: MILO, ChatGPT, Claude, and Gemini on iPhone.
                </caption>
                <thead className="bg-white/[0.03] text-[10px] uppercase tracking-widest text-white/45">
                  <tr>
                    <th scope="col" className="w-[34%] px-4 py-3 font-medium">
                      Assistant
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      {row.feature}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <th
                      scope="row"
                      className="border-y border-milo-sky/20 bg-milo-blue/10 px-4 py-4 text-sm font-semibold text-milo-sky ring-1 ring-inset ring-milo-sky/20"
                    >
                      MILO
                    </th>
                    <td className="border-y border-milo-sky/20 bg-milo-blue/10 px-4 py-4 text-sm font-medium leading-relaxed text-white ring-1 ring-inset ring-milo-sky/20">
                      <span className="inline-flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" aria-hidden="true" />
                        <span>{row.milo}</span>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-3 text-sm font-medium text-white/80">
                      ChatGPT
                    </th>
                    <td className="px-4 py-3 text-xs leading-relaxed text-white/60">{row.chatgpt}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-3 text-sm font-medium text-white/80">
                      Claude
                    </th>
                    <td className="px-4 py-3 text-xs leading-relaxed text-white/60">{row.claude}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-3 text-sm font-medium text-white/80">
                      Gemini
                    </th>
                    <td className="px-4 py-3 text-xs leading-relaxed text-white/60">{row.gemini}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>

        <div className="hidden overflow-x-auto rounded-2xl border border-white/10 lg:block">
          <table className="min-w-[760px] table-fixed border-collapse text-left">
            <caption className="sr-only">
              Feature comparison of MILO, ChatGPT, Claude, and Gemini on iPhone.
            </caption>
            <thead className="bg-white/[0.03] text-[10px] uppercase tracking-widest text-white/45">
              <tr>
                <th scope="col" className="w-[32%] px-4 py-3 font-medium">
                  Feature
                </th>
                <th
                  scope="col"
                  className="w-[17%] border-x border-milo-sky/20 bg-milo-blue/10 px-4 py-3 font-semibold text-milo-sky ring-1 ring-inset ring-milo-sky/20"
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
            <tbody className="divide-y divide-white/10">
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="align-top">
                  <th scope="row" className="px-4 py-4 text-sm font-medium leading-relaxed text-white">
                    {row.feature}
                  </th>
                  <td className="border-x border-milo-sky/15 bg-milo-blue/10 px-4 py-4 text-sm font-medium leading-relaxed text-white">
                    <span className="inline-flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" aria-hidden="true" />
                      <span>{row.milo}</span>
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs leading-relaxed text-white/60">{row.chatgpt}</td>
                  <td className="px-4 py-4 text-xs leading-relaxed text-white/60">{row.claude}</td>
                  <td className="px-4 py-4 text-xs leading-relaxed text-white/60">{row.gemini}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
