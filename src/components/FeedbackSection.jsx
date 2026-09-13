import { ArrowUpRight, Github } from 'lucide-react';

import { feedbackIntro, feedbackOptions } from '../data/content.js';
import { trackEvent, EVENTS } from '../utils/analytics.js';

export function FeedbackSection() {
  return (
    <section id="feedback" className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <p className="eyebrow">{feedbackIntro.eyebrow}</p>
        <h2 className="display-section mt-4 max-w-3xl text-ink">{feedbackIntro.title}</h2>
        <p className="mt-4 max-w-2xl text-lg text-ink-2">{feedbackIntro.description}</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {feedbackOptions.map((option) => (
            <a
              key={option.id}
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent(EVENTS.FEEDBACK_LINK_CLICKED, { type: option.id })}
              className="card flex items-start gap-4 p-5 transition-colors hover:border-line-strong"
            >
              <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-line bg-paper-2">
                <option.icon className="h-5 w-5 text-ink" aria-hidden="true" />
              </span>
              <span>
                <span className="flex items-center gap-1.5 font-medium text-ink">
                  {option.label}
                  <ArrowUpRight className="h-4 w-4 text-ink-3" aria-hidden="true" />
                </span>
                <span className="mt-1 block text-sm text-ink-2">{option.description}</span>
              </span>
            </a>
          ))}
        </div>

        <a
          href={`${feedbackIntro.repoUrl}/issues`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent(EVENTS.FEEDBACK_LINK_CLICKED, { type: 'browse_issues' })}
          className="btn-link mt-8 inline-flex items-center gap-2 text-sm"
        >
          <Github className="h-4 w-4" />
          Browse existing issues
        </a>
      </div>
    </section>
  );
}
