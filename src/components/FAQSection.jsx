import { ChevronDown } from 'lucide-react';

import { faqItems } from '../data/content.js';

export function FAQSection() {
  return (
    <section id="faq" className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="display-section text-center text-ink">Questions, answered.</h2>
        <div className="mx-auto mt-12 max-w-3xl divide-y divide-line border-y border-line">
          {faqItems.map((item, index) => (
            <details key={item.question} className="group py-5" open={index === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-[17px] font-medium text-ink [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronDown className="h-4 w-4 flex-shrink-0 text-ink-3 transition-transform duration-200 ease-out group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="mt-3 pr-10 text-[15px] leading-relaxed text-ink-2">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
