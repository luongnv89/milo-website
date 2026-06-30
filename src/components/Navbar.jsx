import { useState } from 'react';
import { Menu, X } from 'lucide-react';

import { navLinks } from '../data/content.js';
import { AppStoreButton } from './AppStoreButton.jsx';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl" aria-label="Main navigation">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2" aria-label="MILO home">
          <img src={`${import.meta.env.BASE_URL}AppIcon-80.png`} alt="MILO app icon" className="h-7 w-7 rounded-lg" loading="eager" width="80" height="80" />
          <span className="font-display text-white font-semibold">MILO</span>
        </a>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white/90 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-milo-blue focus:ring-offset-2 focus:ring-offset-slate-950 md:hidden"
          aria-expanded={isOpen}
          aria-label="Toggle mobile menu"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div className="hidden items-center gap-6 text-sm md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-white/80 transition hover:text-white">
              {link.label}
            </a>
          ))}
          <AppStoreButton
            location="navbar_desktop"
            className="inline-flex items-center gap-2 rounded-full bg-milo-blue px-5 py-2.5 font-semibold text-white shadow-lg transition hover:scale-105"
            iconClassName="h-4 w-4"
          />
        </div>
      </div>
      {isOpen && (
        <div className="border-t border-white/10 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 text-sm">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-white/80 transition hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <AppStoreButton
              location="navbar_mobile"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-milo-blue px-6 py-3 font-semibold text-white shadow-lg"
              onClick={() => setIsOpen(false)}
              iconClassName="h-4 w-4"
            />
          </div>
        </div>
      )}
    </nav>
  );
}
