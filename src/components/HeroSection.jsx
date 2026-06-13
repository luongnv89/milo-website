import { Mic, ShieldCheck, Sparkles } from 'lucide-react';

import { heroChecklist, heroBadges } from '../data/content.js';
import { AppStoreButton } from './AppStoreButton.jsx';

export function HeroSection() {
  return (
    <header className="hero-glow relative overflow-hidden bg-slate-950">
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-24 pt-16 lg:flex-row lg:items-center lg:pt-24">
        <div className="flex-1 text-center lg:text-left">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-medium text-white/90">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-milo-blue text-white">
              <Mic className="h-4 w-4" />
            </span>
            Siri-first · CarPlay-ready · multi-model
          </div>

          <h1 className="font-display text-hero font-bold text-white">
            Give Siri the brains of{' '}
            <span className="text-milo-sky">GPT, Claude &amp; Gemini</span>.
          </h1>

          <p className="mt-6 max-w-xl text-lg text-slate-100/80 sm:text-xl lg:mx-0 mx-auto">
            iOS only lets Siri listen hands-free, everywhere — but Siri isn’t very smart. MILO bridges
            that gap, routing your voice to the AI model you choose. Ask while driving, walking, or
            multitasking. No typing, no app switching.
          </p>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <AppStoreButton location="hero" />
            <a href="#story" className="btn-ghost">
              Why I built it
            </a>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 lg:items-start">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/80 lg:justify-start">
              {heroChecklist.map(({ label, icon: Icon }) => (
                <span key={label} className="inline-flex items-center gap-2">
                  <Icon className="h-4 w-4 text-milo-sky" />
                  {label}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-white/70 lg:justify-start">
              {heroBadges.map(({ label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-milo-sky" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="glass relative overflow-hidden rounded-3xl p-6 shadow-glow">
            <div className="relative aspect-[9/17] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl">
              <img
                src={`${import.meta.env.BASE_URL}screenshot.png`}
                alt="MILO iOS app connecting Siri to GPT, Claude, and Gemini for hands-free voice answers"
                className="absolute inset-0 h-full w-full object-contain"
                loading="eager"
                fetchpriority="high"
                width="390"
                height="844"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 rounded-xl bg-milo-blue px-4 py-2 shadow-2xl">
              <p className="text-sm font-bold text-white">200+ AI Models</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-widest text-white/60">Powered by your keys</p>
            <div className="mt-3 space-y-2 text-sm text-white/80">
              <span className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-milo-sky" />
                <span>OpenAI, Claude, Gemini, Mistral, Groq &amp; OpenRouter</span>
              </span>
              <span className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-milo-sky" />
                <span>Plus on-device Apple Intelligence &amp; local Ollama</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
