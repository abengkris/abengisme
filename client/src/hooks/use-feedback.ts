
import { useToast } from './use-toast';
import { useEffect } from 'react';

export const useFeedback = () => {
  const { toast } = useToast();

  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const playSound = (type: 'success' | 'error' | 'info' = 'info') => {
    const audio = new Audio(`/sounds/${type}.mp3`);
    audio.play().catch(() => {}); // Fail silently if audio blocked
  };

  return {
    triggerHaptic,
    playSound,
    showToast: toast
  };
};
