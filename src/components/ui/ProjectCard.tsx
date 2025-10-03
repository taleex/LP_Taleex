import { ExternalLink, Github } from 'lucide-react';
import { GlowCard } from '@/components/ui/spotlight-card';

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
  return (
    <GlowCard
      glowColor="primary"
      customSize={true}
      className="w-full h-full theme-bg-card backdrop-blur-sm animate-fade-in-up group flex flex-col"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Project Image */}
      <div className="relative overflow-hidden rounded-lg flex-shrink-0">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
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

      {/* Project Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          {live ? (
            <a 
              href={live}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <h3 className="text-xl font-bold theme-text group-hover:text-primary transition-colors mb-2 line-clamp-2 cursor-pointer">
                {title}
              </h3>
            </a>
          ) : (
            <h3 className="text-xl font-bold theme-text group-hover:text-primary transition-colors mb-2 line-clamp-2">
              {title}
            </h3>
          )}
          <span className="inline-block text-xs theme-text-muted bg-muted/20 px-3 py-1 rounded-full mb-3">
            {category}
          </span>

          <p className="theme-text-muted text-sm mb-4 leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {technologies.map((tech) => (
            <span 
              key={tech}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                skillFilter && tech.toLowerCase().includes(skillFilter.toLowerCase())
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105'
                  : 'bg-muted/30 theme-text-muted hover:bg-muted/40 hover:scale-105'
              }`}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </GlowCard>
  );
};
