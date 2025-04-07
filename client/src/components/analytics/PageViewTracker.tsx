import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { recordPageView } from '@/lib/api';

/**
 * PageViewTracker Component
 * 
 * This component tracks page views for analytics purposes.
 * It automatically records a page view when a user visits a page.
 * 
 * Usage:
 * Place this component in the App.tsx file so it tracks across all pages.
 * <PageViewTracker />
 */
export const PageViewTracker = () => {
  const [location] = useLocation();
  
  // Page view tracking mutation
  const pageViewMutation = useMutation({
    mutationFn: recordPageView,
    onError: (error) => {
      console.error('Failed to track page view:', error);
      // Silent error - don't show toast to users as this is background tracking
    }
  });
  
  // Track page view on location change
  useEffect(() => {
    const trackPageView = async () => {
      try {
        await pageViewMutation.mutateAsync({
          path: location,
          referrer: document.referrer || '',
          // Session ID and user ID will be added by the server if authenticated
          sessionId: '',
          userAgent: navigator.userAgent,
          // The server will set viewedAt, country, city, browser and device
        });
      } catch (error) {
        // Error already handled in onError
      }
    };
    
    trackPageView();
  }, [location, pageViewMutation]);
  
  // Component doesn't render anything
  return null;
};

export default PageViewTracker;