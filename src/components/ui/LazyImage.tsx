import React, { ImgHTMLAttributes } from 'react';

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
}

/**
 * Lazy-loaded image component with native lazy loading
 * Improves page load performance by deferring off-screen image loading
 * Falls back to eager loading on browsers without support
 */
const LazyImage = React.forwardRef<HTMLImageElement, LazyImageProps>(
  ({ src, alt, placeholder, ...props }, ref) => {
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        {...props}
      />
    );
  }
);

LazyImage.displayName = 'LazyImage';

export default LazyImage;
