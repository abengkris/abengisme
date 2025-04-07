import React from 'react';
import { AD_PLACEMENTS } from './adConfig';

/**
 * Utility functions for handling ad placement and optimization
 */

/**
 * Insert ads between paragraphs in content
 * This follows SEO best practices for content/ad ratio
 * 
 * @param children Array of React elements (typically paragraphs)
 * @param adComponent The ad component to insert
 * @param startAfter Number of paragraphs to skip before first ad
 * @returns Array with content and ads interleaved
 */
export function insertAdsInContent(
  children: React.ReactNode[],
  adComponent: React.ReactElement,
  startAfter: number = AD_PLACEMENTS.PARAGRAPHS_BETWEEN_ADS
): React.ReactNode[] {
  // Don't insert ads if there's too little content
  if (!children || children.length < startAfter + 2) {
    return children;
  }

  const result: React.ReactNode[] = [];
  let adCount = 0;
  const maxAds = AD_PLACEMENTS.MAX_ADS_PER_PAGE;
  
  children.forEach((child, index) => {
    result.push(child);
    
    // Insert ad after every X paragraphs, skipping the first few
    // Only add up to the maximum allowed number of ads
    if (
      index > 0 && 
      index >= startAfter && 
      (index - startAfter) % AD_PLACEMENTS.PARAGRAPHS_BETWEEN_ADS === 0 && 
      adCount < maxAds &&
      // Don't add ad after the last paragraph
      index < children.length - 1
    ) {
      // Create a unique key for each ad instance
      result.push(React.cloneElement(adComponent, { 
        key: `content-ad-${index}`
      }));
      adCount++;
    }
  });
  
  return result;
}

/**
 * Count the approximate reading time of a piece of content
 * Can be used to determine if content is substantial enough for ads
 * 
 * @param content Text content to analyze
 * @param wordsPerMinute Reading speed (default: 200)
 * @returns Reading time in minutes
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime > 0 ? readingTime : 1; // Minimum 1 minute
}

/**
 * Check if content is substantial enough for ads
 * Helps maintain a good content-to-ad ratio for SEO
 * 
 * @param content Text content to analyze
 * @returns Boolean indicating if content meets minimum length
 */
export function isContentSubstantial(content: string): boolean {
  return content.length >= AD_PLACEMENTS.MIN_CONTENT_LENGTH;
}

/**
 * Sanitize ad slot configuration to ensure it meets requirements
 * 
 * @param slotId Ad slot ID to verify
 * @returns Boolean indicating if the slot ID is valid
 */
export function isValidAdSlot(slotId: string): boolean {
  // Basic validation for AdSense slot IDs
  return /^\d{10}$/.test(slotId);
}