import { useEffect, useState, useRef, memo } from 'react';
import { throttle } from '@/lib/utils';

const ScrollProgress = memo(() => {
  const [progress, setProgress] = useState(0);
  const throttledUpdateRef = useRef<ReturnType<typeof throttle> | null>(null);

  useEffect(() => {
    // Create throttled update function (max once per 16ms = 60 FPS)
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      setProgress(scrolled);
    };

    if (!throttledUpdateRef.current) {
      throttledUpdateRef.current = throttle(updateProgress, 16);
    }

    const handleScroll = () => {
      if (throttledUpdateRef.current) {
        throttledUpdateRef.current();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateProgress(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-muted/20 z-50">
      <div
        className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
});

ScrollProgress.displayName = 'ScrollProgress';

export default ScrollProgress;
