
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Download, Upload, FileCode, Package, Github, Globe } from "lucide-react";
import { toast } from "sonner";
import { Project } from "@/hooks/useProjects";

interface ProjectExportProps {
  open: boolean;
  onClose: () => void;
  project?: Project;
  onImportProject?: (projectData: any) => void;
}

const ProjectExport = ({ open, onClose, project, onImportProject }: ProjectExportProps) => {
  const [importData, setImportData] = useState('');
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');

  const handleExportJSON = () => {
    if (!project) return;

    const exportData = {
      name: project.name,
      description: project.description,
      code: project.code,
      created_at: project.created_at,
      version: '1.0.0',
      lovable_export: true
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}-export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Progetto esportato con successo!');
  };

  const handleExportCode = () => {
    if (!project) return;

    const blob = new Blob([project.code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}-component.tsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Codice esportato con successo!');
  };

  const handleExportPackage = () => {
    if (!project) return;

    const packageJson = {
      name: project.name.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      description: project.description,
      main: 'index.tsx',
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview'
      },
      dependencies: {
        'react': '^18.3.1',
        'react-dom': '^18.3.1',
        '@types/react': '^18.3.1',
        '@types/react-dom': '^18.3.1',
        'typescript': '^5.0.0',
        'vite': '^5.0.0'
      }
    };

    const files = {
      'package.json': JSON.stringify(packageJson, null, 2),
      'index.tsx': project.code,
      'vite.config.ts': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`,
      'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`
    };

    // Simulazione download package completo
    const zipContent = Object.entries(files)
      .map(([filename, content]) => `=== ${filename} ===\n${content}\n`)
      .join('\n');

    const blob = new Blob([zipContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}-package.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Package esportato con successo!');
  };

  const handleImport = () => {
    try {
      const projectData = JSON.parse(importData);
      
      if (!projectData.lovable_export) {
        toast.error('File non valido: non è un export di Lovable');
        return;
      }

      if (onImportProject) {
        onImportProject(projectData);
        toast.success('Progetto importato con successo!');
        onClose();
      }
    } catch (error) {
      toast.error('Errore durante l\'importazione: JSON non valido');
    }
  };

  const exportOptions = [
    {
      id: 'json',
      title: 'Esporta Progetto Completo',
      description: 'Include codice, metadati e configurazione',
      icon: <FileCode className="w-5 h-5" />,
      action: handleExportJSON,
      badge: 'Raccomandato'
    },
    {
      id: 'code',
      title: 'Esporta Solo Codice',
      description: 'File TypeScript/React del componente',
      icon: <Download className="w-5 h-5" />,
      action: handleExportCode,
    },
    {
      id: 'package',
      title: 'Esporta Package NPM',
      description: 'Progetto completo con package.json e config',
      icon: <Package className="w-5 h-5" />,
      action: handleExportPackage,
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import/Export Progetto</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('export')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'export' 
                  ? 'border-b-2 border-purple-600 text-purple-600' 
                  : 'text-gray-600'
              }`}
            >
              Esporta
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'import' 
                  ? 'border-b-2 border-purple-600 text-purple-600' 
                  : 'text-gray-600'
              }`}
            >
              Importa
            </button>
          </div>

          {activeTab === 'export' ? (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Progetto: {project?.name}</h3>
                <p className="text-sm text-gray-600">{project?.description}</p>
              </div>

              {exportOptions.map((option) => (
                <Card key={option.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {option.icon}
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{option.title}</h4>
                            {option.badge && (
                              <Badge variant="secondary" className="text-xs">
                                {option.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                      </div>
                      <Button onClick={option.action} variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Esporta
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Deploy Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Deploy & Condivisione</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <Github className="w-5 h-5" />
                    Pubblica su GitHub
                    <Badge variant="outline" className="ml-auto">Presto</Badge>
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <Globe className="w-5 h-5" />
                    Deploy su Netlify/Vercel
                    <Badge variant="outline" className="ml-auto">Presto</Badge>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Importa Progetto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Incolla il JSON del progetto esportato:
                    </label>
                    <Textarea
                      placeholder='{"name": "Il mio progetto", "code": "...", ...}'
                      value={importData}
                      onChange={(e) => setImportData(e.target.value)}
                      rows={8}
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleImport} disabled={!importData.trim()}>
                      Importa Progetto
                    </Button>
                    <Button variant="outline" onClick={() => setImportData('')}>
                      Pulisci
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Chiudi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectExport;
