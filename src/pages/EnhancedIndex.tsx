import { useState } from "react";
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";
import CodeEditor from "@/components/CodeEditor";
import PreviewPanel from "@/components/PreviewPanel";
import SettingsModal from "@/components/SettingsModal";
import ProjectManager from "@/components/ProjectManager";
import { useAuth } from "@/hooks/useAuth";
import { useProjects, Project } from "@/hooks/useProjects";
import { toast } from "sonner";
import ProjectTemplates from "@/components/ProjectTemplates";
import VersionHistory from "@/components/VersionHistory";
import CollaborationPanel from "@/components/CollaborationPanel";
import AdvancedSettings from "@/components/AdvancedSettings";
import AIAssistantPanel from "@/components/AIAssistantPanel";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [devMode, setDevMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentCode, setCurrentCode] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  const [showProjectManager, setShowProjectManager] = useState(false);
  const { user } = useAuth();
  const { updateProject } = useProjects();
  const [showTemplates, setShowTemplates] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

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
      // Auto-save the project
      updateProject(selectedProject.id, { code })
        .catch(error => console.error('Error auto-saving project:', error));
    }
  };

  const handleCodeChange = (code: string) => {
    setCurrentCode(code);
    if (selectedProject && user) {
      // Debounced auto-save
      const timeoutId = setTimeout(() => {
        updateProject(selectedProject.id, { code })
          .catch(error => console.error('Error auto-saving project:', error));
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setCurrentCode(project.code);
    setShowProjectManager(false);
    toast.success(`Progetto "${project.name}" caricato`);
  };

  const handleSelectTemplate = (template: any) => {
    if (user) {
      // Crea nuovo progetto da template
      const newProject = {
        id: Date.now().toString(),
        name: template.name,
        description: template.description,
        code: template.code,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_public: false,
      };
      setSelectedProject(newProject);
      setCurrentCode(template.code);
      setShowTemplates(false);
      toast.success(`Progetto "${template.name}" creato da template`);
    }
  };

  const handleNewProject = () => {
    setShowTemplates(true);
  };

  // Show project manager if user is logged in but no project is selected
  const shouldShowProjectManager = user && !selectedProject && !showProjectManager;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header
        onToggleDevMode={handleToggleDevMode}
        devMode={devMode}
        onShare={handleShare}
        onSettings={() => setSettingsOpen(true)}
        currentProject={selectedProject}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {shouldShowProjectManager ? (
          <div className="flex-1 p-6">
            <ProjectManager 
              onProjectSelect={handleProjectSelect}
              selectedProject={selectedProject}
              onNewProject={handleNewProject}
            />
          </div>
        ) : showTemplates ? (
          <div className="flex-1">
            <ProjectTemplates
              onSelectTemplate={handleSelectTemplate}
              onCancel={() => setShowTemplates(false)}
            />
          </div>
        ) : (
          <>
            {/* Chat Panel */}
            <div className="w-1/3 border-r bg-white">
              <ChatInterface onCodeGenerated={handleCodeGenerated} />
            </div>

            {/* Middle Panel - Code Editor or Preview */}
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

            {/* Right Panel */}
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
                  isOwner={true}
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* Floating AI Assistant Toggle */}
      {!shouldShowProjectManager && !showTemplates && (
        <Button
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={() => setShowAIAssistant(!showAIAssistant)}
        >
          <Brain className="w-6 h-6 text-white" />
        </Button>
      )}

      {/* Modali */}
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
};

export default Index;
