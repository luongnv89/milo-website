import { useCallback, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { screenshotGroups } from '../data/content.js';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js';

// Flatten the themed groups into one slide per screenshot, carrying the group's
// title + description along so each slide keeps its marketing context. The data
// in content.js is consumed as-is — we only reshape it for the carousel here.
function buildSlides(groups) {
  return groups.flatMap((group) =>
    group.shots.map((shot) => ({
      ...shot,
      groupTitle: group.title,
      groupDescription: group.description,
    }))
  );
}

function PhoneShot({ shot }) {
  return (
    <div className="w-56">
      {/* iPhone frame — same mockup as the hero, fixed width so every shot matches */}
      <div className="w-full rounded-[2.25rem] bg-slate-900 p-[6px] shadow-2xl ring-1 ring-white/10">
        <div className="relative overflow-hidden rounded-[1.9rem] bg-black">
          {/* Dynamic Island */}
          <div className="absolute left-1/2 top-2.5 z-20 h-[22px] w-[72px] -translate-x-1/2 rounded-full bg-black" />
          <div className="relative aspect-[9/19.5]">
            <img
              src={`${import.meta.env.BASE_URL}${shot.src}`}
              alt={shot.alt}
              className="absolute inset-0 h-full w-full object-cover object-top"
              loading="lazy"
              decoding="async"
              width="1170"
              height="2532"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ScreenshotsSection() {
  const slides = useMemo(() => buildSlides(screenshotGroups), []);
  const [active, setActive] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const count = slides.length;

  const goTo = useCallback(
    (index) => setActive(((index % count) + count) % count),
    [count]
  );
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);
  const next = useCallback(() => goTo(active + 1), [active, goTo]);

  // Arrow-key navigation when the carousel region (or a child) has focus.
  const onKeyDown = useCallback(
    (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        prev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        next();
      }
    },
    [prev, next]
  );

  const current = slides[active];

  return (
    <section id="screens" className="bg-slate-950 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-display text-section font-semibold text-white">See MILO in action</h2>
          <p className="mt-4 text-white/70">
            A look inside the app — from hands-free CarPlay chats to on-device history and your own keys.
          </p>
        </div>

        <div
          className="glass relative mx-auto max-w-3xl rounded-3xl p-6 sm:p-10"
          role="group"
          aria-roledescription="carousel"
          aria-label="MILO app screenshots"
          tabIndex={0}
          onKeyDown={onKeyDown}
        >
          {/* Group context for the active slide */}
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">
              {current.groupTitle}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{current.groupDescription}</p>
          </div>

          {/* Slides — only the active one is shown (the rest are display:none, so
              they're out of the a11y tree and not focusable). Keeping every slide
              mounted keeps the markup simple and the keys stable across navigation. */}
          <div className="mt-10 flex items-start justify-center">
            {slides.map((shot, index) => {
              const isActive = index === active;
              return (
                <figure
                  key={shot.src}
                  className={`flex-col items-center ${isActive ? 'flex' : 'hidden'} ${
                    isActive && !prefersReducedMotion ? 'animate-fade-in' : ''
                  }`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${count}`}
                  aria-hidden={!isActive}
                >
                  <PhoneShot shot={shot} />
                  <figcaption className="mt-4 text-center text-sm text-white/70">
                    {shot.caption}
                  </figcaption>
                </figure>
              );
            })}
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous screenshot"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-milo-blue"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              {slides.map((shot, index) => {
                const isActive = index === active;
                return (
                  <button
                    key={shot.src}
                    type="button"
                    aria-current={isActive ? 'true' : undefined}
                    aria-label={`Go to screenshot ${index + 1}: ${shot.caption}`}
                    onClick={() => goTo(index)}
                    className={`h-2.5 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-milo-blue ${
                      isActive ? 'w-6 bg-milo-blue' : 'w-2.5 bg-white/25 hover:bg-white/40'
                    }`}
                  />
                );
              })}
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Next screenshot"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-milo-blue"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Live position for screen readers */}
          <p className="mt-4 text-center text-xs text-white/45" aria-live="polite">
            {active + 1} / {count}
          </p>
        </div>
      </div>
    </section>
  );
}
