import React from 'react';
import { MANUAL_ADS } from '@/lib/adConfig';
import { cn } from '@/lib/utils';

export type ManualAdType = 'header' | 'sidebar' | 'inContent' | 'footer';

interface ManualAdUnitProps {
  type: ManualAdType;
  index?: number; // For inContent ads that have multiple options
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Manual Ad Unit Component
 * 
 * This component renders a manually configured advertisement
 * when Google AdSense is disabled. It uses the configurations
 * from adConfig.ts.
 */
const ManualAdUnit: React.FC<ManualAdUnitProps> = ({
  type,
  index = 0,
  className,
  style,
}) => {
  let adConfig;
  
  // Select the appropriate ad configuration based on type
  switch (type) {
    case 'header':
      adConfig = MANUAL_ADS.HEADER;
      break;
    case 'sidebar':
      adConfig = MANUAL_ADS.SIDEBAR;
      break;
    case 'inContent':
      // For in-content ads, we might have multiple options
      // Cycle through them based on the index
      const inContentAds = MANUAL_ADS.IN_CONTENT;
      const adIndex = index % inContentAds.length;
      adConfig = inContentAds[adIndex];
      break;
    case 'footer':
      adConfig = MANUAL_ADS.FOOTER;
      break;
    default:
      // Default to sidebar ad if type is not recognized
      adConfig = MANUAL_ADS.SIDEBAR;
  }
  
  if (!adConfig) {
    return null;
  }
  
  return (
    <div 
      className={cn(
        "manual-ad-container relative block overflow-hidden border border-slate-200 rounded-md",
        className
      )}
      style={style}
    >
      <a 
        href={adConfig.linkUrl} 
        target="_blank" 
        rel="noopener noreferrer sponsored"
        className="block w-full h-full"
      >
        <div className="absolute top-0 right-0 bg-slate-800/70 text-white text-xs px-2 py-1 rounded-bl">
          Ad
        </div>
        <img 
          src={adConfig.imagePath} 
          alt={adConfig.altText} 
          width={adConfig.width} 
          height={adConfig.height}
          className="w-full h-auto object-cover" 
        />
      </a>
    </div>
  );
};

export default ManualAdUnit;