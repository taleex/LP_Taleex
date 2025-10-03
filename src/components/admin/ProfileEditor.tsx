import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import { ProfileBasicInfo } from './profile/ProfileBasicInfo';
import { ProfileBioEditor } from './profile/ProfileBioEditor';
import { ProfileCVUpload } from './profile/ProfileCVUpload';
import { ProfileTagsManager } from './profile/ProfileTagsManager';

const ProfileEditor = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    id: '',
    display_name: '',
    title: '',
    bio: '',
    avatar_url: '',
    location: '',
    email: '',
    interests: '',
    experience_years: 5,
    tags: [] as string[],
    cv_url: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setProfile({
          ...data,
          tags: data.tags && data.tags.length > 0 ? data.tags : ['Full-Stack Developer', 'React Enthusiast', 'Problem Solver']
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: string, value: string | number) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: profile.display_name,
          title: profile.title,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
          location: profile.location,
          email: profile.email,
          interests: profile.interests,
          experience_years: profile.experience_years,
          tags: profile.tags,
          cv_url: profile.cv_url,
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight text-[#0A0908]">Profile Information</CardTitle>
        <CardDescription className="text-sm text-gray-600">
          Update your personal information displayed on the site
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ProfileBasicInfo 
          profile={profile}
          onChange={handleFieldChange}
        />
        
        <ProfileBioEditor
          avatar_url={profile.avatar_url}
          bio={profile.bio}
          onChange={handleFieldChange}
        />
        
        <ProfileCVUpload
          profileId={profile.id}
          cvUrl={profile.cv_url}
          onUploadSuccess={(url) => setProfile({ ...profile, cv_url: url })}
        />
        
        <ProfileTagsManager
          tags={profile.tags}
          onTagsChange={(tags) => setProfile({ ...profile, tags })}
        />
        
        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} disabled={saving} size="default">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileEditor;
