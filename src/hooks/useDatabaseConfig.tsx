
import { useState, useEffect, createContext, useContext } from 'react';

export type DatabaseProvider = 'firebase' | 'supabase';

interface DatabaseConfig {
  provider: DatabaseProvider;
  setProvider: (provider: DatabaseProvider) => void;
}

const DatabaseContext = createContext<DatabaseConfig | undefined>(undefined);

export const DatabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [provider, setProviderState] = useState<DatabaseProvider>('firebase');

  useEffect(() => {
    const saved = localStorage.getItem('database-provider');
    if (saved && (saved === 'firebase' || saved === 'supabase')) {
      setProviderState(saved);
    }
  }, []);

  const setProvider = (newProvider: DatabaseProvider) => {
    setProviderState(newProvider);
    localStorage.setItem('database-provider', newProvider);
  };

  return (
    <DatabaseContext.Provider value={{ provider, setProvider }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabaseConfig = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabaseConfig must be used within a DatabaseProvider');
  }
  return context;
};
