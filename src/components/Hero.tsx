import { useProfile } from '@/hooks/useProfile';
import { useScrollToSection } from '@/hooks/useScrollToSection';
import { usePageSection } from '@/hooks/usePageSections';
import FloatingElement from './hero/FloatingElement';
import HeroCTA from './hero/HeroCTA';

interface HeroProps {
  scrollY: number;
}

const Hero = ({ scrollY }: HeroProps) => {
  const { data: profile } = useProfile();
  const { data: heroSection } = usePageSection('hero');
  const scrollToSection = useScrollToSection();

  const handleExploreClick = () => scrollToSection('#about');
  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection('#contact');
  };

  const isLoading = !profile || !heroSection;

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {!isLoading && (
          <div className="animate-fade-in [animation-duration:800ms]">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="block theme-text">{profile.name}</span>
              <span className="block text-gradient">{profile.title}</span>
            </h1>
            
            <p className="text-xl md:text-2xl theme-text-muted mb-8 max-w-2xl mx-auto leading-relaxed">
              {heroSection.content}
            </p>

            <HeroCTA 
              onExploreClick={handleExploreClick}
              onContactClick={handleContactClick}
            />
          </div>
        )}

        <FloatingElement 
          className="top-1/4 left-10 opacity-20"
          color="bg-primary"
          size="medium"
        />
        <FloatingElement 
          className="top-1/3 right-16 opacity-30"
          style={{ animationDelay: '2s' }}
          color="bg-secondary"
          size="large"
        />
        <FloatingElement 
          className="bottom-1/4 left-1/4 opacity-25"
          style={{ animationDelay: '4s' }}
          color="bg-muted"
          size="small"
        />
      </div>
    </section>
  );
};

export default Hero;
