import { useState } from 'react';
import { Lightbulb, Mic, Sparkles, UserRound } from 'lucide-react';

import { howItWorks, instructionFlow, siriExamples } from '../data/content.js';

const speakerMeta = {
  user: {
    title: 'You',
    reverse: true,
    bubble: 'bg-accent text-primary-foreground',
    avatar: 'border-line bg-card text-ink-2',
    Icon: UserRound,
  },
  siri: {
    title: 'Siri',
    reverse: false,
    bubble: 'bg-paper-2 text-ink',
    avatar: 'border-line bg-card text-ink-2',
    Icon: Mic,
  },
};

function ChatBubble({ line }) {
  const meta = speakerMeta[line.speaker] ?? speakerMeta.siri;
  const { Icon } = meta;
  return (
    <div className={`flex items-end gap-3 ${meta.reverse ? 'flex-row-reverse' : ''}`}>
      <span
        className={`inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border ${meta.avatar}`}
      >
        {line.handoff ? <Sparkles className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
      </span>
      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${meta.bubble}`}>
        <p>{line.text}</p>
        {line.subtitle && <p className="mt-1 text-xs text-accent-ink">{line.subtitle}</p>}
      </div>
    </div>
  );
}

export function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState(siriExamples[0].id);
  const active = siriExamples.find((t) => t.id === activeTab) ?? siriExamples[0];

  // Interactive Siri flow demo (#76)
  const [demoLines, setDemoLines] = useState([]);
  const [stage, setStage] = useState('idle'); // idle | siriAwake | miloReady | done
  const [selectedModel, setSelectedModel] = useState('Gemini');
  const [queryInput, setQueryInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const MODELS = ['Gemini', 'Claude', 'GPT', 'Mistral'];

  function resetDemo() {
    setDemoLines([]);
    setStage('idle');
    setQueryInput('');
    setIsThinking(false);
  }

  function addLine(line) {
    setDemoLines((prev) => [...prev, line]);
  }

  function activateSiri() {
    if (stage !== 'idle') return;
    addLine({ speaker: 'user', text: 'Hey Siri' });
    setTimeout(() => {
      addLine({ speaker: 'siri', text: 'Uh huh?' });
      setStage('siriAwake');
    }, 140);
  }

  function sayAskMilo() {
    if (stage !== 'siriAwake') return;
    addLine({ speaker: 'user', text: 'Ask MILO' });
    setTimeout(() => {
      addLine({
        speaker: 'siri',
        handoff: true,
        text: 'What can I help you with?',
        subtitle: '⚡️ Handing off to MILO',
      });
      setStage('miloReady');
    }, 180);
  }

  function generateResponse(q, model) {
    const lower = q.toLowerCase().trim();
    if (lower.includes('wine') || lower.includes('pair') || lower.includes('focaccia')) {
      return 'A crisp Vermentino or an herby Sauvignon Blanc keeps it bright.';
    }
    if (lower.includes('breakfast') || lower.includes('recipe') || lower.includes('cook') || lower.includes('healthy')) {
      return 'Oatmeal with berries and nuts — quick, healthy, and filling.';
    }
    if (lower.includes('weather') || lower.includes('temp') || lower.includes('outside')) {
      return 'Clear skies, 68 degrees — great day to be outside.';
    }
    if (lower.includes('time') || lower.includes('clock')) {
      return `It's ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}.`;
    }
    if (lower.includes('traffic') || lower.includes('drive') || lower.includes('car')) {
      return 'Light traffic on the main routes. Should be a smooth drive.';
    }
    return `${model}: ${q.length > 50 ? 'Good question — ' : ''}here's a short spoken-style answer.`;
  }

  function sendToMilo() {
    const q = queryInput.trim();
    if (!q || stage !== 'miloReady' || isThinking) return;
    addLine({ speaker: 'user', text: q });
    setQueryInput('');
    setIsThinking(true);
    setTimeout(() => {
      const responseText = generateResponse(q, selectedModel);
      addLine({
        speaker: 'siri',
        text: responseText,
        subtitle: `via ${selectedModel} · short for voice`,
      });
      setIsThinking(false);
      setStage('done');
    }, 620);
  }

  function loadExampleIntoDemo(promptText) {
    // Extract the actual query after the arrow or prefix
    const match = promptText.match(/→\s*(.+)$/);
    const query = match ? match[1] : promptText.replace(/^Ask MILO\s*→?\s*/i, '');
    resetDemo();
    // Replay the Siri handoff quickly then auto-send the example query
    setTimeout(() => {
      addLine({ speaker: 'user', text: 'Hey Siri' });
    }, 20);
    setTimeout(() => {
      addLine({ speaker: 'siri', text: 'Uh huh?' });
      setStage('siriAwake');
    }, 160);
    setTimeout(() => {
      addLine({ speaker: 'user', text: 'Ask MILO' });
      addLine({ speaker: 'siri', handoff: true, text: 'What can I help you with?', subtitle: '⚡️ Handing off to MILO' });
      setStage('miloReady');
      setQueryInput(query);
    }, 380);
    setTimeout(() => {
      const q = query;
      if (q) {
        addLine({ speaker: 'user', text: q });
        setQueryInput('');
        setIsThinking(true);
        setTimeout(() => {
          const resp = generateResponse(q, selectedModel);
          addLine({ speaker: 'siri', text: resp, subtitle: `via ${selectedModel} · short for voice` });
          setIsThinking(false);
          setStage('done');
        }, 580);
      }
    }, 820);
  }

  const showPreview = demoLines.length === 0 && stage === 'idle';
  const conversationLines = showPreview ? instructionFlow.steps : demoLines;

  return (
    <section id="how" className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <p className="eyebrow">{howItWorks.eyebrow}</p>
        <h2 className="display-section mt-4 max-w-3xl text-ink">{howItWorks.title}</h2>
        <p className="mt-4 max-w-2xl text-lg text-ink-2">{howItWorks.lead}</p>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
          {howItWorks.steps.map((step) => (
            <div key={step.n} className="bg-card p-6 sm:p-8">
              <span className="text-4xl font-semibold tracking-tight text-ink-3">{step.n}</span>
              <h3 className="mt-4 text-lg font-medium text-ink">{step.title}</h3>
              <p className="mt-1 text-[15px] text-ink-2">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          {/* The (interactive) conversation */}
          <div className="card space-y-4 p-6 sm:p-8">
            <div className="mb-1 flex items-center justify-between">
              <span className="eyebrow">Interactive demo</span>
              {(demoLines.length > 0 || stage !== 'idle') && (
                <button
                  type="button"
                  onClick={resetDemo}
                  className="text-xs text-ink-3 underline"
                >
                  Reset demo
                </button>
              )}
            </div>

            {conversationLines.map((line, i) => (
              <ChatBubble key={i} line={line} />
            ))}

            {isThinking && (
              <div className="flex items-end gap-3 opacity-70">
                <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-line bg-card text-ink-2">
                  <Mic className="h-4 w-4" />
                </span>
                <div className="max-w-[80%] rounded-2xl bg-paper-2 px-4 py-2.5 text-sm text-ink-2">Thinking…</div>
              </div>
            )}

            {/* Stage controls for interactive flow */}
            {stage === 'idle' && (
              <button
                type="button"
                onClick={activateSiri}
                className="btn-secondary mt-1 w-full"
              >
                Activate Siri (“Hey Siri”)
              </button>
            )}

            {stage === 'siriAwake' && (
              <button
                type="button"
                onClick={sayAskMilo}
                className="btn-secondary mt-1 w-full"
              >
                Say “Ask MILO”
              </button>
            )}

            {stage === 'miloReady' && !isThinking && (
              <div className="space-y-2.5 pt-1">
                <div className="flex flex-wrap gap-2">
                  {MODELS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedModel(m)}
                      className={`inline-flex min-h-[44px] items-center justify-center rounded-full border px-3 py-1.5 text-sm transition-colors sm:min-h-0 ${
                        selectedModel === m
                          ? 'border-accent bg-accent-soft text-accent-ink'
                          : 'border-line text-ink-2 hover:text-ink'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') sendToMilo();
                    }}
                    placeholder="Type question for MILO…"
                    className="input min-w-0 flex-1 text-sm"
                  />
                  <button
                    type="button"
                    onClick={sendToMilo}
                    disabled={!queryInput.trim()}
                    className="btn-primary h-10 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}

            {stage === 'done' && (
              <p className="pt-1 text-center text-xs text-ink-3">Follow-ups remember context in the app. Try another question or reset.</p>
            )}

            <p className="mt-4 flex items-start gap-2 border-t border-line pt-4 text-sm text-ink-3">
              <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{instructionFlow.followUp}</span>
            </p>
          </div>

          {/* Example prompts — launchable in the interactive demo */}
          <div>
            <div className="inline-flex rounded-full border border-line bg-card p-1">
              {siriExamples.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  aria-selected={tab.id === activeTab}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-4 py-1.5 text-sm ${
                    tab.id === activeTab ? 'bg-ink text-paper' : 'text-ink-2'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="mt-4 divide-y divide-line rounded-2xl border border-line bg-card">
              {active.items.map((item) => (
                <div key={item.prompt} className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="text-[15px] font-medium text-ink">{item.prompt}</p>
                    <p className="text-sm text-ink-3">{item.helper}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => loadExampleIntoDemo(item.prompt)}
                    className="btn-link inline-flex min-h-[44px] shrink-0 items-center text-sm"
                  >
                    Try it
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
