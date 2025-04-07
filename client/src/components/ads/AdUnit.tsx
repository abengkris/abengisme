import React, { useEffect, useRef } from 'react';
import { ADS_ENABLED, USE_ADSENSE, ADSENSE_CLIENT_ID } from '@/lib/adConfig';
import { cn } from '@/lib/utils';

interface AdUnitProps {
  adSlot: string;  // The Google AdSense ad slot ID
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  style?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
  adTest?: boolean; // For testing purposes
  fallbackContent?: React.ReactNode; // Fallback content if AdSense isn't available
}

/**
 * Google AdSense Ad Unit Component
 * 
 * This component renders a Google AdSense advertisement based on configuration.
 * It handles responsiveness and displays properly in various layouts.
 */
const AdUnit: React.FC<AdUnitProps> = ({
  adSlot,
  adFormat = 'auto',
  style = {},
  className = '',
  responsive = true,
  adTest = false,
  fallbackContent,
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  
  // Don't render if ads are disabled globally or AdSense is disabled
  if (!ADS_ENABLED || !USE_ADSENSE) {
    return fallbackContent ? <>{fallbackContent}</> : null;
  }
  
  useEffect(() => {
    // Wait for AdSense script to load
    if (adRef.current && adSlot) {
      try {
        // Clear previous ad if exists
        if (adRef.current.innerHTML !== '') {
          adRef.current.innerHTML = '';
        }

        // Wait for the Google AdSense code to be available
        if (window.adsbygoogle) {
          const adElement = document.createElement('ins');
          
          // Add AdSense attributes
          adElement.className = 'adsbygoogle';
          adElement.style.display = 'block';
          
          // Set ad parameters
          if (responsive) {
            adElement.setAttribute('data-ad-format', adFormat);
          }
          
          const clientId = ADSENSE_CLIENT_ID || import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT_ID || '';
          
          if (!clientId) {
            console.warn('AdSense client ID not found. Configure it in adConfig.ts or as an environment variable.');
            return;
          }
          
          adElement.setAttribute('data-ad-client', clientId);
          adElement.setAttribute('data-ad-slot', adSlot);
          
          // For testing purposes
          if (adTest) {
            adElement.setAttribute('data-adtest', 'on');
          }
          
          // Append to DOM
          adRef.current.appendChild(adElement);
          
          // Push command to AdSense queue
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } else {
          console.warn('AdSense script not loaded properly. Check that AdSenseScript component is included in your layout.');
        }
      } catch (error) {
        console.error('Error loading AdSense ad:', error);
      }
    }
    
    // Cleanup
    return () => {
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
  }, [adSlot, adFormat, responsive, adTest]);
  
  return (
    <div 
      ref={adRef} 
      className={cn(
        "adsense-container", 
        "flex justify-center items-center bg-slate-50/50 overflow-hidden min-h-[100px]",
        className
      )}
      style={style}
      aria-label="Advertisement"
    >
      <span className="text-xs text-gray-400">Advertisement</span>
    </div>
  );
};

export default AdUnit;

// Extend Window interface to include AdSense
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}