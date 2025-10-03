import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') || 
                     !document.documentElement.classList.contains('light');
      setIsDarkMode(isDark);
    };

    // Initial check
    checkDarkMode();
    
    // Observe changes to the html class attribute
    const observer = new MutationObserver(checkDarkMode);
    
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  };

  return { isDarkMode, toggleTheme };
};
