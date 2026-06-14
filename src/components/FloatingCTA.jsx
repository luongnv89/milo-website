import { useState, useEffect } from 'react';
import { Apple } from 'lucide-react';

import { APP_STORE_URL } from '../data/content.js';
import { trackEvent, EVENTS } from '../utils/analytics.js';

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

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 transition-all duration-300">
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent(EVENTS.FLOATING_CTA_CLICKED, { location: 'floating_bar', text: 'Join the TestFlight beta' })}
        className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-slate-900/95 px-8 py-4 font-semibold text-white shadow-2xl backdrop-blur transition hover:scale-105 hover:border-milo-blue/50"
      >
        <Apple className="h-5 w-5 text-milo-sky" />
        <span>Join the TestFlight beta</span>
      </a>
    </div>
  );
}
