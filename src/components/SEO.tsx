import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useProfile } from '@/hooks/useProfile';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

const SEO = ({
  title,
  description,
  keywords,
  author,
  ogImage,
  canonicalUrl
}: SEOProps) => {
  const location = useLocation();
  const { data: seoSettings } = useSiteContent('seo');
  const { data: profile } = useProfile();
  
  const finalTitle = title || seoSettings?.default_title || 'DevPortfolio - Professional Web Developer';
  const finalDescription = description || seoSettings?.default_description || 'Professional web developer portfolio showcasing modern React applications, full-stack projects, and innovative digital solutions.';
  const finalKeywords = keywords || seoSettings?.default_keywords || 'web developer, react developer, full-stack developer, portfolio, javascript, typescript';
  const finalAuthor = author || profile?.name || seoSettings?.default_author || 'Alex Johnson';
  const finalOgImage = ogImage || seoSettings?.og_image || '/placeholder.svg';
  const currentUrl = canonicalUrl || `${window.location.origin}${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = finalTitle;

    // Update meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Standard meta tags
    updateMetaTag('description', finalDescription);
    updateMetaTag('keywords', finalKeywords);
    updateMetaTag('author', finalAuthor);

    // Open Graph meta tags
    updateMetaTag('og:title', finalTitle, true);
    updateMetaTag('og:description', finalDescription, true);
    updateMetaTag('og:image', finalOgImage, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:type', 'website', true);

    // Twitter Card meta tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', finalTitle);
    updateMetaTag('twitter:description', finalDescription);
    updateMetaTag('twitter:image', finalOgImage);

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);

  }, [finalTitle, finalDescription, finalKeywords, finalAuthor, finalOgImage, currentUrl]);

  return null;
};

export default SEO;
