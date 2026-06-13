import { useEffect, useRef } from 'react';
import { trackEvent, EVENTS } from '../utils/analytics';

/**
 * Hook to track when a section comes into view
 * @param {string} sectionName - Name of the section to track
 * @returns {Object} - Ref to attach to the section element
 */
export function useInView(sectionName) {
  const ref = useRef(null);
  const hasTracked = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTracked.current) {
          trackEvent(EVENTS.SECTION_VIEW, {
            section: sectionName,
            scrollDepth: Math.round((window.scrollY / document.body.scrollHeight) * 100)
          });
          hasTracked.current = true;
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [sectionName]);

  return ref;
}
