import { Mic } from 'lucide-react';

import { AppStoreButton } from './AppStoreButton.jsx';
import { heroContent, PRICING_OFFER, heroBadges, heroChecklist } from '../data/content.js';

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
            {heroContent.headline}
          </h1>

          <p className="mt-6 max-w-md text-lg text-slate-100/80 sm:text-xl lg:mx-0 mx-auto">
            {heroContent.subhead}
          </p>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <AppStoreButton location="hero" />
            <a href="#story" className="btn-ghost">
              Why I built it
            </a>
          </div>

          {/* Hero badges — pricing + platform */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              iOS 17.6+
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              On the App Store
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-milo-sky/30 bg-milo-sky/10 px-3 py-1 text-xs text-milo-sky">
              $8.99 USD
            </span>
          </div>
          <p className="mt-2 text-center text-[11px] text-white/40 lg:text-left">
            US price · Apple sets local pricing in your country
          </p>

          {/* Hero checklist — pricing + features */}
          <div className="mt-6 space-y-2 lg:mx-0 mx-auto">
            {heroChecklist.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-white/80">
                <item.icon className="h-4 w-4 flex-shrink-0 text-milo-blue" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Pricing teaser near hero CTA (#71) — links down to the full section */}
          <a
            href="#pricing"
            className="mt-4 inline-block max-w-md text-sm text-white/70 transition hover:text-white lg:mx-0 mx-auto"
          >
            <span className="font-medium text-milo-sky underline decoration-dotted underline-offset-2">
              {PRICING_OFFER}
            </span>
          </a>

          {/* Pricing note — links to full pricing section */}
          <a
            href="#pricing"
            className="mt-3 inline-block text-xs text-white/40 transition hover:text-white/60 lg:mx-0 mx-auto"
          >
            Prices vary by country — Apple sets local pricing
          </a>

          {/* Pricing badge — one-time purchase, no subscription */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-milo-blue/30 bg-milo-blue/10 px-4 py-1.5 text-sm font-medium text-milo-sky">
            <span className="font-bold text-milo-sky">$8.99</span>
            <span>one-time purchase · no subscription</span>
          </div>
        </div>

        {/* iPhone mockup — ported from the CUStats Go site (custats-info MobileApp) */}
        <div className="relative flex justify-center">
          {/* Glow effect */}
          <div className="absolute inset-0 scale-110 rounded-3xl bg-gradient-to-t from-milo-blue/30 via-milo-blue/10 to-transparent blur-3xl" />

          {/* Phone frame */}
          <div className="relative w-64 sm:w-72">
            {/* Phone bezel — iPhone style */}
            <div className="relative rounded-[2.5rem] bg-slate-900 p-[6px] shadow-2xl ring-1 ring-white/10">
              {/* Screen container */}
              <div className="relative overflow-hidden rounded-[2.2rem] bg-black">
                {/* Dynamic Island */}
                <div className="absolute left-1/2 top-3 z-20 h-[28px] w-[90px] -translate-x-1/2 rounded-full bg-black" />

                {/* Promo video — fills the entire screen */}
                <div className="relative aspect-[9/19.5]">
                  <video
                    src="/milo-promo-portrait-final.mp4"
                    alt="MILO running in CarPlay mode, answering a hands-free voice question through Siri"
                    className="h-full w-full object-cover object-top"
                    autoPlay
                    loop
                    muted
                    playsInline
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
