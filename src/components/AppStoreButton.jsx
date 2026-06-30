import { Apple } from 'lucide-react';

import { APP_STORE_URL, PRIMARY_CTA_LABEL } from '../data/content.js';
import { trackEvent, EVENTS } from '../utils/analytics.js';

/**
 * Single source of truth for the primary download CTA.
 * Links to APP_STORE_URL — MILO's live App Store listing.
 * Label content-driven; supports className override for special floating/nav styles.
 */
export function AppStoreButton({ location = 'unknown', label, variant = 'primary', className = '', onClick }) {
  const effectiveLabel = label || PRIMARY_CTA_LABEL;
  const baseClass = variant === 'ghost' ? 'btn-ghost' : 'btn-primary';
  const finalClass = className || baseClass;
  const handleClick = (e) => {
    trackEvent(EVENTS.CTA_CLICKED, { location, text: effectiveLabel });
    if (typeof onClick === 'function') onClick(e);
  };
  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={finalClass}
    >
      <Apple className="h-5 w-5" />
      {effectiveLabel}
    </a>
  );
}
