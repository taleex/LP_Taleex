import { useContactInfo } from '@/hooks/useContactInfo';
import { useSiteContent } from '@/hooks/useSiteContent';

const Footer = () => {
  const { data } = useContactInfo();
  const { data: siteSettings } = useSiteContent('site');
  const currentYear = new Date().getFullYear();
  const socialLinks = data?.socialLinks || [];

  return (
    <footer className="theme-bg-secondary theme-border border-t">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <div className="text-xl font-bold">
              <span className="text-[#FF6542]">{siteSettings?.site_name_part1 || 'Dev'}</span>
              <span className="theme-text">{siteSettings?.site_name_part2 || 'Portfolio'}</span>
            </div>
            <p className="theme-text-muted text-xs">
              © {currentYear} {siteSettings?.copyright_text || 'All rights reserved'}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary/10 hover:bg-primary theme-text-muted hover:text-primary-foreground p-2 rounded-full transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
