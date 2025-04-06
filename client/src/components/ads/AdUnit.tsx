import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
  adSlot: string;  // The Google AdSense ad slot ID
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  style?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
  adTest?: boolean; // For testing purposes
}

/**
 * Google AdSense Ad Unit Component
 * 
 * This component renders a Google AdSense advertisement.
 * Make sure to add the AdSense script to the <head> of your document.
 */
const AdUnit: React.FC<AdUnitProps> = ({
  adSlot,
  adFormat = 'auto',
  style = {},
  className = '',
  responsive = true,
  adTest = false,
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  
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
          
          adElement.setAttribute('data-ad-client', import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT_ID || 'ca-pub-xxxxxxxxxxxxxxxx');
          adElement.setAttribute('data-ad-slot', adSlot);
          
          // For testing purposes
          if (adTest) {
            adElement.setAttribute('data-adtest', 'on');
          }
          
          // Append to DOM
          adRef.current.appendChild(adElement);
          
          // Push command to AdSense queue
          (window.adsbygoogle = window.adsbygoogle || []).push({});
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
      className={`ad-container ${className}`}
      style={{
        minHeight: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        overflow: 'hidden',
        ...style
      }}
    />
  );
};

export default AdUnit;

// Extend Window interface to include AdSense
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}