
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, UserPlus, Crown, Eye, Edit3, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Collaborator {
  id: string;
  user_id: string;
  role: 'owner' | 'editor' | 'viewer';
  username: string;
  joined_at: string;
  is_online: boolean;
}

interface CollaborationPanelProps {
  projectId?: string;
  isOwner: boolean;
}

const CollaborationPanel = ({ projectId, isOwner }: CollaborationPanelProps) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('viewer');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Simulazione collaboratori (in un'app reale verrebbero da Supabase)
  useEffect(() => {
    if (projectId && user) {
      setCollaborators([
        {
          id: '1',
          user_id: user.id,
          role: 'owner',
          username: user.email?.split('@')[0] || 'Owner',
          joined_at: new Date().toISOString(),
          is_online: true,
        }
      ]);
    }
  }, [projectId, user]);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      toast.error('Inserisci un email valido');
      return;
    }

    setLoading(true);
    try {
      // Simulazione invito collaboratore
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCollaborator: Collaborator = {
        id: Date.now().toString(),
        user_id: 'invited-' + Date.now(),
        role: inviteRole,
        username: inviteEmail.split('@')[0],
        joined_at: new Date().toISOString(),
        is_online: false,
      };

      setCollaborators(prev => [...prev, newCollaborator]);
      setInviteEmail('');
      toast.success(`Invito inviato a ${inviteEmail}`);
    } catch (error) {
      toast.error('Errore durante l\'invio dell\'invito');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCollaborator = async (collaboratorId: string) => {
    try {
      setCollaborators(prev => prev.filter(c => c.id !== collaboratorId));
      toast.success('Collaboratore rimosso');
    } catch (error) {
      toast.error('Errore durante la rimozione');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'editor': return <Edit3 className="w-4 h-4 text-blue-600" />;
      case 'viewer': return <Eye className="w-4 h-4 text-gray-600" />;
      default: return null;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'owner': return 'default';
      case 'editor': return 'secondary';
      case 'viewer': return 'outline';
      default: return 'outline';
    }
  };

  if (!projectId) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Seleziona un progetto per gestire la collaborazione</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Invite Section */}
      {isOwner && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Invita Collaboratori
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="email@esempio.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as 'editor' | 'viewer')}
                className="px-3 py-2 border rounded-md"
              >
                <option value="viewer">Visualizzatore</option>
                <option value="editor">Editor</option>
              </select>
              <Button onClick={handleInvite} disabled={loading}>
                {loading ? 'Invio...' : 'Invita'}
              </Button>
            </div>
            <div className="text-xs text-gray-600">
              <strong>Editor:</strong> Può modificare il codice e le impostazioni<br />
              <strong>Visualizzatore:</strong> Può solo visualizzare il progetto
            </div>
          </CardContent>
        </Card>
      )}

      {/* Collaborators List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Collaboratori ({collaborators.length})
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {collaborators.map((collaborator) => (
              <div key={collaborator.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        {collaborator.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {collaborator.is_online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{collaborator.username}</span>
                      {collaborator.is_online && (
                        <Badge variant="outline" className="text-xs">Online</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      Unito il {new Date(collaborator.joined_at).toLocaleDateString('it-IT')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={getRoleBadgeVariant(collaborator.role)} className="gap-1">
                    {getRoleIcon(collaborator.role)}
                    {collaborator.role === 'owner' ? 'Proprietario' : 
                     collaborator.role === 'editor' ? 'Editor' : 'Visualizzatore'}
                  </Badge>
                  
                  {isOwner && collaborator.role !== 'owner' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCollaborator(collaborator.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Rimuovi
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Attività Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-medium">{user?.email?.split('@')[0]}</span>
              ha modificato il codice • 2 minuti fa
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium">{user?.email?.split('@')[0]}</span>
              ha creato una nuova versione • 1 ora fa
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollaborationPanel;
