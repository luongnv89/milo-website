import { Apple } from 'lucide-react';

import { APP_STORE_URL } from '../data/content.js';
import { trackEvent, EVENTS } from '../utils/analytics.js';

/**
 * Single source of truth for the primary download CTA.
 * Links to APP_STORE_URL (placeholder '#' until the TestFlight / App Store
 * listing is live). MILO is in TestFlight beta, so the default label invites
 * a beta join rather than promising an App Store download that doesn't exist.
 */
export function AppStoreButton({ location = 'unknown', label = 'Join the TestFlight beta', variant = 'primary' }) {
  return (
    <a
      href={APP_STORE_URL}
      onClick={() => trackEvent(EVENTS.CTA_CLICKED, { location, text: label })}
      className={variant === 'ghost' ? 'btn-ghost' : 'btn-primary'}
    >
      <Apple className="h-5 w-5" />
      {label}
    </a>
  );
}
