import { useState } from 'react';
import { useExperiences } from '@/hooks/useExperiences';
import { usePageSection } from '@/hooks/usePageSections';
import ExperienceCard from './experience/ExperienceCard';

const Experience = () => {
  const { data: experiences } = useExperiences();
  const { data: experienceSection } = usePageSection('experience');
  const [expandedJob, setExpandedJob] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedJob(expandedJob === index ? null : index);
  };

  return (
    <section
      id="experience"
      className="section-padding relative flex min-h-screen items-center overflow-hidden pt-32 lg:pt-40"
    >
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="text-center mb-20 animate-fade-in-up">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">{experienceSection?.title || 'Work Experience'}</span>
          </h2>
          {experienceSection?.subtitle && (
            <p className="text-xl theme-text-muted max-w-3xl mx-auto">
              {experienceSection.subtitle}
            </p>
          )}
        </div>

        {!experiences || experiences.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl theme-text-muted">
              No work experience available at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <ExperienceCard
                key={index}
                experience={exp}
                index={index}
                isExpanded={expandedJob === index}
                onToggle={() => toggleExpand(index)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
