
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Github, Share2, Code, Play } from "lucide-react";

interface HeaderProps {
  onToggleDevMode: () => void;
  devMode: boolean;
  onShare: () => void;
  onSettings: () => void;
}

const Header = ({ onToggleDevMode, devMode, onShare, onSettings }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-white/80 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <Code className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Lovable Clone
          </h1>
        </div>
        <Badge variant="secondary" className="text-xs">
          v1.0.0
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={devMode ? "default" : "outline"}
          size="sm"
          onClick={onToggleDevMode}
          className="gap-2"
        >
          <Code className="w-4 h-4" />
          Dev Mode
        </Button>
        <Button variant="outline" size="sm" onClick={onShare} className="gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        <Button variant="outline" size="sm">
          <Github className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onSettings}>
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
