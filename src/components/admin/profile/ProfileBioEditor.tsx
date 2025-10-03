import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ProfileBioEditorProps {
  avatar_url: string;
  bio: string;
  onChange: (field: string, value: string) => void;
}

export const ProfileBioEditor = ({ avatar_url, bio, onChange }: ProfileBioEditorProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="avatar_url" className="text-[#0A0908]">Avatar URL</Label>
        <Input
          id="avatar_url"
          value={avatar_url}
          onChange={(e) => onChange('avatar_url', e.target.value)}
          className="bg-white border-gray-300 text-[#0A0908]"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio" className="text-[#0A0908]">Bio (use double line breaks for paragraphs)</Label>
        <Textarea
          id="bio"
          rows={8}
          value={bio}
          onChange={(e) => onChange('bio', e.target.value)}
          className="bg-white border-gray-300 text-[#0A0908]"
        />
      </div>
    </>
  );
};
