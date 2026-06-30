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
    <section id="help" className="bg-slate-950 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-section font-semibold text-white">{instructionFlow.title}</h2>
          <p className="mt-4 text-white/70">{instructionFlow.description}</p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-start">
          {/* The (interactive) conversation */}
          <div className="glass space-y-4 rounded-3xl p-6 sm:p-8">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-[1px] text-white/50">Interactive Siri Flow Demo</span>
              {(demoLines.length > 0 || stage !== 'idle') && (
                <button
                  type="button"
                  onClick={resetDemo}
                  className="text-[10px] text-white/50 hover:text-white underline decoration-white/30"
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
                <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border bg-white/10 border-white/30 text-white/80">
                  <Mic className="h-4 w-4" />
                </span>
                <div className="max-w-[80%] rounded-2xl bg-white/10 px-4 py-2.5 text-sm text-white/70">Thinking…</div>
              </div>
            )}

            {/* Stage controls for interactive flow */}
            {stage === 'idle' && (
              <button
                type="button"
                onClick={activateSiri}
                className="mt-1 w-full rounded-2xl border border-white/15 bg-white/5 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 active:bg-white/15"
              >
                Activate Siri (“Hey Siri”)
              </button>
            )}

            {stage === 'siriAwake' && (
              <button
                type="button"
                onClick={sayAskMilo}
                className="mt-1 w-full rounded-2xl border border-milo-blue/30 bg-milo-blue/10 py-2 text-sm font-medium text-white/95 transition hover:bg-milo-blue/20"
              >
                Say “Ask MILO”
              </button>
            )}

            {stage === 'miloReady' && !isThinking && (
              <div className="space-y-2.5 pt-1">
                <div className="flex flex-wrap gap-1.5">
                  {MODELS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedModel(m)}
                      className={`rounded-full border px-2.5 py-0.5 text-xs transition ${selectedModel === m ? 'border-milo-blue bg-milo-blue/20 text-white' : 'border-white/15 text-white/70 hover:text-white'}`}
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
                    className="flex-1 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:border-white/30"
                  />
                  <button
                    type="button"
                    onClick={sendToMilo}
                    disabled={!queryInput.trim()}
                    className="btn-primary py-2 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}

            {stage === 'done' && (
              <p className="pt-1 text-center text-[11px] text-white/50">Follow-ups remember context in the app. Try another question or reset.</p>
            )}

            <div className="flex items-start gap-3 rounded-2xl border border-milo-blue/20 bg-milo-blue/10 p-4">
              <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-milo-sky" />
              <p className="text-sm text-white/75">{instructionFlow.followUp}</p>
            </div>
          </div>

          {/* Example prompts — now launchable in the interactive demo */}
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
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="text-xs text-white/55">{item.helper}</p>
                    <button
                      type="button"
                      onClick={() => loadExampleIntoDemo(item.prompt)}
                      className="rounded-full bg-white/10 px-2 py-px text-[10px] text-white/70 transition hover:bg-white/20 hover:text-white"
                    >
                      Try in demo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
