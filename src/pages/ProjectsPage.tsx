import Header from '@/components/Header';
import PageBackground from '@/components/layout/PageBackground';
import ProjectFilters from '@/components/projects/ProjectFilters';
import ActiveFilters from '@/components/projects/ActiveFilters';
import ProjectsGrid from '@/components/projects/ProjectsGrid';
import SkipToContent from '@/components/SkipToContent';
import { useProjects } from '@/hooks/useProjects';
import { useProjectFilters } from '@/hooks/useProjectFilters';
import { usePageSection } from '@/hooks/usePageSections';
import { useSiteContent } from '@/hooks/useSiteContent';

interface ProjectsPageProps {
  isChatOpen?: boolean;
}

const ProjectsPage = ({ isChatOpen }: ProjectsPageProps) => {
  const { data: projects } = useProjects();
  const { data: projectsSection } = usePageSection('projects-page');
  const { data: seoSettings } = useSiteContent('seo');
  
  const {
    activeCategory,
    setActiveCategory,
    activeSkills,
    toggleSkill,
    searchQuery,
    setSearchQuery,
    allSkills,
    filteredProjects,
    hasActiveFilters,
    clearFilters
  } = useProjectFilters(projects || []);

  return (
    <>
      <SkipToContent />
      <div className="min-h-screen hero-gradient relative">
        <PageBackground />
        <Header className={isChatOpen ? 'md:block hidden' : ''} />
      
        <main id="main-content">
          {/* Header */}
          <div className="pt-20 pb-8 px-6 lg:px-12">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                  <span className="text-gradient">{projectsSection?.title || 'All Projects'}</span>
                </h1>
                <p className="text-xl theme-text-muted max-w-2xl mx-auto mb-6">
                  {projectsSection?.subtitle || `Explore my portfolio of ${projects?.length || 0} projects across different technologies and categories`}
                </p>
              </div>

              <ProjectFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                activeSkills={activeSkills}
                toggleSkill={toggleSkill}
                allSkills={allSkills}
                hasActiveFilters={hasActiveFilters}
                clearFilters={clearFilters}
              />

              <ActiveFilters
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                activeSkills={activeSkills}
                toggleSkill={toggleSkill}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </div>

          {/* Projects Grid */}
          <div className="px-6 lg:px-12 pb-16">
            <div className="max-w-6xl mx-auto">
              <ProjectsGrid 
                projects={filteredProjects} 
                activeSkill={activeSkills[0]} 
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProjectsPage;