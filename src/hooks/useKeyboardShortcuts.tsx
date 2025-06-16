import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: ShortcutConfig[] = []) => {
  const defaultShortcuts: ShortcutConfig[] = [
    {
      key: 'k',
      ctrl: true,
      action: () => {
        // Apri comando palette
        const event = new CustomEvent('openCommandPalette');
        window.dispatchEvent(event);
      },
      description: 'Apri palette comandi'
    },
    {
      key: 'd',
      ctrl: true,
      action: () => {
        // Toggle dev mode
        const event = new CustomEvent('toggleDevMode');
        window.dispatchEvent(event);
      },
      description: 'Toggle modalità sviluppatore'
    },
    {
      key: 's',
      ctrl: true,
      action: () => {
        // Save project
        const event = new CustomEvent('saveProject');
        window.dispatchEvent(event);
        toast.success('Progetto salvato');
      },
      description: 'Salva progetto'
    },
    {
      key: 'n',
      ctrl: true,
      action: () => {
        // New project
        const event = new CustomEvent('newProject');
        window.dispatchEvent(event);
      },
      description: 'Nuovo progetto'
    },
    {
      key: '/',
      ctrl: true,
      action: () => {
        // Toggle shortcuts help
        const event = new CustomEvent('toggleShortcutsHelp');
        window.dispatchEvent(event);
      },
      description: 'Mostra/nascondi shortcuts'
    }
  ];

  const allShortcuts = [...defaultShortcuts, ...shortcuts];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Check if event.key exists and is a string before proceeding
    if (!event.key || typeof event.key !== 'string') {
      return;
    }

    const shortcut = allShortcuts.find(s => {
      const ctrlMatch = s.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
      const shiftMatch = s.shift ? event.shiftKey : !event.shiftKey;
      const altMatch = s.alt ? event.altKey : !event.altKey;
      
      return s.key.toLowerCase() === event.key.toLowerCase() && 
             ctrlMatch && shiftMatch && altMatch;
    });

    if (shortcut) {
      event.preventDefault();
      event.stopPropagation();
      shortcut.action();
    }
  }, [allShortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { shortcuts: allShortcuts };
};