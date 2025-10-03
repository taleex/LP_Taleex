import { ProjectCard } from '@/components/ui/ProjectCard';
import { Project } from '@/types/project';

interface ProjectsGridProps {
  projects: Project[];
  activeSkill?: string;
}

const ProjectsGrid = ({ projects, activeSkill }: ProjectsGridProps) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl theme-text-muted">
          No projects found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.title}
          {...project}
          index={index}
          skillFilter={activeSkill}
        />
      ))}
    </div>
  );
};

export default ProjectsGrid;
