import { socialLinks } from '../data/content.js';

const productLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Story', href: '#story' },
  { label: 'Providers', href: '#providers' },
  { label: 'Help', href: '#help' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Feedback', href: '#feedback' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-slate-950/80 py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <img src={`${import.meta.env.BASE_URL}AppIcon-80.png`} alt="MILO icon" className="h-10 w-10 rounded-xl shadow" />
            <div>
              <p className="font-display text-lg font-semibold text-white">MILO</p>
              <p className="text-xs text-white/50">Your voice. Any AI.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-8">
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">Product</h4>
              <ul className="space-y-2 text-sm text-white/60">
                {productLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="transition hover:text-white">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">Legal</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>
                  <a href={`${import.meta.env.BASE_URL}privacy-policy.html`} className="transition hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href={`${import.meta.env.BASE_URL}terms.html`} className="transition hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href={`${import.meta.env.BASE_URL}changelog.html`} className="transition hover:text-white">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">Connect</h4>
              <ul className="space-y-2 text-sm text-white/60">
                {socialLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="inline-flex items-center gap-2 transition hover:text-white"
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 text-center">
          <p className="text-xs text-white/40">© {year} MILO. Built for the way you speak.</p>
        </div>
      </div>
    </footer>
  );
}
