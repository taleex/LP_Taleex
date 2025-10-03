import { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, MapPin } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Link } from 'react-router-dom';

interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  type: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

interface ExperienceCardProps {
  experience: Experience;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

const ExperienceCard = ({ experience, index, isExpanded, onToggle }: ExperienceCardProps) => {
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div 
        className="group theme-bg-card backdrop-blur-sm theme-border border-2 rounded-3xl overflow-hidden transition-all duration-500 hover:border-[#FF6542]/30 hover:shadow-2xl hover:shadow-[#FF6542]/10 animate-fade-in-up"
        style={{ animationDelay: `${index * 0.15}s` }}
      >
        <CollapsibleTrigger asChild>
          <div className="p-8 cursor-pointer w-full text-left">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="mb-3">
                  <h3 className="text-2xl md:text-3xl font-bold theme-text mb-2 group-hover:text-[#FF6542] transition-colors">
                    {experience.title}
                  </h3>
                  <span className="text-[#FF6542] font-semibold text-lg">{experience.company}</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 theme-text-muted">
                    <MapPin size={16} />
                    <span className="text-sm">{experience.location}</span>
                  </div>
                  <div className="flex items-center gap-2 theme-text-muted">
                    <Calendar size={16} />
                    <span className="text-sm font-medium">{experience.period}</span>
                  </div>
                  <span className="bg-[#FF6542]/20 text-[#FF6542] px-4 py-1.5 rounded-full text-xs font-semibold">
                    {experience.type}
                  </span>
                </div>

                <p className="theme-text-muted leading-relaxed mb-6">{experience.description}</p>

                <div className="flex flex-wrap gap-2">
                  {experience.technologies.map(tech => (
                    <Link
                      key={tech}
                      to={`/projects?skill=${encodeURIComponent(tech)}`}
                      onClick={(e) => e.stopPropagation()}
                      className="skill-tag text-xs cursor-pointer hover:scale-110 hover:shadow-lg hover:shadow-[#FF6542]/30 active:scale-95 transition-all duration-300"
                    >
                      {tech}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center lg:justify-end">
                <div className="w-10 h-10 rounded-full theme-bg-muted flex items-center justify-center group-hover:bg-[#FF6542]/20 transition-colors duration-300">
                  {isExpanded ? (
                    <ChevronUp size={20} className="theme-text-muted group-hover:text-[#FF6542]" />
                  ) : (
                    <ChevronDown size={20} className="theme-text-muted group-hover:text-[#FF6542]" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden will-change-[height,opacity] data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <div 
            className="px-8 pb-8 pt-4 theme-border border-t-2 cursor-pointer hover:bg-[#FF6542]/5 transition-colors"
            onClick={onToggle}
          >
            <h4 className="text-xl font-bold theme-text mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-[#FF6542] to-[#912F40] rounded-full"></div>
              Key Achievements
            </h4>
            <ul className="space-y-4">
              {experience.achievements.map((achievement, achIndex) => (
                <li key={achIndex} className="flex items-start gap-4 theme-text-muted group/item hover:theme-text transition-colors">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF6542] mt-2 flex-shrink-0 group-hover/item:scale-125 transition-transform"></div>
                  <span className="leading-relaxed">{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default ExperienceCard;
