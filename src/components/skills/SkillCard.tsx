import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '@/hooks/useDarkMode';

interface Skill {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  svg_url?: string | null;
  svg_url_dark?: string | null;
}

interface SkillCardProps {
  skill: Skill;
  index: number;
  categoryIndex: number;
}

const SkillCard = ({ skill, index, categoryIndex }: SkillCardProps) => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const IconComponent = skill.icon;

  const handleSkillClick = () => {
    navigate(`/projects?skill=${encodeURIComponent(skill.name)}`);
  };

  // Determine which icon to use
  const hasCustomSVG = skill.svg_url || skill.svg_url_dark;

  return (
    <div
      onClick={handleSkillClick}
      className="skill-card group relative theme-bg-card backdrop-blur-sm border theme-border hover:border-primary rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/20 animate-fade-in-up overflow-hidden"
      style={{ 
        animationDelay: `${categoryIndex * 0.1 + index * 0.02}s`
      }}
    >
      {hasCustomSVG ? (
        <>
          {skill.svg_url && skill.svg_url_dark ? (
            // Both versions exist - show appropriate for current theme
            <img 
              src={isDarkMode ? skill.svg_url_dark : skill.svg_url} 
              alt={skill.name}
              className="h-10 w-10 mb-2 group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            // Only one version exists - use for both themes
            <img 
              src={skill.svg_url || skill.svg_url_dark} 
              alt={skill.name}
              className="h-10 w-10 mb-2 group-hover:scale-110 transition-transform duration-300"
            />
          )}
        </>
      ) : (
        <IconComponent className="text-4xl mb-2 theme-text group-hover:scale-110 transition-transform duration-300" />
      )}
      <span className="text-xs font-medium theme-text-muted group-hover:theme-text text-center transition-colors duration-300">
        {skill.name}
      </span>
    </div>
  );
};

export default SkillCard;
