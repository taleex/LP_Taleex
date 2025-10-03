import { useQuery } from '@tanstack/react-query';
import { CLOUD_ENABLED } from '@/config/cloud';

export interface PageSection {
  section_key: string;
  title?: string;
  subtitle?: string;
  content?: string;
}

export const usePageSections = () => {
  return useQuery({
    queryKey: ['page-sections'],
    queryFn: async () => {
      if (!CLOUD_ENABLED) return [];
      const { supabase } = await import('@/integrations/supabase/client');
      const sb: any = supabase;
      const { data, error } = await sb
        .from('page_sections')
        .select('*');
      if (error) throw error;
      return (data || []) as PageSection[];
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePageSection = (sectionKey: string) => {
  return useQuery({
    queryKey: ['page-section', sectionKey],
    queryFn: async () => {
      if (!CLOUD_ENABLED) return null;
      const { supabase } = await import('@/integrations/supabase/client');
      const sb: any = supabase;
      const { data, error } = await sb
        .from('page_sections')
        .select('*')
        .eq('section_key', sectionKey)
        .maybeSingle();
      if (error) throw error;
      return data as PageSection | null;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};
