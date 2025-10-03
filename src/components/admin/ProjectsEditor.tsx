import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, Save, X, GripVertical } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useSkills } from '@/hooks/useSkills';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  tags: string[];
  github_url: string | null;
  demo_url: string | null;
  featured: boolean;
  order_index: number;
}

function SortableProjectCard({ project, editingProject, onEdit, onDelete, onSave, setEditingProject, skillCategories }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card ref={setNodeRef} style={style} className="bg-white border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
              <GripVertical className="h-5 w-5 text-gray-400" />
            </div>
            <CardTitle className="text-lg text-[#0A0908]">{project.title}</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(project)}
              className="border-gray-300 bg-white hover:bg-gray-100 text-[#0A0908] hover:text-[#0A0908]"
            >
              {editingProject?.id === project.id ? 'Cancel' : 'Edit'}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(project.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {editingProject?.id === project.id && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#0A0908]">Title</Label>
              <Input
                value={editingProject.title}
                onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                className="bg-white border-gray-300 text-[#0A0908]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#0A0908]">Order</Label>
              <Input
                type="number"
                value={editingProject.order_index}
                onChange={(e) => setEditingProject({ ...editingProject, order_index: parseInt(e.target.value) })}
                className="bg-white border-gray-300 text-[#0A0908]"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[#0A0908]">Description</Label>
            <Textarea
              value={editingProject.description}
              onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
              className="bg-white border-gray-300 text-[#0A0908]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#0A0908]">Image URL</Label>
            <Input
              value={editingProject.image_url}
              onChange={(e) => setEditingProject({ ...editingProject, image_url: e.target.value })}
              className="bg-white border-gray-300 text-[#0A0908]"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#0A0908]">GitHub URL</Label>
              <Input
                value={editingProject.github_url || ''}
                onChange={(e) => setEditingProject({ ...editingProject, github_url: e.target.value })}
                className="bg-white border-gray-300 text-[#0A0908]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#0A0908]">Demo URL</Label>
              <Input
                value={editingProject.demo_url || ''}
                onChange={(e) => setEditingProject({ ...editingProject, demo_url: e.target.value })}
                className="bg-white border-gray-300 text-[#0A0908]"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[#0A0908]">Technologies</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {editingProject.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1 bg-[#FF6542] text-white hover:bg-[#FF6542]/90">
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setEditingProject({
                      ...editingProject,
                      tags: editingProject.tags.filter((t: string) => t !== tag)
                    })}
                  />
                </Badge>
              ))}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left font-normal border-gray-300 hover:border-[#FF6542] transition-colors"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add technologies...
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-80 bg-white border-gray-200 p-4 shadow-xl max-h-[400px] overflow-y-auto"
                align="start"
              >
                {skillCategories?.map((category: any, idx: number) => (
                  <div key={category.title}>
                    {idx > 0 && <DropdownMenuSeparator className="my-3" />}
                    <div className="mb-3">
                      <DropdownMenuLabel className="text-sm font-semibold text-[#0A0908] flex items-center gap-2 px-0">
                        <div className="w-1 h-4 bg-gradient-to-b from-[#FF6542] to-[#912F40] rounded-full"></div>
                        {category.title}
                      </DropdownMenuLabel>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {category.skills.map((skill: any) => (
                          <button
                            key={skill.name}
                            onClick={() => {
                              if (editingProject.tags.includes(skill.name)) {
                                setEditingProject({
                                  ...editingProject,
                                  tags: editingProject.tags.filter((t: string) => t !== skill.name)
                                });
                              } else {
                                setEditingProject({
                                  ...editingProject,
                                  tags: [...editingProject.tags, skill.name]
                                });
                              }
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                              editingProject.tags.includes(skill.name)
                                ? 'bg-[#FF6542] text-white shadow-md shadow-[#FF6542]/20'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {skill.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={editingProject.featured}
              onCheckedChange={(checked) => setEditingProject({ ...editingProject, featured: checked })}
            />
            <Label className="text-[#0A0908]">Featured Project</Label>
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={() => onSave(editingProject)}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

const ProjectsEditor = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { data: skillCategories } = useSkills();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setProjects(data || []);
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setProjects((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update order_index for all items
        newItems.forEach(async (item, index) => {
          await supabase
            .from('projects')
            .update({ order_index: index + 1 })
            .eq('id', item.id);
        });

        return newItems;
      });

      toast({
        title: 'Success',
        description: 'Project order updated',
      });
    }
  };

  const handleSave = async (project: Project) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          title: project.title,
          description: project.description,
          image_url: project.image_url,
          tags: project.tags,
          github_url: project.github_url,
          demo_url: project.demo_url,
          featured: project.featured,
          order_index: project.order_index,
        })
        .eq('id', project.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Project updated successfully',
      });
      setEditingProject(null);
      fetchProjects();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });
      fetchProjects();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleAddNew = async () => {
    try {
      await supabase
        .from('projects')
        .insert({
          title: 'New Project',
          description: 'Project description',
          image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
          tags: ['React'],
          order_index: projects.length + 1,
          featured: false,
        });

      toast({
        title: 'Success',
        description: 'New project created',
      });
      fetchProjects();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-[#0A0908]">Projects</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your portfolio projects - drag to reorder</p>
        </div>
        <Button onClick={handleAddNew} size="default">
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={projects.map(p => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {projects.map((project) => (
            <SortableProjectCard
              key={project.id}
              project={project}
              editingProject={editingProject}
              onEdit={(p: Project) => setEditingProject(editingProject?.id === p.id ? null : p)}
              onDelete={handleDelete}
              onSave={handleSave}
              setEditingProject={setEditingProject}
              skillCategories={skillCategories}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ProjectsEditor;