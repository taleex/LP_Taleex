import { ExternalLink, Github } from 'lucide-react';
import { GlowCard } from '@/components/ui/spotlight-card';
import LazyImage from '@/components/ui/LazyImage';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProjectCardProps {
  title: string;
  category: string;
  description: string;
  image: string;
  technologies: string[];
  github?: string;
  live?: string;
  featured?: boolean;
  index: number;
  skillFilter?: string;
}

export const ProjectCard = ({ 
  title, 
  category, 
  description, 
  image, 
  technologies, 
  github, 
  live, 
  featured,
  index,
  skillFilter
}: ProjectCardProps) => {
  // Show max 6 skills, rest in tooltip
  const maxVisibleSkills = 6;
  const visibleTechs = technologies.slice(0, maxVisibleSkills);
  const hiddenTechs = technologies.slice(maxVisibleSkills);
  const hasMoreTechs = hiddenTechs.length > 0;

  return (
    <GlowCard
      glowColor="primary"
      customSize={true}
      touchAction="pan-y"
      className="w-full theme-bg-card backdrop-blur-sm animate-fade-in-up group"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex flex-col h-full">
        {/* Project Image - Fixed Height */}
        <div className="relative overflow-hidden rounded-lg flex-shrink-0 h-48">
          <LazyImage 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Project Links */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="theme-bg-card-solid backdrop-blur-sm theme-text p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="View on GitHub"
              >
                <Github size={16} />
              </a>
            )}
            {live && (
              <a
                href={live}
                target="_blank"
                rel="noopener noreferrer"
                className="theme-bg-card-solid backdrop-blur-sm theme-text p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="View live demo"
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>

        {/* Project Content - Rigid Structure */}
        <div className="p-6 flex flex-col flex-grow gap-2">
          {/* Title - Max 2 lines */}
          <div className="overflow-hidden">
            {live ? (
              <a 
                href={live}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <h3 className="text-xl font-bold theme-text group-hover:text-primary transition-colors line-clamp-2 leading-7 cursor-pointer">
                  {title}
                </h3>
              </a>
            ) : (
              <h3 className="text-xl font-bold theme-text group-hover:text-primary transition-colors line-clamp-2 leading-7">
                {title}
              </h3>
            )}
          </div>

          {/* Category Badge */}
          <div className="flex items-center">
            <span className="inline-block text-xs theme-text-muted bg-muted/20 px-3 py-1 rounded-full">
              {category}
            </span>
          </div>

          {/* Description - Max 3 lines */}
          <div className="overflow-hidden">
            <p className="theme-text-muted text-sm leading-relaxed line-clamp-3">
              {description}
            </p>
          </div>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 content-start mt-2">
            {visibleTechs.map((tech) => (
              <span 
                key={tech}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 h-fit ${
                  skillFilter && tech.toLowerCase().includes(skillFilter.toLowerCase())
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105'
                    : 'bg-muted/30 theme-text-muted hover:bg-muted/40 hover:scale-105'
                }`}
              >
                {tech}
              </span>
            ))}
            {hasMoreTechs && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-muted/30 theme-text-muted hover:bg-muted/40 cursor-help h-fit">
                      +{hiddenTechs.length} more
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="flex flex-wrap gap-2 max-w-xs">
                      {hiddenTechs.map((tech) => (
                        <span 
                          key={tech}
                          className="px-2 py-1 rounded text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>
    </GlowCard>
  );
};
