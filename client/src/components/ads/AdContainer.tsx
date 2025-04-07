import React from 'react';
import { cn } from '@/lib/utils';
import AdUnit from './AdUnit';
import ManualAdUnit from './ManualAdUnit';
import { ADS_ENABLED, USE_ADSENSE, ADSENSE_SLOTS } from '@/lib/adConfig';
import { useAuth } from '@/hooks/use-auth';

export type AdPosition = 'header' | 'sidebar' | 'inContent' | 'footer';

interface AdContainerProps {
  position: AdPosition;
  className?: string;
  style?: React.CSSProperties;
  contentLength?: number; // Optional content length for conditional rendering
}

/**
 * Universal Ad Container
 * 
 * This component decides whether to display Google AdSense ads or manual ads
 * based on the configuration in adConfig.ts. It also handles responsive sizing
 * and provides a consistent interface for all ad placements.
 */
export function AdContainer({ 
  position, 
  className,
  style,
  contentLength,
}: AdContainerProps) {
  // Use auth hook to check if user is premium
  const { isPremium } = useAuth();
  
  // Don't render anything if ads are disabled or user is premium
  if (!ADS_ENABLED || isPremium) {
    return null;
  }
  
  // Get responsive classes based on position
  const positionClasses = getPositionClasses(position);
  
  // Choose between AdSense and manual ads
  if (USE_ADSENSE) {
    // Map position to AdSense slot
    let adSlot = '';
    let adFormat: 'auto' | 'rectangle' | 'horizontal' | 'vertical' = 'auto';
    
    switch (position) {
      case 'header':
        adSlot = ADSENSE_SLOTS.HEADER;
        adFormat = 'horizontal';
        break;
      case 'sidebar':
        adSlot = ADSENSE_SLOTS.SIDEBAR;
        adFormat = 'rectangle';
        break;
      case 'inContent':
        // Choose a random in-content ad slot
        const inContentSlots = ADSENSE_SLOTS.IN_CONTENT;
        adSlot = inContentSlots[Math.floor(Math.random() * inContentSlots.length)];
        adFormat = 'auto';
        break;
      case 'footer':
        adSlot = ADSENSE_SLOTS.FOOTER;
        adFormat = 'horizontal';
        break;
    }
    
    return (
      <div className={cn(positionClasses, className)} style={style}>
        <AdUnit 
          adSlot={adSlot} 
          adFormat={adFormat}
          responsive={true}
        />
      </div>
    );
  } else {
    // Use manual ads
    return (
      <div className={cn(positionClasses, className)} style={style}>
        <ManualAdUnit 
          type={position}
          // Use a random index for in-content ads for variety
          index={position === 'inContent' ? Math.floor(Math.random() * 10) : 0}
          className={className}
          style={style}
        />
      </div>
    );
  }
}

// Helper function to get appropriate classes for each ad position
function getPositionClasses(position: AdPosition): string {
  switch (position) {
    case 'header':
      return 'w-full h-[90px] md:h-[90px] my-4 overflow-hidden';
    case 'sidebar':
      return 'w-full max-w-[300px] mx-auto my-6 overflow-hidden';
    case 'inContent':
      return 'w-full my-8 overflow-hidden';
    case 'footer':
      return 'w-full h-[250px] my-6 overflow-hidden';
    default:
      return '';
  }
}

export default AdContainer;