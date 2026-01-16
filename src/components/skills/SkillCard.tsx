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
      className="skill-card group relative theme-bg-card border theme-border rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer animate-fade-in-up overflow-hidden"
      style={{ 
        animationDelay: `${categoryIndex * 0.1 + index * 0.02}s`,
        transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'hsl(var(--primary))';
        e.currentTarget.style.boxShadow = 'inset 0 0 20px hsl(var(--primary) / 0.1)';
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '';
        e.currentTarget.style.boxShadow = '';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {hasCustomSVG ? (
        <>
          {skill.svg_url && skill.svg_url_dark ? (
            // Both versions exist - show appropriate for current theme
            <img 
              src={isDarkMode ? skill.svg_url_dark : skill.svg_url} 
              alt={skill.name}
              className="h-10 w-10 mb-2"
            />
          ) : (
            // Only one version exists - use for both themes
            <img 
              src={skill.svg_url || skill.svg_url_dark} 
              alt={skill.name}
              className="h-10 w-10 mb-2"
            />
          )}
        </>
      ) : (
        <IconComponent className="text-4xl mb-2 theme-text" />
      )}
      <span className="text-xs font-medium theme-text-muted text-center">
        {skill.name}
      </span>
    </div>
  );
};

export default SkillCard;
