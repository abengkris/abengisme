import React from 'react';
import { insertAdsInContent } from '@/lib/adUtils';
import AdContainer from '@/components/ads/AdContainer';
import { ADS_ENABLED, AD_PLACEMENTS } from '@/lib/adConfig';
import { useAuth } from '@/hooks/use-auth';

interface AdContentProps {
  children: React.ReactNode;
  containerClassName?: string;
  minContentLength?: number;
}

/**
 * AdContent Component
 * 
 * This component takes content (typically an array of paragraphs or other elements)
 * and strategically inserts ads between them following SEO best practices.
 * 
 * Example usage:
 * <AdContent>
 *   {contentArray.map(paragraph => <p key={...}>{paragraph}</p>)}
 * </AdContent>
 */
const AdContent: React.FC<AdContentProps> = ({
  children,
  containerClassName,
  minContentLength = AD_PLACEMENTS.MIN_CONTENT_LENGTH,
}) => {
  // Use auth hook to check if user is premium
  const { isPremium } = useAuth();
  
  // If ads are disabled or user is premium, just return children
  if (!ADS_ENABLED || isPremium) {
    return <>{children}</>;
  }

  // Count the number of child elements
  const childCount = React.Children.count(children);
  
  // If there are not enough paragraphs for ads, just return the children
  if (childCount < AD_PLACEMENTS.PARAGRAPHS_BETWEEN_ADS + 2) {
    return <>{children}</>;
  }

  // Create the ad component that will be inserted
  const adComponent = (
    <AdContainer position="inContent" className="my-6" />
  );

  // Insert ads between content elements
  const contentWithAds = insertAdsInContent(
    React.Children.toArray(children),
    adComponent,
    AD_PLACEMENTS.PARAGRAPHS_BEFORE_FIRST_AD
  );

  return (
    <div className={containerClassName}>
      {contentWithAds}
    </div>
  );
};

export default AdContent;