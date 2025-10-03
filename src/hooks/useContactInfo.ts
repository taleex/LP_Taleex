import { useQuery } from '@tanstack/react-query';
import { contactInfo, socialLinks } from '@/data/contact';
import * as LucideIcons from 'lucide-react';
import { CLOUD_ENABLED } from '@/config/cloud';

export const useContactInfo = () => {
  return useQuery({
    queryKey: ['contact-info'],
    queryFn: async () => {
      if (!CLOUD_ENABLED) return { socialLinks, contactInfo };
      const { supabase } = await import('@/integrations/supabase/client');
      const sb: any = supabase;
      const { data, error } = await sb
        .from('contact_info')
        .select('*')
        .order('order_index');
      if (error) throw error;

      // Separate social links and contact info
      const social = (data || []).filter((item: any) => item.type === 'social').map((item: any) => ({
        icon: (LucideIcons as any)[item.icon_name] || LucideIcons.Mail,
        href: item.link || item.value,
        label: item.label
      }));

      const info = (data || []).filter((item: any) => item.type === 'contact').reduce((acc: Record<string, string>, item: any) => {
        acc[String(item.label).toLowerCase()] = item.value;
        return acc;
      }, {} as Record<string, string>);

      return {
        socialLinks: social.length > 0 ? social : socialLinks,
        contactInfo: Object.keys(info).length > 0 ? {
          email: info.email || contactInfo.email,
          phone: info.phone || contactInfo.phone,
          location: info.location || contactInfo.location
        } : contactInfo
      };
    },
    placeholderData: { socialLinks, contactInfo },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};
