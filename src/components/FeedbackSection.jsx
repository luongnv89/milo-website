import { ArrowUpRight, Github, Info } from 'lucide-react';

import { feedbackIntro, feedbackOptions } from '../data/content.js';
import { trackEvent, EVENTS } from '../utils/analytics.js';

export function FeedbackSection() {
  return (
    <section id="feedback" className="bg-slate-950 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-section font-semibold text-white">{feedbackIntro.title}</h2>
          <p className="mt-4 text-white/70">{feedbackIntro.description}</p>
        </div>

        <div className="mx-auto mt-8 flex max-w-2xl items-start gap-3 rounded-2xl border border-milo-blue/20 bg-milo-blue/10 p-4">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-milo-sky" />
          <p className="text-sm text-white/75">
            Every link opens a guided issue form on{' '}
            <a
              href={feedbackIntro.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-milo-sky underline underline-offset-2 transition hover:no-underline"
            >
              GitHub
            </a>
            . No email, no account on this site, no tracking on what you submit.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {feedbackOptions.map((option) => (
            <a
              key={option.id}
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent(EVENTS.FEEDBACK_LINK_CLICKED, { type: option.id })}
              className="group glass flex flex-col rounded-3xl p-6 transition hover:-translate-y-1 hover:border-milo-blue/40 focus:outline-none focus:ring-2 focus:ring-milo-blue focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              <span
                className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${option.gradient} text-white shadow-lg`}
              >
                <option.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 flex items-center gap-1.5 font-display text-lg font-semibold text-white">
                {option.label}
                <ArrowUpRight className="h-4 w-4 text-white/40 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-milo-sky" />
              </h3>
              <p className="mt-2 text-sm text-white/60">{option.description}</p>
            </a>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href={`${feedbackIntro.repoUrl}/issues`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent(EVENTS.FEEDBACK_LINK_CLICKED, { type: 'browse_issues' })}
            className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
          >
            <Github className="h-4 w-4" />
            Browse existing issues
          </a>
        </div>
      </div>
    </section>
  );
}
