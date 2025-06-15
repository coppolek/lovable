
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

// A unified user object to abstract away the provider
export interface UnifiedUser {
  uid: string;
  email: string | null;
  provider: 'supabase';
}

interface AuthContextType {
  user: UnifiedUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UnifiedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            setUser({
                uid: session.user.id,
                email: session.user.email || null,
                provider: 'supabase'
            });
        }
        setLoading(false);
    }
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        const supabaseUser = session?.user;
        if (supabaseUser) {
          setUser({
            uid: supabaseUser.id,
            email: supabaseUser.email || null,
            provider: 'supabase'
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{
      user,
      signIn,
      signUp,
      signOut,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
