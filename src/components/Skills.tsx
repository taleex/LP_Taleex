import { useSkills } from '@/hooks/useSkills';
import { usePageSection } from '@/hooks/usePageSections';
import SkillCategoryGrid from './skills/SkillCategoryGrid';

const Skills = () => {
  const { data: skillCategories } = useSkills();
  const { data: skillsSection } = usePageSection('skills');
  
  return (
    <section id="skills" className="py-12 px-6 lg:px-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20 animate-fade-in-up">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">{skillsSection?.title || 'Skills'}</span>
          </h2>
          {skillsSection?.subtitle && (
            <p className="text-xl theme-text-muted max-w-3xl mx-auto">
              {skillsSection.subtitle}
            </p>
          )}
        </div>

        {!skillCategories || skillCategories.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl theme-text-muted">
              No skills available at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {skillCategories.map((category, categoryIndex) => (
              <SkillCategoryGrid
                key={category.title}
                category={category}
                categoryIndex={categoryIndex}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;