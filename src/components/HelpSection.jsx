import { useState } from 'react';
import { Lightbulb, Mic, Sparkles, UserRound } from 'lucide-react';

import { instructionFlow, siriExamples } from '../data/content.js';

const speakerMeta = {
  user: {
    title: 'You',
    reverse: true,
    bubble: 'bg-milo-blue/25 text-white',
    avatar: 'bg-milo-blue/20 border-milo-blue/50 text-white',
    Icon: UserRound,
  },
  siri: {
    title: 'Siri',
    reverse: false,
    bubble: 'bg-white/10 text-white/80',
    avatar: 'bg-white/10 border-white/30 text-white/80',
    Icon: Mic,
  },
};

function ChatBubble({ line }) {
  const meta = speakerMeta[line.speaker] ?? speakerMeta.siri;
  const { Icon } = meta;
  return (
    <div className={`flex items-end gap-3 ${meta.reverse ? 'flex-row-reverse' : ''}`}>
      <span
        className={`inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border ${meta.avatar}`}
      >
        {line.handoff ? <Sparkles className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
      </span>
      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${meta.bubble}`}>
        <p>{line.text}</p>
        {line.subtitle && <p className="mt-1 text-xs text-milo-sky">{line.subtitle}</p>}
      </div>
    </div>
  );
}

export function HelpSection() {
  const [activeTab, setActiveTab] = useState(siriExamples[0].id);
  const active = siriExamples.find((t) => t.id === activeTab) ?? siriExamples[0];

  return (
    <section id="help" className="bg-slate-950 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-section font-semibold text-white">{instructionFlow.title}</h2>
          <p className="mt-4 text-white/70">{instructionFlow.description}</p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-start">
          {/* The conversation */}
          <div className="glass space-y-4 rounded-3xl p-6 sm:p-8">
            {instructionFlow.steps.map((line, i) => (
              <ChatBubble key={i} line={line} />
            ))}
            <div className="flex items-start gap-3 rounded-2xl border border-milo-blue/20 bg-milo-blue/10 p-4">
              <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-milo-sky" />
              <p className="text-sm text-white/75">{instructionFlow.followUp}</p>
            </div>
          </div>

          {/* Example prompts */}
          <div>
            <div className="flex flex-wrap gap-2">
              {siriExamples.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className="tab-button"
                  aria-selected={tab.id === activeTab}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="mt-4 space-y-3">
              {active.items.map((item) => (
                <div key={item.prompt} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-medium text-white">{item.prompt}</p>
                  <p className="mt-1 text-xs text-white/55">{item.helper}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
