import { footerLinks, socialLinks } from '../data/content.js';

const hrefFor = (href) =>
  href.endsWith('.html') ? `${import.meta.env.BASE_URL}${href}` : href;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-paper py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={`${import.meta.env.BASE_URL}AppIcon-80.png`}
                alt="MILO icon"
                className="h-10 w-10 rounded-xl"
              />
              <p className="font-sans text-lg font-semibold text-ink">MILO</p>
            </div>
            <p className="mt-3 text-sm text-ink-3">Your voice. Any AI.</p>
          </div>
          <div>
            <h4 className="eyebrow">Product</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <a href={hrefFor(link.href)} className="text-ink-2 transition-colors hover:text-ink">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="eyebrow">Company</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <a href={hrefFor(link.href)} className="text-ink-2 transition-colors hover:text-ink">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="eyebrow">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <a href={hrefFor(link.href)} className="text-ink-2 transition-colors hover:text-ink">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="eyebrow">Connect</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex items-center gap-2 text-ink-2 transition-colors hover:text-ink"
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
        <div className="mt-12 flex justify-between border-t border-line pt-8 text-xs text-ink-3">
          <p>© {year} MILO</p>
          <p>Made for iPhone &amp; CarPlay</p>
        </div>
      </div>
    </footer>
  );
}
