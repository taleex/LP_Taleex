import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

const PROJECTS_PER_PAGE = 6;

const ProjectsPage = ({ isChatOpen }: ProjectsPageProps) => {
  const { data: projects } = useProjects();
  const { data: projectsSection } = usePageSection('projects-page');
  const { data: seoSettings } = useSiteContent('seo');
  const [currentPage, setCurrentPage] = useState(1);
  
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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, activeSkills, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const endIndex = startIndex + PROJECTS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 400, behavior: 'auto' });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 400, behavior: 'auto' });
    }
  };

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
                projects={paginatedProjects} 
                activeSkill={activeSkills[0]} 
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-4">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-6 py-3 rounded-full border-2 theme-border theme-text hover:border-[#FF6542] hover:text-[#FF6542] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-inherit disabled:hover:text-inherit transition-all duration-300"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={20} />
                    <span className="font-medium">Previous</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="theme-text-muted text-sm">
                      Page <span className="font-bold text-primary">{currentPage}</span> of <span className="font-bold text-primary">{totalPages}</span>
                    </span>
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-6 py-3 rounded-full border-2 theme-border theme-text hover:border-[#FF6542] hover:text-[#FF6542] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-inherit disabled:hover:text-inherit transition-all duration-300"
                    aria-label="Next page"
                  >
                    <span className="font-medium">Next</span>
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProjectsPage;