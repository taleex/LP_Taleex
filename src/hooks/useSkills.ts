import { useQuery } from '@tanstack/react-query';
import { skillCategories } from '@/data/skills';
import * as Icons from 'react-icons/si';
import { CLOUD_ENABLED } from '@/config/cloud';

export const useSkills = () => {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      if (!CLOUD_ENABLED) return skillCategories;
      const { supabase } = await import('@/integrations/supabase/client');
      const sb: any = supabase;
      const { data: categories, error: catError } = await sb
        .from('skill_categories')
        .select('*')
        .order('order_index');
      if (catError) throw catError;

      const { data: skills, error: skillError } = await sb
        .from('skills')
        .select('*')
        .order('order_index');
      if (skillError) throw skillError;

      // Group skills by category
      return (categories || []).map((category: any) => ({
        title: category.name,
        skills: (skills || [])
          .filter((skill: any) => skill.category_id === category.id)
          .map((skill: any) => ({
            name: skill.name,
            // Dynamically get icon from react-icons
            icon: (Icons as any)[skill.icon] || Icons.SiReact,
            svg_url: skill.svg_url,
            svg_url_dark: skill.svg_url_dark
          }))
      }));
    },
    placeholderData: skillCategories,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};
