import { useState, useEffect } from 'react';

import { AppStoreButton } from './AppStoreButton.jsx';

export function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      // Show after the hero, hide once near the bottom (footer).
      setIsVisible(scrollY > 600 && scrollY < docHeight - 600);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-4 bottom-4 z-40 transition-[opacity,transform] duration-200 ease-out md:hidden ${
        isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
      }`}
      aria-hidden={!isVisible}
      inert={!isVisible}
    >
      <div className="card flex items-center justify-between gap-3 rounded-lg px-2 py-2 shadow-[0_16px_40px_-12px_rgb(0_0_0/0.25)]">
        <span className="pl-4 text-sm text-ink-2">$8.99 · one-time</span>
        <AppStoreButton
          location="floating_bar"
          label="Download"
          className="btn-primary h-10 px-4 text-sm"
          iconClassName="h-4 w-4"
        />
      </div>
    </div>
  );
}
