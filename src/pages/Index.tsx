
import { useState } from "react";
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";
import CodeEditor from "@/components/CodeEditor";
import PreviewPanel from "@/components/PreviewPanel";
import SettingsModal from "@/components/SettingsModal";
import { toast } from "sonner";

const Index = () => {
  const [devMode, setDevMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentCode, setCurrentCode] = useState('');

  const handleToggleDevMode = () => {
    setDevMode(!devMode);
    toast.success(devMode ? "Modalità normale attivata" : "Modalità sviluppatore attivata");
  };

  const handleShare = () => {
    toast.success("Link di condivisione copiato negli appunti!");
  };

  const handleCodeGenerated = (code: string) => {
    setCurrentCode(code);
  };

  const handleCodeChange = (code: string) => {
    setCurrentCode(code);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header
        onToggleDevMode={handleToggleDevMode}
        devMode={devMode}
        onShare={handleShare}
        onSettings={() => setSettingsOpen(true)}
      />
      
      <div className="flex-1 flex overflow-hidden">
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
      </div>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
};

export default Index;
