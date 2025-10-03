import { useQuery } from '@tanstack/react-query';
import { CLOUD_ENABLED } from '@/config/cloud';

export interface SiteContentItem {
  key: string;
  value: string;
  section: string;
}

export const useSiteContent = (section?: string) => {
  return useQuery({
    queryKey: ['site-content', section],
    queryFn: async () => {
      if (!CLOUD_ENABLED) return {};
      const { supabase } = await import('@/integrations/supabase/client');
      const sb: any = supabase;
      
      let query = sb.from('site_content').select('*');
      if (section) {
        query = query.eq('section', section);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      // Convert to key-value object
      return (data || []).reduce((acc: Record<string, string>, item: any) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as Record<string, string>);
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSiteContentValue = (section: string, key: string, defaultValue: string = '') => {
  const { data } = useSiteContent(section);
  return data?.[key] || defaultValue;
};
