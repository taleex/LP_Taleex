import { Search, Filter, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ProjectCategory } from '@/types/project';

interface ProjectFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: ProjectCategory;
  setActiveCategory: (category: ProjectCategory) => void;
  activeSkills: string[];
  toggleSkill: (skill: string) => void;
  allSkills: string[];
  hasActiveFilters: boolean;
  clearFilters: () => void;
}

const ProjectFilters = ({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  activeSkills,
  toggleSkill,
  allSkills,
  hasActiveFilters,
  clearFilters
}: ProjectFiltersProps) => {
  const categories: ProjectCategory[] = ['All', 'Personal', 'Professional', 'Open Source'];

  return (
    <div className="max-w-xl mx-auto mb-8">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 theme-text-muted" size={18} />
          <input
            type="text"
            placeholder="Search projects by name, description, or technology..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-xl theme-bg-card theme-border border-2 theme-text placeholder:theme-text-muted focus:border-[#FF6542] focus:outline-none transition-colors text-sm"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-center w-12 h-12 shrink-0 rounded-xl theme-bg-card theme-border border-2 theme-text hover:border-[#FF6542] transition-colors">
              <Filter size={18} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            side="bottom"
            alignOffset={0}
            className="w-80 theme-bg-card theme-border border-2 p-4 shadow-xl"
            style={{ backgroundColor: 'hsl(var(--background))' }}
          >
            {/* Category Section */}
            <div className="mb-4">
              <DropdownMenuLabel className="text-sm font-semibold theme-text flex items-center gap-2 px-0 mb-3">
                <div className="w-1 h-4 bg-gradient-to-b from-[#FF6542] to-[#912F40] rounded-full"></div>
                Category
              </DropdownMenuLabel>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                      activeCategory === category
                        ? 'bg-[#FF6542] text-white shadow-md shadow-[#FF6542]/20'
                        : 'theme-bg-muted theme-text hover:bg-[#FF6542]/10 hover:text-[#FF6542]'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <DropdownMenuSeparator className="my-4" />

            {/* Skills Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <DropdownMenuLabel className="text-sm font-semibold theme-text flex items-center gap-2 px-0">
                  <div className="w-1 h-4 bg-gradient-to-b from-[#FF6542] to-[#912F40] rounded-full"></div>
                  Technologies & Skills
                </DropdownMenuLabel>
                {activeSkills.length > 0 && (
                  <span className="text-xs theme-text-muted bg-[#FF6542]/10 px-2 py-0.5 rounded-full font-medium">
                    {activeSkills.length}
                  </span>
                )}
              </div>
              <div className="max-h-[150px] overflow-y-auto pr-1 custom-scrollbar">
                <div className="flex flex-wrap gap-2">
                  {allSkills.map(skill => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                        activeSkills.includes(skill)
                          ? 'bg-[#FF6542] text-white shadow-md shadow-[#FF6542]/20'
                          : 'bg-[#748386]/20 text-[#748386] hover:bg-[#748386]/30'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Clear All Button */}
            {hasActiveFilters && (
              <>
                <DropdownMenuSeparator className="my-4" />
                <button
                  onClick={clearFilters}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#FF6542]/10 text-[#FF6542] hover:bg-[#FF6542]/20 transition-colors border border-[#FF6542]/30 text-sm font-medium"
                >
                  <X size={16} />
                  Clear All Filters
                </button>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ProjectFilters;
