
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Keyboard } from 'lucide-react';

interface ShortcutsHelpProps {
  open: boolean;
  onClose: () => void;
}

const ShortcutsHelp = ({ open, onClose }: ShortcutsHelpProps) => {
  const shortcuts = [
    {
      category: 'Generale',
      items: [
        { keys: ['Ctrl', 'K'], description: 'Apri palette comandi' },
        { keys: ['Ctrl', '/'], description: 'Mostra/nascondi shortcuts' },
        { keys: ['Ctrl', 'S'], description: 'Salva progetto' },
        { keys: ['Ctrl', 'N'], description: 'Nuovo progetto' },
      ]
    },
    {
      category: 'Sviluppo',
      items: [
        { keys: ['Ctrl', 'D'], description: 'Toggle modalità sviluppatore' },
        { keys: ['Ctrl', 'Enter'], description: 'Esegui codice' },
        { keys: ['Ctrl', 'Shift', 'F'], description: 'Formatta codice' },
      ]
    },
    {
      category: 'Navigazione',
      items: [
        { keys: ['Ctrl', 'B'], description: 'Toggle sidebar' },
        { keys: ['Ctrl', '1'], description: 'Pannello chat' },
        { keys: ['Ctrl', '2'], description: 'Pannello codice' },
        { keys: ['Ctrl', '3'], description: 'Pannello preview' },
      ]
    },
    {
      category: 'AI & Collaborazione',
      items: [
        { keys: ['Ctrl', 'Shift', 'A'], description: 'Attiva AI Assistant' },
        { keys: ['Ctrl', 'Shift', 'C'], description: 'Pannello collaborazione' },
        { keys: ['Ctrl', 'Shift', 'H'], description: 'Cronologia versioni' },
      ]
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Scorciatoie da Tastiera
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {shortcuts.map((category) => (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle className="text-lg">{category.category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.items.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <span key={keyIndex} className="flex items-center">
                          <Badge variant="outline" className="text-xs px-2 py-1">
                            {key}
                          </Badge>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="mx-1 text-gray-400">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Suggerimento:</strong> Premi <Badge variant="outline" className="mx-1">Ctrl+K</Badge> 
            per aprire la palette comandi e accedere rapidamente a tutte le funzionalità.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShortcutsHelp;
