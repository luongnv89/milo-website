import { useState } from 'react';
import { Menu, X } from 'lucide-react';

import { navLinks } from '../data/content.js';
import { AppStoreButton } from './AppStoreButton.jsx';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md" aria-label="Main navigation">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2" aria-label="MILO home">
          <img src={`${import.meta.env.BASE_URL}AppIcon-80.png`} alt="MILO app icon" className="h-7 w-7 rounded-lg" loading="eager" width="80" height="80" />
          <span className="font-sans font-semibold tracking-tight text-ink">MILO</span>
        </a>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink transition-colors hover:bg-paper-2 md:hidden"
          aria-expanded={isOpen}
          aria-label="Toggle mobile menu"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-ink-2 transition-colors duration-150 hover:text-ink">
              {link.label}
            </a>
          ))}
          <AppStoreButton
            location="navbar_desktop"
            label="Download"
            className="btn-primary h-10 px-4 text-sm"
            iconClassName="h-4 w-4"
          />
        </div>
      </div>
      {isOpen && (
        <div className="border-t border-line bg-paper md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 text-sm">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-ink-2 transition-colors duration-150 hover:text-ink"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <AppStoreButton
              location="navbar_mobile"
              className="btn-primary w-full"
              onClick={() => setIsOpen(false)}
              iconClassName="h-4 w-4"
            />
          </div>
        </div>
      )}
    </nav>
  );
}
