
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FolderOpen, Trash2, Globe, Lock, Database, ExternalLink } from 'lucide-react';
import { useSupabaseProjects, SupabaseProject } from '@/hooks/useSupabaseProjects';
import { toast } from 'sonner';

interface ProjectManagerProps {
  onProjectSelect: (project: SupabaseProject) => void;
  selectedProject?: SupabaseProject;
  onNewProject: () => void;
}

const ProjectManager = ({ onProjectSelect, selectedProject, onNewProject }: ProjectManagerProps) => {
  const { projects, loading, deleteProject } = useSupabaseProjects();

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

  const handleConnectToSupabase = () => {
    window.open('https://supabase.com/dashboard', '_blank');
    toast.success('Apertura dashboard Supabase');
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
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">I tuoi progetti</h2>
          <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-md text-sm">
            <Database className="w-3 h-3" />
            Supabase
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={handleConnectToSupabase}
          >
            <ExternalLink className="w-4 h-4" />
            Connetti a Supabase
          </Button>
          <Button className="gap-2" onClick={onNewProject}>
            <Plus className="w-4 h-4" />
            Nuovo Progetto
          </Button>
        </div>
      </div>

      {projects.length === 0 ? (
        <Card className="p-8 text-center">
          <FolderOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Nessun progetto ancora</h3>
          <p className="text-gray-600 mb-4">
            Crea il tuo primo progetto per iniziare a costruire con l'AI
          </p>
          <Button onClick={onNewProject} className="gap-2">
            <Plus className="w-4 h-4" />
            Crea il tuo primo progetto
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const formatDate = (date: string | Date) => {
              if (date instanceof Date) {
                return date.toLocaleDateString();
              }
              return new Date(date).toLocaleDateString();
            };

            return (
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
                      <CardTitle className="text-lg flex items-center gap-2">
                        {project.name}
                        <Database className="w-4 h-4 text-green-600" />
                      </CardTitle>
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
                      Aggiornato {formatDate(project.updated_at)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectManager;
