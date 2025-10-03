import SkillCard from './SkillCard';

interface Skill {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SkillCategory {
  title: string;
  skills: Skill[];
}

interface SkillCategoryGridProps {
  category: SkillCategory;
  categoryIndex: number;
}

const SkillCategoryGrid = ({ category, categoryIndex }: SkillCategoryGridProps) => {
  return (
    <div className="animate-fade-in-up" style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
      <h3 className="text-lg font-semibold theme-text mb-4">{category.title}</h3>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-9 gap-4">
        {category.skills.map((skill, skillIndex) => (
          <SkillCard
            key={skill.name}
            skill={skill}
            index={skillIndex}
            categoryIndex={categoryIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default SkillCategoryGrid;
