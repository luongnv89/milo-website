import { Apple } from 'lucide-react';

import { APP_STORE_URL } from '../data/content.js';
import { trackEvent, EVENTS } from '../utils/analytics.js';

/**
 * Single source of truth for the primary download CTA.
 * Links to APP_STORE_URL — MILO's live App Store listing.
 */
export function AppStoreButton({ location = 'unknown', label = 'Download on the App Store', variant = 'primary' }) {
  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent(EVENTS.CTA_CLICKED, { location, text: label })}
      className={variant === 'ghost' ? 'btn-ghost' : 'btn-primary'}
    >
      <Apple className="h-5 w-5" />
      {label}
    </a>
  );
}
