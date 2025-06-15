
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

const Index = () => {
  const [devMode, setDevMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentCode, setCurrentCode] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  const [showProjectManager, setShowProjectManager] = useState(false);
  const { user } = useAuth();
  const { updateProject } = useProjects();

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

            {/* Right Panel - Preview when in dev mode */}
            {devMode && (
              <div className="w-1/2 border-l">
                <PreviewPanel code={currentCode} />
              </div>
            )}
          </>
        )}
      </div>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
};

export default Index;
