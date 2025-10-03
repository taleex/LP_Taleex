import { X } from 'lucide-react';
import { ProjectCategory } from '@/types/project';

interface ActiveFiltersProps {
  activeCategory: ProjectCategory;
  setActiveCategory: (category: ProjectCategory) => void;
  activeSkills: string[];
  toggleSkill: (skill: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  hasActiveFilters: boolean;
}

const ActiveFilters = ({
  activeCategory,
  setActiveCategory,
  activeSkills,
  toggleSkill,
  searchQuery,
  setSearchQuery,
  hasActiveFilters
}: ActiveFiltersProps) => {
  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-sm theme-text-muted font-medium">Active filters:</span>
      
      {activeCategory !== 'All' && (
        <span className="inline-flex items-center gap-2 bg-[#FF6542]/20 text-[#FF6542] px-3 py-1 rounded-full text-sm font-medium border border-[#FF6542]/30">
          {activeCategory}
          <X
            size={14}
            className="cursor-pointer hover:scale-110 transition-transform"
            onClick={() => setActiveCategory('All')}
          />
        </span>
      )}
      
      {activeSkills.map(skill => (
        <span
          key={skill}
          className="inline-flex items-center gap-2 bg-[#FF6542]/20 text-[#FF6542] px-3 py-1 rounded-full text-sm font-medium border border-[#FF6542]/30"
        >
          {skill}
          <X
            size={14}
            className="cursor-pointer hover:scale-110 transition-transform"
            onClick={() => toggleSkill(skill)}
          />
        </span>
      ))}
      
      {searchQuery && (
        <span className="inline-flex items-center gap-2 bg-[#FF6542]/20 text-[#FF6542] px-3 py-1 rounded-full text-sm font-medium border border-[#FF6542]/30">
          Search: "{searchQuery}"
          <X
            size={14}
            className="cursor-pointer hover:scale-110 transition-transform"
            onClick={() => setSearchQuery('')}
          />
        </span>
      )}
    </div>
  );
};

export default ActiveFilters;
