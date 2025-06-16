import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSignIn = async () => {
    if (!email || !password) {
      toast.error('Per favore inserisci email e password');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      toast.success('Accesso effettuato con successo!');
      onClose();
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      // Handle specific Supabase auth errors
      if (error.message?.includes('Invalid login credentials') || error.message?.includes('invalid_credentials')) {
        toast.error('Email o password non corretti. Verifica le tue credenziali e riprova.');
      } else if (error.message?.includes('Email not confirmed')) {
        toast.error('Per favore conferma la tua email prima di accedere.');
      } else if (error.message?.includes('Too many requests')) {
        toast.error('Troppi tentativi di accesso. Riprova tra qualche minuto.');
      } else {
        toast.error(error.message || 'Errore durante l\'accesso. Riprova.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      toast.error('Per favore inserisci email e password');
      return;
    }

    if (password.length < 6) {
      toast.error('La password deve essere di almeno 6 caratteri');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      toast.success('Account creato! Controlla la tua email per confermare.');
      onClose();
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      // Handle specific Supabase auth errors
      if (error.message?.includes('User already registered')) {
        toast.error('Un account con questa email esiste già. Prova ad accedere invece.');
      } else if (error.message?.includes('Password should be at least')) {
        toast.error('La password deve essere di almeno 6 caratteri');
      } else if (error.message?.includes('Invalid email')) {
        toast.error('Per favore inserisci un indirizzo email valido');
      } else {
        toast.error(error.message || 'Errore durante la registrazione. Riprova.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Accedi a Lovable Clone</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="signin">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Accedi</TabsTrigger>
            <TabsTrigger value="signup">Registrati</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="la-tua-email@esempio.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button 
              onClick={handleSignIn} 
              disabled={loading || !email || !password} 
              className="w-full"
            >
              {loading ? 'Accesso in corso...' : 'Accedi'}
            </Button>
            <p className="text-sm text-gray-600 text-center">
              Non hai un account? Passa alla scheda "Registrati"
            </p>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="la-tua-email@esempio.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
              <p className="text-xs text-gray-500">
                La password deve essere di almeno 6 caratteri
              </p>
            </div>
            <Button 
              onClick={handleSignUp} 
              disabled={loading || !email || !password} 
              className="w-full"
            >
              {loading ? 'Registrazione in corso...' : 'Registrati'}
            </Button>
            <p className="text-sm text-gray-600 text-center">
              Hai già un account? Passa alla scheda "Accedi"
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;