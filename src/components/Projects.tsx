import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { useProjects } from '@/hooks/useProjects';
import { usePageSection } from '@/hooks/usePageSections';

const Projects = () => {
  const { data: projects } = useProjects();
  const { data: projectsSection } = usePageSection('projects');

  // Show only featured projects
  const featuredProjects = projects?.filter(project => project.featured) || [];

  return (
    <section id="projects" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 animate-fade-in-up">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">{projectsSection?.title || 'Featured Projects'}</span>
          </h2>
          <p className="text-xl theme-text-muted max-w-3xl mx-auto">
            {projectsSection?.subtitle || 'A curated selection of my best work showcasing creativity, technical excellence, and problem-solving skills'}
          </p>
        </div>

        {featuredProjects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl theme-text-muted">
              No featured projects available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <ProjectCard
                key={project.title}
                {...project}
                index={index}
              />
            ))}
          </div>
        )}

        {/* View More Button */}
        <div className="text-center mt-12 animate-fade-in-up">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 bg-transparent theme-border border-2 hover:border-[#FF6542] theme-text hover:text-[#FF6542] px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105"
          >
            <Eye size={20} />
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Projects;
