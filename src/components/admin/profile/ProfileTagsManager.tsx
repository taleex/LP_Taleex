import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface ProfileTagsManagerProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export const ProfileTagsManager = ({ tags, onTagsChange }: ProfileTagsManagerProps) => {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onTagsChange([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(t => t !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="tags" className="text-[#0A0908]">Profile Tags</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
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
  );
};
