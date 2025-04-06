import { useEffect } from 'react';

interface AdSenseScriptProps {
  clientId?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Google AdSense Script Loader Component
 * 
 * This component loads the Google AdSense script dynamically.
 * It should be placed in the app's main component or layout.
 */
const AdSenseScript: React.FC<AdSenseScriptProps> = ({
  clientId,
  onLoad,
  onError,
}) => {
  useEffect(() => {
    // Check if script already exists
    if (document.getElementById('google-adsense-script')) {
      onLoad?.();
      return;
    }

    const adsenseId = clientId || import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT_ID || '';
    
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
  }, [clientId, onLoad, onError]);
  
  // This component doesn't render anything
  return null;
};

export default AdSenseScript;