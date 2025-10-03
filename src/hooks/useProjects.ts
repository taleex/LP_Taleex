import { useQuery } from '@tanstack/react-query';
import { projects } from '@/data/projects';
import { Project } from '@/types/project';
import { CLOUD_ENABLED } from '@/config/cloud';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      if (!CLOUD_ENABLED) return projects;
      const { supabase } = await import('@/integrations/supabase/client');
      const sb: any = supabase;
      const { data, error } = await sb
        .from('projects')
        .select('*')
        .order('order_index');
      if (error) throw error;
      return (data || []).map((project: any) => ({
        title: project.title,
        category: project.category || 'Professional',
        description: project.description,
        image: project.image_url || '/placeholder.svg',
        technologies: project.tags,
        github: project.github_url || undefined,
        live: project.demo_url || undefined,
        featured: project.featured,
      } as Project));
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};
