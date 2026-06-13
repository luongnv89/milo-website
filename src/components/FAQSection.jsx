import { faqItems } from '../data/content.js';

export function FAQSection() {
  return (
    <section id="faq" className="mx-auto max-w-5xl px-6 py-20">
      <div className="text-center">
        <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">Questions, answered.</h2>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {faqItems.map((item) => (
          <article key={item.question} className="glass rounded-2xl p-6">
            <h3 className="font-semibold text-white">{item.question}</h3>
            <p className="mt-3 text-sm text-white/70">{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
