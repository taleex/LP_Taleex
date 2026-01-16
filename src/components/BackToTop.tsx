import { useState, useEffect, useRef, memo } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from './ui/button';
import { throttle } from '@/lib/utils';

const BackToTop = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const throttledUpdateRef = useRef<ReturnType<typeof throttle> | null>(null);

  useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(window.scrollY > 500);
    };

    if (!throttledUpdateRef.current) {
      throttledUpdateRef.current = throttle(updateVisibility, 100);
    }

    const handleScroll = () => {
      if (throttledUpdateRef.current) {
        throttledUpdateRef.current();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });
  };

  return (
    <>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 h-12 w-12 rounded-full shadow-lg"
          style={{transition: 'box-shadow 0.3s, transform 0.3s'}}
          onMouseEnter={(e) => {e.currentTarget.style.boxShadow = 'var(--tw-shadow)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
          onMouseLeave={(e) => {e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = '';}}
          size="icon"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </>
  );
});

BackToTop.displayName = 'BackToTop';

export default BackToTop;
