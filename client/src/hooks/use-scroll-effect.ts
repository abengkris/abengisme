import { useState, useEffect } from 'react';

interface ScrollEffectOptions {
  hideOnScrollDown?: boolean; // Hide element when scrolling down
  threshold?: number; // Minimum scroll amount to trigger (px)
  bottomOffset?: number; // Offset from bottom to show again (px)
  alwaysShowAtTop?: boolean; // Always show at top of page
}

/**
 * Hook to handle scroll effects for sticky elements
 * - Can hide element when scrolling down and show when scrolling up
 * - Can always show element when at the top of the page
 * - Can show element when scrolling near the bottom of the page
 */
export function useScrollEffect({
  hideOnScrollDown = true,
  threshold = 50,
  bottomOffset = 200,
  alwaysShowAtTop = true,
}: ScrollEffectOptions = {}) {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const atTop = currentScrollY < threshold;
      const atBottom = window.innerHeight + currentScrollY > document.body.scrollHeight - bottomOffset;
      const scrollingDown = currentScrollY > lastScrollY;
      
      // Show at top if option is enabled
      if (alwaysShowAtTop && atTop) {
        setVisible(true);
      } 
      // Regular hide/show logic based on scroll direction
      else if (hideOnScrollDown) {
        if (scrollingDown && currentScrollY > threshold) {
          setVisible(false);
        } else if (!scrollingDown || atBottom) {
          setVisible(true);
        }
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, hideOnScrollDown, threshold, bottomOffset, alwaysShowAtTop]);
  
  return { visible };
}