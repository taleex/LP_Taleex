import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Project, ProjectCategory } from '@/types/project';

export const useProjectFilters = (projects: Project[]) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('All');
  const [activeSkills, setActiveSkills] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all unique skills from projects
  const allSkills = useMemo(() => {
    const skillSet = new Set<string>();
    projects.forEach(project => {
      project.technologies.forEach(tech => skillSet.add(tech));
    });
    return Array.from(skillSet).sort();
  }, [projects]);

  // Handle URL skill parameter
  useEffect(() => {
    const urlSkill = searchParams.get('skill');
    if (urlSkill && !activeSkills.includes(urlSkill)) {
      setActiveSkills([urlSkill]);
      setActiveCategory('All');
    }
  }, [searchParams]);

  // Toggle skill filter
  const toggleSkill = (skill: string) => {
    setActiveSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill) 
        : [...prev, skill]
    );
    searchParams.delete('skill');
    setSearchParams(searchParams);
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveCategory('All');
    setActiveSkills([]);
    setSearchQuery('');
    searchParams.delete('skill');
    setSearchParams(searchParams);
  };

  // Filter projects based on category, skills, and search
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
      const matchesSkills = activeSkills.length === 0 || 
        activeSkills.some(skill => 
          project.technologies.some(tech => 
            tech.toLowerCase() === skill.toLowerCase()
          )
        );
      const matchesSearch = !searchQuery || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies.some(tech => 
          tech.toLowerCase().includes(searchQuery.toLowerCase())
        );
      
      return matchesCategory && matchesSkills && matchesSearch;
    });
  }, [projects, activeCategory, activeSkills, searchQuery]);

  const hasActiveFilters = activeCategory !== 'All' || activeSkills.length > 0 || searchQuery !== '';

  return {
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
  };
};
