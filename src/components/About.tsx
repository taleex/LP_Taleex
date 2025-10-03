import ProfileCard from './about/ProfileCard';
import DetailsCard from './about/DetailsCard';
import { useProfile } from '@/hooks/useProfile';
import { usePageSection } from '@/hooks/usePageSections';

const About = () => {
  const { data: profile } = useProfile();
  const { data: aboutSection } = usePageSection('about');
  
  return (
    <section id="about" className="pt-8 pb-20 px-6 lg:px-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">{aboutSection?.title || 'About'}</span>
          </h2>
          {aboutSection?.subtitle && (
            <p className="text-xl theme-text-muted max-w-3xl mx-auto">
              {aboutSection.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <ProfileCard profile={profile} />
          <DetailsCard profile={profile} />
        </div>
      </div>
    </section>
  );
};

export default About;