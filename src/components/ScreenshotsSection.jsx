import { useCallback, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { screenshotGroups, screensSection } from '../data/content.js';
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
    <div className="w-[240px] sm:w-[280px]">
      {/* iPhone frame — same mockup as the hero, so every shot matches */}
      <div className="w-full rounded-[3rem] bg-neutral-900 p-[8px] shadow-phone">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-black">
          {/* Dynamic Island — sized to match the hero mockup at this width */}
          <div className="absolute left-1/2 top-3 z-20 h-[28px] w-[90px] -translate-x-1/2 rounded-full bg-black" />
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
    <section id="screens" className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <p className="eyebrow">{screensSection.eyebrow}</p>
        <h2 className="display-section mt-4 max-w-3xl text-ink">{screensSection.title}</h2>
        <p className="mt-4 max-w-2xl text-lg text-ink-2">{screensSection.lead}</p>

        <div
          className="mt-12 grid items-center gap-10 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-16"
          role="group"
          aria-roledescription="carousel"
          aria-label="MILO app screenshots"
          tabIndex={0}
          onKeyDown={onKeyDown}
        >
          {/* Slides — only the active one is shown (the rest are display:none, so
              they're out of the a11y tree and not focusable). Keeping every slide
              mounted keeps the markup simple and the keys stable across navigation. */}
          <div className="flex items-start justify-center lg:justify-start">
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
                </figure>
              );
            })}
          </div>

          <div>
            {/* Group context for the active slide */}
            <h3 className="text-3xl font-semibold tracking-tight text-ink">{current.groupTitle}</h3>
            <p className="mt-3 text-ink-2">{current.groupDescription}</p>
            <p className="mt-6 text-sm text-ink-3">{current.caption}</p>

            {/* Controls */}
            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous screenshot"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line-strong bg-card text-ink transition-colors hover:bg-paper-2"
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
                      className={`h-1.5 rounded-full transition-[width,background-color] duration-200 ${
                        isActive ? 'w-6 bg-ink' : 'w-1.5 bg-line-strong'
                      }`}
                    />
                  );
                })}
              </div>

              <button
                type="button"
                onClick={next}
                aria-label="Next screenshot"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line-strong bg-card text-ink transition-colors hover:bg-paper-2"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Live position for screen readers */}
              <p className="text-xs text-ink-3" aria-live="polite">
                {active + 1} / {count}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
