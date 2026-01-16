import { useScrollToSection } from '@/hooks/useScrollToSection';
import { userProfile } from '@/data/profile';
import FloatingElement from './hero/FloatingElement';
import HeroCTA from './hero/HeroCTA';

const Hero = () => {
  const scrollToSection = useScrollToSection();

  const handleExploreClick = () => scrollToSection('#about');
  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection('#contact');
  };

  // Static hero content - renders instantly, no Supabase loading
  const heroContent = 'Crafting digital experiences with modern technologies.';

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="animate-fade-in [animation-duration:800ms]">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="block theme-text">{userProfile.name}</span>
            <span className="block text-gradient">{userProfile.title}</span>
          </h1>
          
          <p className="text-xl md:text-2xl theme-text-muted mb-8 max-w-2xl mx-auto leading-relaxed">
            {heroContent}
          </p>

          <HeroCTA 
            onExploreClick={handleExploreClick}
            onContactClick={handleContactClick}
          />
        </div>

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
