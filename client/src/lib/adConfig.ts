/**
 * Advertisement Configuration
 * 
 * This file contains settings for controlling ad display throughout the application.
 * Toggle between Google AdSense and manual ads, or disable ads completely.
 */

// Master switch for enabling/disabling all ads throughout the app
export const ADS_ENABLED = true;

// Toggle between Google AdSense ads and manual ads
export const USE_ADSENSE = false; // Set to false to use manual ads instead of Google AdSense

// Your AdSense publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
export const ADSENSE_CLIENT_ID = ""; // Add your AdSense client ID here

// Manual ad configurations (used when USE_ADSENSE is false)
export const MANUAL_ADS = {
  // Header ad (displayed at the top of the page)
  HEADER: {
    imagePath: "/images/ads/header-ad.jpg",
    altText: "Advertisement for premium web hosting services",
    linkUrl: "https://example.com/premium-hosting",
    width: 728,
    height: 90,
  },
  
  // Sidebar ad (displayed in the sidebar)
  SIDEBAR: {
    imagePath: "/images/ads/sidebar-ad.jpg",
    altText: "Try our new design tools",
    linkUrl: "https://example.com/design-tools",
    width: 300,
    height: 250,
  },
  
  // In-content ads (displayed between paragraphs)
  IN_CONTENT: [
    {
      imagePath: "/images/ads/content-ad-1.jpg",
      altText: "Learn web development",
      linkUrl: "https://example.com/web-dev-course",
      width: 580,
      height: 400,
    },
    {
      imagePath: "/images/ads/content-ad-2.jpg",
      altText: "Premium WordPress themes",
      linkUrl: "https://example.com/wp-themes",
      width: 580,
      height: 400,
    }
  ],
  
  // Footer ad (displayed at the bottom of the page)
  FOOTER: {
    imagePath: "/images/ads/footer-ad.jpg",
    altText: "Subscribe to our newsletter",
    linkUrl: "https://example.com/newsletter",
    width: 970,
    height: 250,
  }
};

// Google AdSense slot IDs (used when USE_ADSENSE is true)
export const ADSENSE_SLOTS = {
  HEADER: "1234567890",
  SIDEBAR: "2345678901",
  IN_CONTENT: ["3456789012", "4567890123"],
  FOOTER: "5678901234",
};

// Ad placement rules for SEO optimization
export const AD_PLACEMENTS = {
  // Minimum number of paragraphs before first in-content ad
  PARAGRAPHS_BEFORE_FIRST_AD: 3,
  
  // Number of paragraphs between ads
  PARAGRAPHS_BETWEEN_ADS: 4,
  
  // Maximum number of ads per page for SEO
  MAX_ADS_PER_PAGE: 3,
  
  // Minimum content length in characters to show ads
  MIN_CONTENT_LENGTH: 500,
};