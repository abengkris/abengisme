import { useEffect } from 'react';
import { ADS_ENABLED, USE_ADSENSE, ADSENSE_CLIENT_ID } from '@/lib/adConfig';

interface AdSenseScriptProps {
  clientId?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  forceLoad?: boolean; // For testing or special cases
}

/**
 * Google AdSense Script Loader Component
 * 
 * This component loads the Google AdSense script dynamically based on configuration.
 * It should be placed in the app's main component or layout.
 */
const AdSenseScript: React.FC<AdSenseScriptProps> = ({
  clientId,
  onLoad,
  onError,
  forceLoad = false,
}) => {
  useEffect(() => {
    // Only load if ads are enabled and AdSense is enabled (or forced for testing)
    if (!ADS_ENABLED || (!USE_ADSENSE && !forceLoad)) {
      return;
    }

    // Check if script already exists
    if (document.getElementById('google-adsense-script')) {
      onLoad?.();
      return;
    }

    const adsenseId = clientId || ADSENSE_CLIENT_ID || import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT_ID || '';
    
    if (!adsenseId) {
      console.warn('Google AdSense client ID not provided');
      return;
    }

    try {
      // Create script element
      const script = document.createElement('script');
      script.id = 'google-adsense-script';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`;
      
      // Add event listeners
      script.onload = () => {
        console.log('Google AdSense script loaded successfully');
        onLoad?.();
      };
      
      script.onerror = (error) => {
        console.error('Error loading Google AdSense script:', error);
        onError?.(new Error('Failed to load Google AdSense script'));
      };
      
      // Append to document head
      document.head.appendChild(script);
      
      // Cleanup function
      return () => {
        // We don't remove the script on unmount as it should persist throughout the app
      };
    } catch (error) {
      console.error('Error setting up Google AdSense:', error);
      onError?.(error instanceof Error ? error : new Error('Unknown error'));
    }
  }, [clientId, onLoad, onError, forceLoad]);
  
  // This component doesn't render anything
  return null;
};

export default AdSenseScript;