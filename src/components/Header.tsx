
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Github, Share2, Code, User, LogOut, Sliders, Keyboard, GitBranch, Users, Download } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "./AuthModal";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import VersionHistory from "./VersionHistory";
import ProjectExport from "./ProjectExport";
import AdvancedSettings from "./AdvancedSettings";
import { UnifiedProject } from "@/hooks/useUnifiedProjects";
import { Project } from "@/hooks/useProjects";
import { Timestamp } from 'firebase/firestore';

interface HeaderProps {
  onToggleDevMode: () => void;
  devMode: boolean;
  onShare: () => void;
  onSettings: () => void;
  currentProject?: UnifiedProject;
  onLogoClick: () => void;
  currentCode: string;
}

const Header = ({ onToggleDevMode, devMode, onShare, onSettings, currentProject, onLogoClick, currentCode }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const projectForExport: Project | undefined = currentProject && currentProject.provider === 'firebase'
    ? {
        id: currentProject.id,
        name: currentProject.name,
        description: currentProject.description,
        code: currentProject.code,
        is_public: currentProject.is_public,
        user_id: currentProject.user_id,
        created_at: Timestamp.fromDate(new Date(currentProject.created_at)),
        updated_at: Timestamp.fromDate(new Date(currentProject.updated_at)),
      }
    : undefined;

  return (
    <>
      <header className="flex items-center justify-between p-4 border-b bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button onClick={onLogoClick} className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Lovable Clone
            </h1>
          </button>
          {currentProject && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400">•</span>
              <span className="font-medium">{currentProject.name}</span>
            </div>
          )}
          <Badge variant="secondary" className="text-xs">
            v1.0.0
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {currentProject && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowVersionHistory(true)}
                className="gap-2"
              >
                <GitBranch className="w-4 h-4" />
                Versioni
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCollaboration(true)}
                className="gap-2"
                disabled
              >
                <Users className="w-4 h-4" />
                Collabora
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExport(true)}
                className="gap-2"
                disabled={!projectForExport}
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </>
          )}

          {currentProject && <Button
            variant={devMode ? "default" : "outline"}
            size="sm"
            onClick={onToggleDevMode}
            className="gap-2"
          >
            <Code className="w-4 h-4" />
            Dev Mode
          </Button>}
          {currentProject && <Button variant="outline" size="sm" onClick={onShare} className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>}
          <Button variant="outline" size="sm">
            <Github className="w-4 h-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onSettings}>
                <Settings className="w-4 h-4 mr-2" />
                Impostazioni Base
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowAdvancedSettings(true)}>
                <Sliders className="w-4 h-4 mr-2" />
                Impostazioni Avanzate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Keyboard className="w-4 h-4 mr-2" />
                Scorciatoie (Ctrl+K)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {user ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <User className="w-4 h-4" />
                {user.email?.split('@')[0]}
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => setShowAuthModal(true)}
              className="gap-2"
            >
              <User className="w-4 h-4" />
              Accedi
            </Button>
          )}
        </div>
      </header>

      {/* Modali */}
      <AuthModal 
        open={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      
      <VersionHistory
        open={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
        projectId={currentProject?.id}
        onRevertToVersion={(code) => {
          // Implementare logica per ripristinare versione
          console.log('Revert to version:', code);
        }}
        currentCode={currentCode}
      />
      
      <ProjectExport
        open={showExport}
        onClose={() => setShowExport(false)}
        project={projectForExport}
      />
      
      <AdvancedSettings
        open={showAdvancedSettings}
        onClose={() => setShowAdvancedSettings(false)}
      />
    </>
  );
};

export default Header;
