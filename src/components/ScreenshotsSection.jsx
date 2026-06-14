import { screenshotGroups } from '../data/content.js';

function PhoneShot({ shot }) {
  return (
    <figure className="flex w-56 flex-col items-center">
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
      <figcaption className="mt-4 text-center text-sm text-white/70">{shot.caption}</figcaption>
    </figure>
  );
}

export function ScreenshotsSection() {
  return (
    <section id="screens" className="bg-slate-950 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-display text-section font-semibold text-white">See MILO in action</h2>
          <p className="mt-4 text-white/70">
            A look inside the app — from hands-free CarPlay chats to on-device history and your own keys.
          </p>
        </div>

        <div className="space-y-16">
          {screenshotGroups.map((group) => (
            <div key={group.id} className="glass rounded-3xl p-6 sm:p-10">
              <div className="mx-auto max-w-2xl text-center">
                <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">
                  {group.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{group.description}</p>
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-12">
                {group.shots.map((shot) => (
                  <PhoneShot key={shot.src} shot={shot} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
