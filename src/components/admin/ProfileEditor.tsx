import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Upload, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ProfileEditor = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
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
  const [newTag, setNewTag] = useState('');

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

  const handleUploadCV = async (file: File) => {
    setUploadingCV(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `cv-${profile.id}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      setProfile({ ...profile, cv_url: publicUrl });

      toast({
        title: 'Success',
        description: 'CV uploaded successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploadingCV(false);
    }
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

  const handleAddTag = () => {
    if (newTag.trim() && !profile.tags.includes(newTag.trim())) {
      setProfile({ ...profile, tags: [...profile.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setProfile({ ...profile, tags: profile.tags.filter(t => t !== tagToRemove) });
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="display_name" className="text-[#0A0908]">Display Name</Label>
            <Input
              id="display_name"
              value={profile.display_name}
              onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
              className="bg-white border-gray-300 text-[#0A0908]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[#0A0908]">Title</Label>
            <Input
              id="title"
              value={profile.title}
              onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              className="bg-white border-gray-300 text-[#0A0908]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#0A0908]">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="bg-white border-gray-300 text-[#0A0908]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="text-[#0A0908]">Location</Label>
            <Input
              id="location"
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              className="bg-white border-gray-300 text-[#0A0908]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interests" className="text-[#0A0908]">Interests</Label>
            <Input
              id="interests"
              value={profile.interests}
              onChange={(e) => setProfile({ ...profile, interests: e.target.value })}
              className="bg-white border-gray-300 text-[#0A0908]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="experience_years" className="text-[#0A0908]">Years of Experience</Label>
            <Input
              id="experience_years"
              type="number"
              value={profile.experience_years}
              onChange={(e) => setProfile({ ...profile, experience_years: parseInt(e.target.value) })}
              className="bg-white border-gray-300 text-[#0A0908]"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="avatar_url" className="text-[#0A0908]">Avatar URL</Label>
          <Input
            id="avatar_url"
            value={profile.avatar_url}
            onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
            className="bg-white border-gray-300 text-[#0A0908]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio" className="text-[#0A0908]">Bio (use double line breaks for paragraphs)</Label>
          <Textarea
            id="bio"
            rows={8}
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="bg-white border-gray-300 text-[#0A0908]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cv_upload" className="text-[#0A0908]">CV / Resume</Label>
          <div className="flex items-center gap-2">
            <Input
              id="cv_upload"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUploadCV(file);
              }}
              disabled={uploadingCV}
              className="bg-white border-gray-300 text-[#0A0908]"
            />
            {uploadingCV && <Loader2 className="h-4 w-4 animate-spin" />}
          </div>
          {profile.cv_url && (
            <p className="text-sm text-gray-600">
              Current CV: <a href={profile.cv_url} target="_blank" rel="noopener noreferrer" className="text-[#FF6542] hover:underline">View</a>
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags" className="text-[#0A0908]">Profile Tags</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {profile.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1 bg-[#FF6542] text-white hover:bg-[#FF6542]/90">
                {tag}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleRemoveTag(tag)}
                />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              id="tags"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="Add a tag..."
              className="bg-white border-gray-300 text-[#0A0908]"
            />
            <Button onClick={handleAddTag} variant="outline" type="button">
              Add
            </Button>
          </div>
        </div>
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
