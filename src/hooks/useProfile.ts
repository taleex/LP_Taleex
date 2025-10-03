import { useQuery } from '@tanstack/react-query';
import { userProfile } from '@/data/profile';
import { CLOUD_ENABLED } from '@/config/cloud';

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!CLOUD_ENABLED) return userProfile;
      const { supabase } = await import('@/integrations/supabase/client');
      const sb: any = supabase;
      const { data, error } = await sb
        .from('profiles')
        .select('*')
        .maybeSingle();
      if (error) throw error;
      const row: any = data;
      return {
        name: row?.display_name || userProfile.name,
        title: row?.title || userProfile.title,
        avatar: row?.avatar_url || userProfile.avatar,
        location: row?.location || userProfile.location,
        email: row?.email || userProfile.email,
        interests: row?.interests || userProfile.interests,
        description: row?.bio ? String(row.bio).split('\n\n') : userProfile.description,
        experience: row?.experience_years ? `${row.experience_years}+ Years` : userProfile.experience,
        tags: row?.tags && row.tags.length > 0 ? row.tags : userProfile.tags
      };
    },
    // Fallback to static data if query fails
    placeholderData: userProfile,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
