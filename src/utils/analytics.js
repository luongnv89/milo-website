/**
 * Analytics tracking utilities for conversion optimization
 * Integrates with Plausible Analytics for privacy-friendly tracking
 */

/**
 * Track a custom event
 * @param {string} eventName - Name of the event
 * @param {Object} properties - Event properties
 */
export function trackEvent(eventName, properties = {}) {
  // Plausible Analytics
  if (window.plausible) {
    window.plausible(eventName, { props: properties });
  }

  // Console log for development
  if (import.meta.env.DEV) {
    console.log('[Analytics]', eventName, properties);
  }
}

/**
 * Standard event names for consistent tracking
 */
export const EVENTS = {
  // Page views
  PAGE_VIEW: 'Page View',

  // Engagement
  SECTION_VIEW: 'Section Viewed',
  VIDEO_PLAY: 'Video Played',
  VIDEO_COMPLETE: 'Video Completed',

  // CTA clicks
  CTA_CLICKED: 'CTA Clicked',
  NAVBAR_CTA_CLICKED: 'Navbar CTA Clicked',
  FLOATING_CTA_CLICKED: 'Floating CTA Clicked',

  // Navigation
  NAV_LINK_CLICKED: 'Nav Link Clicked',
  ANCHOR_LINK_CLICKED: 'Anchor Link Clicked',

  // Social
  SOCIAL_LINK_CLICKED: 'Social Link Clicked',
};
