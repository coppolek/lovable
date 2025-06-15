
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";
import CodeEditor from "@/components/CodeEditor";
import PreviewPanel from "@/components/PreviewPanel";
import SettingsModal from "@/components/SettingsModal";
import ProjectManager from "@/components/ProjectManager";
import { useAuth } from "@/hooks/useAuth";
import { useUnifiedProjects, UnifiedProject } from "@/hooks/useUnifiedProjects";
import { toast } from "sonner";
import ProjectTemplates from "@/components/ProjectTemplates";
import CollaborationPanel from "@/components/CollaborationPanel";
import AIAssistantPanel from "@/components/AIAssistantPanel";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import DatabaseSelector from "@/components/DatabaseSelector";

const Index = () => {
  const [devMode, setDevMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentCode, setCurrentCode] = useState('');
  const [selectedProject, setSelectedProject] = useState<UnifiedProject | undefined>();
  const [showProjectManager, setShowProjectManager] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const { projects, createProject, updateProject, loading: projectsLoading } = useUnifiedProjects();
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showDatabaseSelector, setShowDatabaseSelector] = useState(false);

  useEffect(() => {
    if (!authLoading && user && projects.length > 0 && !selectedProject) {
      setShowProjectManager(true);
    } else if (!authLoading && !user) {
      setShowProjectManager(false);
    }
  }, [authLoading, user, projects, selectedProject]);

  const handleToggleDevMode = () => {
    setDevMode(!devMode);
    toast.success(devMode ? "Modalità normale attivata" : "Modalità sviluppatore attivata");
  };

  const handleShare = () => {
    if (selectedProject) {
      const shareUrl = `${window.location.origin}/project/${selectedProject.id}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link di condivisione copiato negli appunti!");
    } else {
      toast.error("Seleziona un progetto per condividerlo");
    }
  };

  const handleCodeGenerated = (code: string) => {
    setCurrentCode(code);
    if (selectedProject && user) {
      updateProject(selectedProject.id, { code })
        .catch(error => console.error('Error auto-saving project:', error));
    }
  };

  const handleCodeChange = (code: string) => {
    setCurrentCode(code);
    if (selectedProject && user) {
      const timeoutId = setTimeout(() => {
        updateProject(selectedProject.id, { code })
          .catch(error => console.error('Error auto-saving project:', error));
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  };

  const handleProjectSelect = (project: UnifiedProject) => {
    setSelectedProject(project);
    setCurrentCode(project.code);
    setShowProjectManager(false);
    setShowTemplates(false);
    setShowDatabaseSelector(false);
    toast.success(`Progetto "${project.name}" caricato`);
  };

  const handleSelectTemplate = async (template: any) => {
    if (user) {
      try {
        console.log('Creating project from template:', template.name);
        const newProject = await createProject(template.name, template.description);
        console.log('Project created:', newProject);
        
        await updateProject(newProject.id, { code: template.code });
        console.log('Template code applied');
        
        const updatedProject: UnifiedProject = { 
          ...newProject, 
          code: template.code 
        };
        
        handleProjectSelect(updatedProject);
        toast.success(`Progetto "${template.name}" creato da template`);
      } catch (error) {
        console.error('Error creating project from template:', error);
        toast.error("Errore nella creazione del progetto da template");
      }
    }
  };

  const handleNewProject = () => {
    console.log('Starting new project flow');
    setShowDatabaseSelector(true);
    setShowProjectManager(false);
    setShowTemplates(false);
  };

  const handleDatabaseSelected = (provider: string) => {
    console.log('Database selected:', provider);
    setShowDatabaseSelector(false);
    setShowProjectManager(false);
    setShowTemplates(true);
  };

  const handleBackToProjects = () => {
    setSelectedProject(undefined);
    setCurrentCode('');
    setShowProjectManager(true);
    setShowTemplates(false);
    setShowDatabaseSelector(false);
  };

  const handleCancelDatabaseSelection = () => {
    console.log('Database selection cancelled');
    setShowDatabaseSelector(false);
    setShowProjectManager(true);
    setShowTemplates(false);
  };

  const handleCancelTemplateSelection = () => {
    console.log('Template selection cancelled');
    setShowTemplates(false);
    setShowProjectManager(true);
    setShowDatabaseSelector(false);
  };
  
  const isOwner = !!(selectedProject && user && selectedProject.user_id === user.uid);
  const isProjectView = user && selectedProject;
  const showLandingPage = !user && !authLoading;

  console.log('Current state:', {
    showLandingPage,
    showDatabaseSelector,
    showProjectManager,
    showTemplates,
    isProjectView,
    user: !!user,
    authLoading
  });

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header
        onToggleDevMode={handleToggleDevMode}
        devMode={devMode}
        onShare={handleShare}
        onSettings={() => setSettingsOpen(true)}
        currentProject={selectedProject}
        onLogoClick={handleBackToProjects}
        currentCode={currentCode}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {showLandingPage ? (
          <div className="flex-1 flex items-center justify-center">
             <h1 className="text-4xl font-bold">Benvenuto! Accedi per iniziare.</h1>
          </div>
        ) : showDatabaseSelector ? (
          <div className="flex-1">
            <DatabaseSelector
              onSelect={handleDatabaseSelected}
              onCancel={handleCancelDatabaseSelection}
            />
          </div>
        ) : showTemplates ? (
          <div className="flex-1">
            <ProjectTemplates
              onSelectTemplate={handleSelectTemplate}
              onCancel={handleCancelTemplateSelection}
            />
          </div>
        ) : !isProjectView || showProjectManager ? (
          <div className="flex-1 p-6">
            <ProjectManager 
              onProjectSelect={handleProjectSelect}
              selectedProject={selectedProject}
              onNewProject={handleNewProject}
            />
          </div>
        ) : (
          <>
            <div className="w-1/3 border-r bg-white">
              <ChatInterface onCodeGenerated={handleCodeGenerated} />
            </div>
            <div className="flex-1">
              {devMode ? (
                <CodeEditor 
                  code={currentCode} 
                  onCodeChange={handleCodeChange}
                />
              ) : (
                <PreviewPanel code={currentCode} />
              )}
            </div>
            <div className="w-1/3 border-l">
              {devMode ? (
                <PreviewPanel code={currentCode} />
              ) : showAIAssistant ? (
                <AIAssistantPanel 
                  currentCode={currentCode}
                  onApplySuggestion={(code) => {
                    setCurrentCode(prev => prev + '\n\n' + code);
                  }}
                />
              ) : (
                <CollaborationPanel 
                  projectId={selectedProject?.id}
                  isOwner={isOwner}
                />
              )}
            </div>
          </>
        )}
      </div>

      {isProjectView && !showTemplates && !showDatabaseSelector && (
        <Button
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={() => setShowAIAssistant(!showAIAssistant)}
        >
          <Brain className="w-6 h-6 text-white" />
        </Button>
      )}

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
};

export default Index;
