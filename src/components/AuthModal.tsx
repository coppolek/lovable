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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const { signIn, signUp, resetPasswordForEmail } = useAuth();

  const handleSignIn = async () => {
    if (!email || !password) {
      toast.error('Per favore inserisci email e password');
      return;
    }

    setLoading(true);
    try {
      const result = await signIn(email, password);
      if (result?.error) {
        throw result.error;
      }
      toast.success('Accesso effettuato con successo!');
      onClose();
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      // Handle specific Supabase auth errors with more detailed messages
      if (error.message?.includes('Invalid login credentials') || 
          error.message?.includes('invalid_credentials') ||
          error.code === 'invalid_credentials') {
        toast.error('Credenziali non valide. Verifica che email e password siano corretti. Se hai appena creato l\'account, controlla la tua email per il link di conferma.');
      } else if (error.message?.includes('Email not confirmed') || 
                 error.message?.includes('email_not_confirmed')) {
        toast.error('Email non confermata. Controlla la tua casella di posta e clicca sul link di conferma prima di accedere.');
      } else if (error.message?.includes('Too many requests') || 
                 error.message?.includes('rate_limit')) {
        toast.error('Troppi tentativi di accesso. Attendi qualche minuto prima di riprovare.');
      } else if (error.message?.includes('User not found') || 
                 error.message?.includes('user_not_found')) {
        toast.error('Nessun account trovato con questa email. Verifica l\'indirizzo email o registrati per creare un nuovo account.');
      } else if (error.message?.includes('Invalid email')) {
        toast.error('Formato email non valido. Inserisci un indirizzo email corretto.');
      } else {
        // Generic fallback with helpful suggestions
        toast.error('Errore durante l\'accesso. Verifica le tue credenziali o prova a reimpostare la password se hai dimenticato.');
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

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Per favore inserisci un indirizzo email valido');
      return;
    }

    setLoading(true);
    try {
      const result = await signUp(email, password);
      if (result?.error) {
        throw result.error;
      }
      toast.success('Account creato con successo! Controlla la tua email (inclusa la cartella spam) per il link di conferma.');
      onClose();
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      // Handle specific Supabase auth errors
      if (error.message?.includes('User already registered') || 
          error.message?.includes('user_already_exists') ||
          error.code === 'user_already_exists') {
        toast.error('Un account con questa email esiste già. Prova ad accedere o usa il reset password se hai dimenticato la password.');
      } else if (error.message?.includes('Password should be at least') || 
                 error.message?.includes('weak_password')) {
        toast.error('La password deve essere di almeno 6 caratteri e sufficientemente sicura.');
      } else if (error.message?.includes('Invalid email') || 
                 error.message?.includes('invalid_email')) {
        toast.error('Formato email non valido. Inserisci un indirizzo email corretto.');
      } else if (error.message?.includes('Signup is disabled') || 
                 error.message?.includes('signup_disabled')) {
        toast.error('La registrazione è temporaneamente disabilitata. Riprova più tardi.');
      } else {
        toast.error('Errore durante la registrazione. Verifica i dati inseriti e riprova.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      toast.error('Per favore inserisci la tua email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      toast.error('Per favore inserisci un indirizzo email valido');
      return;
    }

    setResetLoading(true);
    try {
      const result = await resetPasswordForEmail(resetEmail);
      if (result?.error) {
        throw result.error;
      }
      toast.success('Email di reset password inviata! Controlla la tua casella di posta (inclusa la cartella spam).');
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      if (error.message?.includes('Invalid email') || 
          error.message?.includes('invalid_email')) {
        toast.error('Formato email non valido. Inserisci un indirizzo email corretto.');
      } else if (error.message?.includes('User not found') || 
                 error.message?.includes('user_not_found')) {
        toast.error('Nessun account trovato con questa email. Verifica l\'indirizzo email o registrati per creare un nuovo account.');
      } else if (error.message?.includes('Rate limit') || 
                 error.message?.includes('rate_limit')) {
        toast.error('Troppe richieste di reset. Attendi qualche minuto prima di riprovare.');
      } else {
        toast.error('Errore durante l\'invio dell\'email di reset. Verifica l\'indirizzo email e riprova.');
      }
    } finally {
      setResetLoading(false);
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
            {!showForgotPassword ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
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
                <div className="text-center space-y-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Password dimenticata?
                  </button>
                  <p className="text-sm text-gray-600">
                    Non hai un account? Passa alla scheda "Registrati"
                  </p>
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    <strong>Problemi di accesso?</strong><br/>
                    • Verifica che email e password siano corretti<br/>
                    • Se hai appena creato l'account, controlla la tua email per il link di conferma<br/>
                    • Usa "Password dimenticata?" se non ricordi la password
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email per il reset della password</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value.trim())}
                    placeholder="la-tua-email@esempio.com"
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleForgotPassword} 
                    disabled={resetLoading || !resetEmail} 
                    className="flex-1"
                  >
                    {resetLoading ? 'Invio in corso...' : 'Invia email di reset'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetEmail('');
                    }}
                    disabled={resetLoading}
                  >
                    Annulla
                  </Button>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Ti invieremo un'email con le istruzioni per reimpostare la password
                </p>
              </>
            )}
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
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
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Hai già un account? Passa alla scheda "Accedi"
              </p>
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                <strong>Dopo la registrazione:</strong><br/>
                Controlla la tua email (inclusa la cartella spam) per il link di conferma dell'account
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;