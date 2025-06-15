
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, FolderOpen, Trash2, Edit, Globe, Lock } from 'lucide-react';
import { useProjects, Project } from '@/hooks/useProjects';
import { toast } from 'sonner';

interface ProjectManagerProps {
  onProjectSelect: (project: Project) => void;
  selectedProject?: Project;
}

const ProjectManager = ({ onProjectSelect, selectedProject }: ProjectManagerProps) => {
  const { projects, loading, createProject, deleteProject } = useProjects();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      toast.error('Inserisci un nome per il progetto');
      return;
    }

    setCreating(true);
    try {
      const project = await createProject(newProjectName, newProjectDescription);
      toast.success('Progetto creato con successo!');
      setShowCreateDialog(false);
      setNewProjectName('');
      setNewProjectDescription('');
      onProjectSelect(project);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (confirm('Sei sicuro di voler eliminare questo progetto?')) {
      try {
        await deleteProject(projectId);
        toast.success('Progetto eliminato');
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">I tuoi progetti</h2>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nuovo Progetto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crea Nuovo Progetto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Nome Progetto</Label>
                <Input
                  id="project-name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Il mio progetto fantastico"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-description">Descrizione (opzionale)</Label>
                <Textarea
                  id="project-description"
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="Descrivi il tuo progetto..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleCreateProject} 
                  disabled={creating}
                  className="flex-1"
                >
                  {creating ? 'Creazione...' : 'Crea Progetto'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateDialog(false)}
                >
                  Annulla
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <Card className="p-8 text-center">
          <FolderOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Nessun progetto ancora</h3>
          <p className="text-gray-600 mb-4">
            Crea il tuo primo progetto per iniziare a costruire con l'AI
          </p>
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Crea il tuo primo progetto
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedProject?.id === project.id ? 'ring-2 ring-purple-600' : ''
              }`}
              onClick={() => onProjectSelect(project)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {project.description || 'Nessuna descrizione'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    {project.is_public ? (
                      <Globe className="w-4 h-4 text-green-600" />
                    ) : (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.id);
                      }}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>
                    Aggiornato {new Date(project.updated_at).toLocaleDateString()}
                  </span>
                  <Badge variant={project.is_public ? 'default' : 'secondary'}>
                    {project.is_public ? 'Pubblico' : 'Privato'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectManager;
