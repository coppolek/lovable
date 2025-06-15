
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Lightbulb, Code, Palette, Bug, Zap, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Suggestion {
  id: string;
  type: 'improvement' | 'bug' | 'optimization' | 'feature';
  title: string;
  description: string;
  code?: string;
  priority: 'low' | 'medium' | 'high';
}

interface AIAssistantPanelProps {
  currentCode: string;
  onApplySuggestion: (code: string) => void;
}

const AIAssistantPanel = ({ currentCode, onApplySuggestion }: AIAssistantPanelProps) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  // Simulazione analisi AI del codice
  const analyzeCode = async () => {
    setIsAnalyzing(true);
    
    // Simulazione delay per analisi AI
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockSuggestions: Suggestion[] = [
      {
        id: '1',
        type: 'improvement',
        title: 'Migliorare Accessibilità',
        description: 'Aggiungere attributi ARIA per migliorare l\'accessibilità del componente',
        priority: 'high',
        code: `// Aggiungi attributi ARIA
<button aria-label="Submit form" role="button">
  Submit
</button>`
      },
      {
        id: '2',
        type: 'optimization',
        title: 'Ottimizzare Performance',
        description: 'Utilizzare useMemo per ottimizzare re-rendering di componenti costosi',
        priority: 'medium',
        code: `const memoizedValue = useMemo(() => {
  return expensiveCalculation(props);
}, [props]);`
      },
      {
        id: '3',
        type: 'feature',
        title: 'Aggiungere Loading State',
        description: 'Implementare uno stato di loading per migliorare UX',
        priority: 'medium',
        code: `const [isLoading, setIsLoading] = useState(false);

return (
  <Button disabled={isLoading}>
    {isLoading ? <Spinner /> : 'Submit'}
  </Button>
);`
      },
      {
        id: '4',
        type: 'bug',
        title: 'Gestione Errori',
        description: 'Aggiungere error boundary per catturare errori del componente',
        priority: 'high',
        code: `try {
  // Component logic
} catch (error) {
  console.error('Component error:', error);
  return <ErrorFallback />;
}`
      }
    ];

    setSuggestions(mockSuggestions);
    setIsAnalyzing(false);
    toast.success('Analisi completata! Trovati ' + mockSuggestions.length + ' suggerimenti');
  };

  const applySuggestion = (suggestion: Suggestion) => {
    if (suggestion.code) {
      onApplySuggestion(suggestion.code);
      toast.success('Suggerimento applicato al codice');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'improvement': return <Lightbulb className="w-4 h-4" />;
      case 'bug': return <Bug className="w-4 h-4" />;
      case 'optimization': return <Zap className="w-4 h-4" />;
      case 'feature': return <Sparkles className="w-4 h-4" />;
      default: return <Code className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'improvement': return 'bg-blue-100 text-blue-800';
      case 'bug': return 'bg-red-100 text-red-800';
      case 'optimization': return 'bg-green-100 text-green-800';
      case 'feature': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const quickActions = [
    {
      title: 'Aggiungi Animazioni',
      description: 'Implementa transizioni CSS fluide',
      action: () => {
        const animationCode = `
// Aggiungi questa classe CSS
.smooth-transition {
  transition: all 0.3s ease-in-out;
}

// Usa nel componente
<div className="smooth-transition hover:scale-105">
  Content
</div>`;
        onApplySuggestion(animationCode);
      }
    },
    {
      title: 'Responsive Design',
      description: 'Rendi il componente responsive',
      action: () => {
        const responsiveCode = `
// Classi responsive Tailwind
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="col-span-full lg:col-span-1">
    Mobile-first design
  </div>
</div>`;
        onApplySuggestion(responsiveCode);
      }
    },
    {
      title: 'Dark Mode Support',
      description: 'Aggiungi supporto tema scuro',
      action: () => {
        const darkModeCode = `
// Tema scuro con Tailwind
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  <h1 className="text-xl font-bold">
    Supporta tema scuro
  </h1>
</div>`;
        onApplySuggestion(darkModeCode);
      }
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Analisi Codice */}
          <div>
            <h3 className="font-semibold mb-3">Analisi Intelligente</h3>
            <Button 
              onClick={analyzeCode} 
              disabled={isAnalyzing || !currentCode}
              className="w-full gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Analizzando...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  Analizza Codice
                </>
              )}
            </Button>
          </div>

          {/* Prompt Personalizzato */}
          <div>
            <h3 className="font-semibold mb-3">Prompt Personalizzato</h3>
            <div className="space-y-2">
              <Textarea
                placeholder="Chiedi all'AI di migliorare il tuo codice (es: 'Aggiungi validazione form' o 'Ottimizza performance')"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={3}
              />
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  if (customPrompt.trim()) {
                    toast.success('Richiesta inviata all\'AI');
                    setCustomPrompt('');
                  }
                }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Invia all'AI
              </Button>
            </div>
          </div>

          {/* Azioni Rapide */}
          <div>
            <h3 className="font-semibold mb-3">Azioni Rapide</h3>
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={action.action}>
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-gray-600">{action.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggerimenti */}
          {suggestions.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Suggerimenti AI ({suggestions.length})</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`p-1 rounded ${getTypeColor(suggestion.type)}`}>
                          {getTypeIcon(suggestion.type)}
                        </span>
                        <span className="font-medium text-sm">{suggestion.title}</span>
                      </div>
                      <Badge variant={getPriorityVariant(suggestion.priority) as any}>
                        {suggestion.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-gray-600">{suggestion.description}</p>
                    
                    {suggestion.code && (
                      <div className="space-y-2">
                        <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                          <code>{suggestion.code}</code>
                        </pre>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => applySuggestion(suggestion)}
                          className="w-full"
                        >
                          Applica
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistantPanel;
