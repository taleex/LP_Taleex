import { useState, useEffect, useRef } from 'react';
import { throttle } from '@/lib/utils';

export const useScrollTracking = () => {
  const [scrollY, setScrollY] = useState(0);
  const throttledUpdateRef = useRef<ReturnType<typeof throttle> | null>(null);

  useEffect(() => {
    // Create throttled scroll update (max once per 100ms = ~10 FPS for scroll tracking)
    const updateScroll = () => {
      setScrollY(window.scrollY);
    };

    if (!throttledUpdateRef.current) {
      throttledUpdateRef.current = throttle(updateScroll, 100);
    }

    const handleScroll = () => {
      if (throttledUpdateRef.current) {
        throttledUpdateRef.current();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollY;
};
