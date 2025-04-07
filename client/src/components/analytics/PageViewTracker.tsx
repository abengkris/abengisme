import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { recordPageView } from '@/lib/api';

/**
 * PageViewTracker Component
 * 
 * This component tracks page views for analytics purposes.
 * It automatically records a page view when a user visits a page and collects
 * additional engagement metrics for SEO optimization.
 * 
 * Features:
 * - Tracks page path, referrer, and user agent
 * - Measures time on page for bounce rate calculation
 * - Tracks viewport size for responsive design analytics
 * - Captures entry point data for funnel analysis
 * 
 * Usage:
 * Place this component in the App.tsx file so it tracks across all pages.
 * <PageViewTracker />
 */
export const PageViewTracker = () => {
  const [location] = useLocation();
  const [entryTime] = useState<Date>(new Date());
  const [isFirstView, setIsFirstView] = useState<boolean>(true);
  
  // Page view tracking mutation
  const pageViewMutation = useMutation({
    mutationFn: recordPageView,
    onError: (error) => {
      console.error('Failed to track page view:', error);
      // Silent error - don't show toast to users as this is background tracking
    }
  });
  
  // Get screen and viewport data
  const getViewportData = () => {
    return {
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio || 1,
    };
  };
  
  // Get page performance data
  const getPerformanceData = () => {
    const perfData: any = {};
    
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      perfData.loadTime = timing.loadEventEnd - timing.navigationStart;
      perfData.domReady = timing.domComplete - timing.domLoading;
      perfData.ttfb = timing.responseStart - timing.navigationStart;
    }
    
    return perfData;
  };
  
  // Track page view on location change
  useEffect(() => {
    const trackPageView = async () => {
      try {
        // Calculate time spent on previous page if this isn't the first view
        const timespentMS = isFirstView ? 0 : new Date().getTime() - entryTime.getTime();
        const timeSpentSeconds = Math.floor(timespentMS / 1000);
        
        // Mark that we've tracked at least one view
        if (isFirstView) {
          setIsFirstView(false);
        }
        
        // Get page title and canonical URL
        const pageTitle = document.title;
        const canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        const canonicalUrl = canonicalElement ? canonicalElement.href : '';
        
        // Collect viewport and performance data
        const viewportData = getViewportData();
        const performanceData = getPerformanceData();
        
        // Track the page view with all collected data
        await pageViewMutation.mutateAsync({
          path: location,
          referrer: document.referrer || '',
          // Session ID and user ID will be added by the server if authenticated
          sessionId: '',
          userAgent: navigator.userAgent,
          metadata: JSON.stringify({
            title: pageTitle,
            canonical: canonicalUrl,
            previousTimeOnPage: timeSpentSeconds,
            entryPoint: sessionStorage.getItem('entry_point') || location,
            isNewSession: isFirstView,
            viewport: viewportData,
            performance: performanceData
          }),
          // The server will set viewedAt, country, city, browser and device
        });
        
        // Store entry point for first-time visitors
        if (isFirstView && typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('entry_point', location);
        }
      } catch (error) {
        // Error already handled in onError
      }
    };
    
    trackPageView();
    
    // Register additional engagement metrics
    const handleBeforeUnload = () => {
      // When user is leaving page, try to send final engagement time
      const timeSpent = Math.floor((new Date().getTime() - entryTime.getTime()) / 1000);
      
      // Use sendBeacon if available for more reliable data collection on page exit
      if (navigator.sendBeacon) {
        const data = {
          path: location,
          timeSpent,
          bounced: timeSpent < 10, // Consider a bounce if less than 10 seconds
        };
        navigator.sendBeacon('/api/analytics/engagement', JSON.stringify(data));
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location, pageViewMutation, isFirstView, entryTime]);
  
  // Component doesn't render anything
  return null;
};

export default PageViewTracker;