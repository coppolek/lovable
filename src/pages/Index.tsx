import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";
import CodeEditor from "@/components/CodeEditor";
import PreviewPanel from "@/components/PreviewPanel";
import SettingsModal from "@/components/SettingsModal";
import ProjectManager from "@/components/ProjectManager";
import ProjectPrompt from "@/components/ProjectPrompt";
import { useAuth } from "@/hooks/useAuth";
import { useSupabaseProjects, SupabaseProject } from "@/hooks/useSupabaseProjects";
import { toast } from "sonner";
import CollaborationPanel from "@/components/CollaborationPanel";
import AIAssistantPanel from "@/components/AIAssistantPanel";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import CommandPalette from "@/components/CommandPalette";
import ShortcutsHelp from "@/components/ShortcutsHelp";
import StatusBar from "@/components/StatusBar";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { AIService } from "@/services/aiService";

const Index = () => {
  const [devMode, setDevMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentCode, setCurrentCode] = useState('');
  const [selectedProject, setSelectedProject] = useState<SupabaseProject | undefined>();
  const [showProjectManager, setShowProjectManager] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const { projects, createProject, updateProject, loading: projectsLoading } = useSupabaseProjects();
  const [showProjectPrompt, setShowProjectPrompt] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>();
  const [buildStatus, setBuildStatus] = useState<'success' | 'error' | 'building'>('success');
  const [isCreatingProject, setIsCreatingProject] = useState(false);

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
    setBuildStatus('building');
    setCurrentCode(code);
    
    if (selectedProject && user) {
      const timeoutId = setTimeout(() => {
        updateProject(selectedProject.id, { code })
          .then(() => {
            setLastSaved(new Date());
            setBuildStatus('success');
          })
          .catch(() => setBuildStatus('error'));
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  };

  const handleProjectSelect = (project: SupabaseProject) => {
    setSelectedProject(project);
    setCurrentCode(project.code);
    setShowProjectManager(false);
    setShowProjectPrompt(false);
    toast.success(`Progetto "${project.name}" caricato`);
  };

  const handleCreateProjectFromPrompt = async (name: string, description: string, prompt: string) => {
    if (!user) {
      toast.error('Devi essere autenticato per creare un progetto');
      return;
    }

    setIsCreatingProject(true);
    
    try {
      console.log('Creating project from prompt:', { name, description, prompt });
      
      // Create the project first
      const newProject = await createProject(name, description);
      console.log('Project created:', newProject);
      
      // Generate code using AI
      toast.info('Generazione codice con AI in corso...');
      
      const messages = [
        {
          role: 'user' as const,
          content: `Crea un'applicazione React completa basata su questa descrizione: ${prompt}

Requisiti:
- Usa React con TypeScript
- Usa Tailwind CSS per lo styling
- Crea un componente funzionale e moderno
- Includi interazioni e stati appropriati
- Assicurati che il codice sia completo e funzionante
- Usa componenti shadcn/ui quando appropriato
- Rendi l'interfaccia responsive e accattivante

Genera SOLO il codice del componente React, senza spiegazioni aggiuntive.`
        }
      ];

      const aiResponse = await AIService.sendMessage(messages, 'gemini', 'gemini-1.5-flash');
      console.log('AI Response received');
      
      // Extract code from AI response
      const generatedCode = AIService.extractCodeFromResponse(aiResponse.content);
      const finalCode = generatedCode || AIService.generateSampleComponent(prompt);
      
      console.log('Generated code length:', finalCode.length);
      
      // Update project with generated code
      await updateProject(newProject.id, { code: finalCode });
      console.log('Project updated with generated code');
      
      const updatedProject: SupabaseProject = { 
        ...newProject, 
        code: finalCode 
      };
      
      handleProjectSelect(updatedProject);
      toast.success(`Progetto "${name}" creato con successo!`);
      
    } catch (error) {
      console.error('Error creating project from prompt:', error);
      toast.error("Errore nella creazione del progetto: " + (error as Error).message);
    } finally {
      setIsCreatingProject(false);
    }
  };

  const handleNewProject = () => {
    console.log('Starting new project flow');
    setShowProjectPrompt(true);
    setShowProjectManager(false);
  };

  const handleBackToProjects = () => {
    setSelectedProject(undefined);
    setCurrentCode('');
    setShowProjectManager(true);
    setShowProjectPrompt(false);
  };

  const handleCancelProjectPrompt = () => {
    console.log('Project prompt cancelled');
    setShowProjectPrompt(false);
    setShowProjectManager(true);
  };
  
  const isOwner = !!(selectedProject && user && selectedProject.user_id === user.uid);
  const isProjectView = user && selectedProject;
  const showLandingPage = !user && !authLoading;

  // Keyboard shortcuts setup
  useKeyboardShortcuts([
    {
      key: 'k',
      ctrl: true,
      action: () => setShowCommandPalette(true),
      description: 'Apri palette comandi'
    },
    {
      key: '/',
      ctrl: true,
      action: () => setShowShortcutsHelp(true),
      description: 'Mostra shortcuts'
    }
  ]);

  // Event listeners for global shortcuts
  useEffect(() => {
    const handleOpenCommandPalette = () => setShowCommandPalette(true);
    const handleToggleDevMode = () => handleToggleDevMode();
    const handleSaveProject = () => {
      if (selectedProject && user && currentCode !== selectedProject.code) {
        updateProject(selectedProject.id, { code: currentCode });
        setLastSaved(new Date());
        toast.success('Progetto salvato');
      }
    };
    const handleNewProject = () => handleNewProject();
    const handleToggleShortcutsHelp = () => setShowShortcutsHelp(prev => !prev);

    window.addEventListener('openCommandPalette', handleOpenCommandPalette);
    window.addEventListener('toggleDevMode', handleToggleDevMode);
    window.addEventListener('saveProject', handleSaveProject);
    window.addEventListener('newProject', handleNewProject);
    window.addEventListener('toggleShortcutsHelp', handleToggleShortcutsHelp);

    return () => {
      window.removeEventListener('openCommandPalette', handleOpenCommandPalette);
      window.removeEventListener('toggleDevMode', handleToggleDevMode);
      window.removeEventListener('saveProject', handleSaveProject);
      window.removeEventListener('newProject', handleNewProject);
      window.removeEventListener('toggleShortcutsHelp', handleToggleShortcutsHelp);
    };
  }, [selectedProject, user, currentCode, updateProject]);

  const handleCommandPaletteAction = (command: string, args?: any) => {
    switch (command) {
      case 'newProject':
        handleNewProject();
        break;
      case 'saveProject':
        if (selectedProject && user) {
          updateProject(selectedProject.id, { code: currentCode });
          setLastSaved(new Date());
          toast.success('Progetto salvato');
        }
        break;
      case 'shareProject':
        handleShare();
        break;
      case 'exportProject':
        // This will be handled by Header component
        break;
      case 'toggleDevMode':
        handleToggleDevMode();
        break;
      case 'openVersionHistory':
        // This will be handled by Header component
        break;
      case 'toggleAIAssistant':
        setShowAIAssistant(!showAIAssistant);
        break;
      case 'openSettings':
        setSettingsOpen(true);
        break;
    }
  };

  console.log('Current state:', {
    showLandingPage,
    showProjectManager,
    showProjectPrompt,
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
        ) : showProjectPrompt ? (
          <div className="flex-1">
            <ProjectPrompt
              onCreateProject={handleCreateProjectFromPrompt}
              onCancel={handleCancelProjectPrompt}
              isCreating={isCreatingProject}
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

      {/* Status Bar */}
      <StatusBar
        isOnline={navigator.onLine}
        lastSaved={lastSaved}
        buildStatus={buildStatus}
        currentProject={selectedProject?.name}
      />

      {isProjectView && !showProjectPrompt && (
        <Button
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={() => setShowAIAssistant(!showAIAssistant)}
        >
          <Brain className="w-6 h-6 text-white" />
        </Button>
      )}

      {/* Modals */}
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <CommandPalette
        open={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onCommand={handleCommandPaletteAction}
      />

      <ShortcutsHelp
        open={showShortcutsHelp}
        onClose={() => setShowShortcutsHelp(false)}
      />
    </div>
  );
};

export default Index;