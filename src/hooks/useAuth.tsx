
import { useState, useEffect, createContext, useContext } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { auth as firebaseAuth } from '@/integrations/firebase/client';
import { supabase } from '@/integrations/supabase/client';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useDatabaseConfig } from './useDatabaseConfig';

// A unified user object to abstract away the provider
export interface UnifiedUser {
  uid: string;
  email: string | null;
  provider: 'firebase' | 'supabase';
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
  const { provider } = useDatabaseConfig();

  useEffect(() => {
    setLoading(true);
    setUser(null);

    if (provider === 'firebase') {
      const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            provider: 'firebase'
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }
    
    if (provider === 'supabase') {
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
    }
  }, [provider]);

  const signIn = async (email: string, password: string) => {
    if (provider === 'firebase') {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    if (provider === 'firebase') {
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    }
  };

  const signOut = async () => {
    if (provider === 'firebase') {
      await firebaseSignOut(firebaseAuth);
    } else {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
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
