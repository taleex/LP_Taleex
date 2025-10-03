import { useQuery } from '@tanstack/react-query';
import { CLOUD_ENABLED } from '@/config/cloud';

export interface SiteImage {
  image_key: string;
  image_url: string;
  alt_text?: string;
  description?: string;
}

export const useSiteImages = () => {
  return useQuery({
    queryKey: ['site-images'],
    queryFn: async () => {
      if (!CLOUD_ENABLED) return [];
      const { supabase } = await import('@/integrations/supabase/client');
      const sb: any = supabase;
      const { data, error } = await sb
        .from('site_images')
        .select('*');
      if (error) throw error;
      return (data || []) as SiteImage[];
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSiteImage = (imageKey: string) => {
  return useQuery({
    queryKey: ['site-image', imageKey],
    queryFn: async () => {
      if (!CLOUD_ENABLED) return null;
      const { supabase } = await import('@/integrations/supabase/client');
      const sb: any = supabase;
      const { data, error } = await sb
        .from('site_images')
        .select('*')
        .eq('image_key', imageKey)
        .maybeSingle();
      if (error) throw error;
      return data as SiteImage | null;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};
