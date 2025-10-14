import { useGate, useFeatureGate, useStatsigClient } from '@statsig/react-bindings';
import { useCallback } from 'react';

export interface TrackingEvent {
  eventName: string;
  value?: string | number;
  metadata?: Record<string, any>;
}

export const useFlags = () => {
  const client = useStatsigClient();

  // Track custom events
  const trackEvent = useCallback((event: TrackingEvent) => {
    if (!client) return;

    client.logEvent(
      event.eventName,
      event.value,
      event.metadata
    );
  }, [client]);

  // Track section clicks
  const trackSectionClick = useCallback((sectionName: string, elementType?: string) => {
    trackEvent({
      eventName: 'section_click',
      metadata: {
        section: sectionName,
        element: elementType || 'unknown',
        timestamp: new Date().toISOString(),
      },
    });
  }, [trackEvent]);

  // Track section views
  const trackSectionView = useCallback((sectionName: string) => {
    trackEvent({
      eventName: 'section_view',
      metadata: {
        section: sectionName,
        timestamp: new Date().toISOString(),
      },
    });
  }, [trackEvent]);

  // Track button clicks
  const trackButtonClick = useCallback((buttonName: string, location: string) => {
    trackEvent({
      eventName: 'button_click',
      metadata: {
        button: buttonName,
        location,
        timestamp: new Date().toISOString(),
      },
    });
  }, [trackEvent]);

  // Track CTA clicks
  const trackCTAClick = useCallback((ctaName: string, location: string) => {
    trackEvent({
      eventName: 'cta_click',
      metadata: {
        cta: ctaName,
        location,
        timestamp: new Date().toISOString(),
      },
    });
  }, [trackEvent]);

  // Track navigation
  const trackNavigation = useCallback((from: string, to: string) => {
    trackEvent({
      eventName: 'navigation',
      metadata: {
        from,
        to,
        timestamp: new Date().toISOString(),
      },
    });
  }, [trackEvent]);

  // Track link clicks
  const trackLinkClick = useCallback((linkName: string, url: string, location: string) => {
    trackEvent({
      eventName: 'link_click',
      metadata: {
        link: linkName,
        url,
        location,
        timestamp: new Date().toISOString(),
      },
    });
  }, [trackEvent]);

  // Feature flag helper
  const checkGate = useCallback((gateName: string) => {
    if (!client) return false;
    return client.checkGate(gateName);
  }, [client]);

  return {
    trackEvent,
    trackSectionClick,
    trackSectionView,
    trackButtonClick,
    trackCTAClick,
    trackNavigation,
    trackLinkClick,
    checkGate,
    client,
  };
};

// Hook to check a specific feature gate
export const useFeatureFlag = (flagName: string) => {
  const gate = useFeatureGate(flagName);
  return gate.value;
};
