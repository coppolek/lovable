import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowRight, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProjectPromptProps {
  onCreateProject: (name: string, description: string, prompt: string) => void;
  onCancel: () => void;
  isCreating?: boolean;
}

const ProjectPrompt = ({ onCreateProject, onCancel, isCreating = false }: ProjectPromptProps) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [prompt, setPrompt] = useState('');

  const handleSubmit = () => {
    if (!projectName.trim() || !prompt.trim()) return;
    
    onCreateProject(
      projectName.trim(),
      projectDescription.trim() || 'Progetto generato con AI',
      prompt.trim()
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  const examplePrompts = [
    "Crea un'app di gestione task con drag & drop, filtri e notifiche",
    "Sviluppa un dashboard analytics con grafici interattivi e KPI",
    "Costruisci un e-commerce con carrello, checkout e gestione prodotti",
    "Realizza un sistema di chat in tempo reale con stanze e messaggi",
    "Crea una landing page moderna per una startup tech",
    "Sviluppa un'app di fitness tracking con obiettivi e statistiche"
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Crea Nuovo Progetto
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Descrivi la tua idea e l'AI genererà il codice per te
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Dettagli Progetto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="projectName">Nome Progetto *</Label>
              <Input
                id="projectName"
                placeholder="es. Task Manager App"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="projectDescription">Descrizione (opzionale)</Label>
              <Input
                id="projectDescription"
                placeholder="Breve descrizione del progetto"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="prompt">Descrivi cosa vuoi costruire *</Label>
            <Textarea
              id="prompt"
              placeholder="Descrivi dettagliatamente la tua idea. Più dettagli fornisci, migliore sarà il risultato. Includi funzionalità, design, interazioni..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={6}
              className="mt-1 resize-none"
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-500">
                Premi Ctrl+Enter per creare il progetto
              </p>
              <span className="text-sm text-gray-400">
                {prompt.length}/2000
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Example Prompts */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">💡 Esempi di Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => setPrompt(example)}
                className="text-left p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors text-sm"
              >
                "{example}"
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isCreating}>
          Annulla
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Powered by Gemini Flash
            </Badge>
            <Badge variant="outline" className="text-xs text-green-600 border-green-300">
              Gratuito
            </Badge>
          </div>
          
          <Button 
            onClick={handleSubmit}
            disabled={!projectName.trim() || !prompt.trim() || isCreating}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
          >
            {isCreating ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Creazione in corso...
              </>
            ) : (
              <>
                Crea Progetto
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">💡 Suggerimenti per un prompt efficace:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Specifica il tipo di applicazione (web app, dashboard, e-commerce, etc.)</li>
          <li>• Descrivi le funzionalità principali che vuoi includere</li>
          <li>• Menziona lo stile di design preferito (moderno, minimale, colorato, etc.)</li>
          <li>• Includi dettagli su interazioni specifiche o comportamenti</li>
          <li>• Specifica se hai bisogno di componenti particolari (form, tabelle, grafici, etc.)</li>
        </ul>
      </div>
    </div>
  );
};

export default ProjectPrompt;