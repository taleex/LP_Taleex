import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '@/components/ui/sidebar';
import { Menu } from 'lucide-react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useSiteContent } from '@/hooks/useSiteContent';

interface HeaderProps {
  className?: string;
}

const Header = ({ className = '' }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const { isDarkMode } = useDarkMode();
  const { data: siteSettings } = useSiteContent('site');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? isDarkMode 
            ? 'bg-[#0A0908]/95 backdrop-blur-lg border-b border-[#748386]/20' 
            : 'bg-white/95 backdrop-blur-lg border-b border-gray-200'
          : 'bg-transparent'
      } ${className}`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          {/* Left Group: Sidebar Toggle + Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isDarkMode 
                  ? 'text-[#FFFFFA] hover:text-[#FF6542] hover:bg-[#FF6542]/10' 
                  : 'text-[#0A0908] hover:text-[#FF6542] hover:bg-[#FF6542]/10'
              }`}
              aria-label="Toggle sidebar"
            >
              <Menu size={24} />
            </button>

            <button 
              onClick={() => {
                if (window.location.pathname === '/') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  navigate('/');
                }
              }}
              className="text-2xl font-bold cursor-pointer hover:opacity-80 transition-opacity duration-300"
            >
              <span className="text-[#FF6542]">Tal</span>
              <span className={isDarkMode ? "text-[#FFFFFA]" : "text-[#0A0908]"}>eex</span>
            </button>
          </div>

          {/* Download CV Button */}
          <a
            href="/cv.pdf"
            download
            className="bg-[#FF6542] hover:bg-[#912F40] text-white px-4 sm:px-6 py-2 rounded-full transition-colors duration-300 text-sm font-medium"
          >
            Download CV
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
