
import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Search, Code, FileText, Settings, GitBranch, Share2, Download, Plus, Zap } from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onCommand?: (command: string, args?: any) => void;
}

const CommandPalette = ({ open, onClose, onCommand }: CommandPaletteProps) => {
  const [search, setSearch] = useState('');

  const commands = useMemo(() => [
    // Project commands
    {
      id: 'new-project',
      title: 'Nuovo Progetto',
      description: 'Crea un nuovo progetto',
      icon: <Plus className="w-4 h-4" />,
      group: 'Progetto',
      keywords: ['nuovo', 'progetto', 'crea'],
      action: () => onCommand?.('newProject')
    },
    {
      id: 'save-project',
      title: 'Salva Progetto',
      description: 'Salva il progetto corrente',
      icon: <FileText className="w-4 h-4" />,
      group: 'Progetto',
      keywords: ['salva', 'save'],
      action: () => onCommand?.('saveProject')
    },
    {
      id: 'share-project',
      title: 'Condividi Progetto',
      description: 'Ottieni link di condivisione',
      icon: <Share2 className="w-4 h-4" />,
      group: 'Progetto',
      keywords: ['condividi', 'share'],
      action: () => onCommand?.('shareProject')
    },
    {
      id: 'export-project',
      title: 'Esporta Progetto',
      description: 'Esporta codice e configurazioni',
      icon: <Download className="w-4 h-4" />,
      group: 'Progetto',
      keywords: ['esporta', 'export', 'download'],
      action: () => onCommand?.('exportProject')
    },
    
    // Development commands
    {
      id: 'toggle-dev-mode',
      title: 'Toggle Dev Mode',
      description: 'Attiva/disattiva modalità sviluppatore',
      icon: <Code className="w-4 h-4" />,
      group: 'Sviluppo',
      keywords: ['dev', 'sviluppo', 'codice'],
      action: () => onCommand?.('toggleDevMode')
    },
    {
      id: 'version-history',
      title: 'Cronologia Versioni',
      description: 'Visualizza e gestisci versioni',
      icon: <GitBranch className="w-4 h-4" />,
      group: 'Sviluppo',
      keywords: ['versioni', 'history', 'git'],
      action: () => onCommand?.('openVersionHistory')
    },
    {
      id: 'ai-assistant',
      title: 'AI Assistant',
      description: 'Apri assistente AI',
      icon: <Zap className="w-4 h-4" />,
      group: 'AI',
      keywords: ['ai', 'assistente', 'aiuto'],
      action: () => onCommand?.('toggleAIAssistant')
    },
    
    // Settings commands
    {
      id: 'settings',
      title: 'Impostazioni',
      description: 'Apri impostazioni applicazione',
      icon: <Settings className="w-4 h-4" />,
      group: 'Impostazioni',
      keywords: ['impostazioni', 'settings', 'config'],
      action: () => onCommand?.('openSettings')
    }
  ], [onCommand]);

  const filteredCommands = useMemo(() => {
    if (!search) return commands;
    
    const searchLower = search.toLowerCase();
    return commands.filter(cmd => 
      cmd.title.toLowerCase().includes(searchLower) ||
      cmd.description.toLowerCase().includes(searchLower) ||
      cmd.keywords.some(keyword => keyword.includes(searchLower))
    );
  }, [search, commands]);

  const groupedCommands = useMemo(() => {
    const groups: { [key: string]: typeof commands } = {};
    filteredCommands.forEach(cmd => {
      if (!groups[cmd.group]) groups[cmd.group] = [];
      groups[cmd.group].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  const handleSelect = (command: typeof commands[0]) => {
    command.action();
    onClose();
    setSearch('');
  };

  useEffect(() => {
    if (!open) {
      setSearch('');
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0">
        <div className="flex items-center border-b px-3">
          <Search className="w-4 h-4 mr-2 text-gray-400" />
          <Input
            placeholder="Cerca comandi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 focus-visible:ring-0 h-12"
            autoFocus
          />
          <Badge variant="outline" className="ml-2 text-xs">
            Ctrl+K
          </Badge>
        </div>
        
        <Command className="max-h-96">
          <CommandList>
            {Object.keys(groupedCommands).length === 0 ? (
              <CommandEmpty>Nessun comando trovato.</CommandEmpty>
            ) : (
              Object.entries(groupedCommands).map(([group, commands]) => (
                <CommandGroup key={group} heading={group}>
                  {commands.map((command) => (
                    <CommandItem
                      key={command.id}
                      onSelect={() => handleSelect(command)}
                      className="flex items-center gap-3 p-3 cursor-pointer"
                    >
                      {command.icon}
                      <div className="flex-1">
                        <div className="font-medium">{command.title}</div>
                        <div className="text-sm text-gray-500">{command.description}</div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default CommandPalette;
