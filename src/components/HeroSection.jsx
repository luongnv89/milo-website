import { AppStoreButton } from './AppStoreButton.jsx';
import { heroContent, PRICE_LINE } from '../data/content.js';

export function HeroSection() {
  const [before, after] = heroContent.headline.split(heroContent.emphasis);
  return (
    <header className="relative overflow-hidden bg-paper">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:pb-32 lg:pt-28">
        <div>
          <p className="eyebrow reveal reveal-1">{heroContent.eyebrow}</p>

          <h1 className="display-hero reveal reveal-2 mt-5 text-ink">
            {before}
            <em>{heroContent.emphasis}</em>
            {after}
          </h1>

          <p className="reveal reveal-3 mt-6 max-w-xl text-lg leading-relaxed text-ink-2 sm:text-xl">
            {heroContent.subhead}
          </p>

          <div className="reveal reveal-4 mt-10 flex flex-wrap items-center gap-4">
            <AppStoreButton location="hero" />
            <a href="#how" className="btn-link text-[15px]">
              See how it works
            </a>
          </div>

          <p className="reveal reveal-5 mt-5 text-sm text-ink-3">
            {PRICE_LINE} · Bring your own keys
          </p>
        </div>

        {/* iPhone mockup */}
        <div className="relative mt-4 flex justify-center lg:mt-0">
          <div
            className="absolute -inset-8"
            style={{
              background:
                'radial-gradient(60% 60% at 50% 45%, rgba(59,130,246,0.14), transparent 70%)',
            }}
            aria-hidden="true"
          />
          <div className="relative w-[260px] sm:w-[300px]">
            {/* Phone bezel — iPhone style */}
            <div className="relative rounded-[3rem] bg-neutral-900 p-[8px] shadow-phone">
              {/* Screen container */}
              <div className="relative overflow-hidden rounded-[2.5rem] bg-black">
                {/* Dynamic Island */}
                <div className="absolute left-1/2 top-3 z-20 h-[28px] w-[90px] -translate-x-1/2 rounded-full bg-black" />

                {/* Promo video — fills the entire screen */}
                <div className="relative aspect-[9/19.5]">
                  <video
                    src="/milo-promo-portrait-final.mp4"
                    poster="/screenshot.png"
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
