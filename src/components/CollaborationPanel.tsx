
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, UserPlus, Mail, Globe, Lock, Crown, Eye, Edit, MessageSquare, Share2 } from 'lucide-react';
import { toast } from "sonner";

interface CollaborationPanelProps {
  projectId?: string;
  isOwner?: boolean;
}

const CollaborationPanel = ({ projectId, isOwner }: CollaborationPanelProps) => {
  const [collaborators, setCollaborators] = useState([
    {
      id: '1',
      name: 'Mario Rossi',
      email: 'mario@example.com',
      role: 'owner',
      status: 'online',
      lastSeen: new Date(),
      avatar: 'MR'
    },
    {
      id: '2', 
      name: 'Giulia Bianchi',
      email: 'giulia@example.com',
      role: 'editor',
      status: 'away',
      lastSeen: new Date(Date.now() - 300000),
      avatar: 'GB'
    }
  ]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(2);
  const [comments, setComments] = useState([
    {
      id: '1',
      user: 'Giulia Bianchi',
      content: 'Ottimo lavoro sul design!',
      timestamp: new Date(Date.now() - 600000),
      resolved: false
    }
  ]);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      toast.error('Inserisci un indirizzo email');
      return;
    }

    setIsInviting(true);
    // Simulate API call
    setTimeout(() => {
      toast.success(`Invito inviato a ${inviteEmail}`);
      setInviteEmail('');
      setIsInviting(false);
    }, 1000);
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    setCollaborators(prev => 
      prev.map(c => c.id === userId ? { ...c, role: newRole } : c)
    );
    toast.success('Ruolo aggiornato');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="w-3 h-3 text-yellow-600" />;
      case 'editor': return <Edit className="w-3 h-3 text-blue-600" />;
      case 'viewer': return <Eye className="w-3 h-3 text-gray-600" />;
      default: return null;
    }
  };

  const formatLastSeen = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Ora';
    if (minutes < 60) return `${minutes}m fa`;
    if (hours < 24) return `${hours}h fa`;
    return date.toLocaleDateString('it-IT');
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold">Collaborazione</h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            {onlineUsers} online
          </Badge>
        </div>
        
        {isOwner && (
          <div className="flex gap-2">
            <Input
              placeholder="email@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleInvite()}
            />
            <Button 
              onClick={handleInvite}
              disabled={isInviting}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
            >
              <UserPlus className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Project Visibility */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Visibilità Progetto
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Privato</span>
                </div>
                <Badge variant="outline" className="text-xs">Attivo</Badge>
              </div>
              {isOwner && (
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <Share2 className="w-3 h-3 mr-1" />
                  Condividi pubblicamente
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Collaborators List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Collaboratori ({collaborators.length})</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {collaborators.map((collaborator) => (
              <div key={collaborator.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {collaborator.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div 
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(collaborator.status)}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-medium truncate">{collaborator.name}</p>
                      {getRoleIcon(collaborator.role)}
                    </div>
                    <p className="text-xs text-gray-500">
                      {collaborator.status === 'online' ? 'Online' : formatLastSeen(collaborator.lastSeen)}
                    </p>
                  </div>
                </div>
                
                {isOwner && collaborator.role !== 'owner' && (
                  <select
                    value={collaborator.role}
                    onChange={(e) => handleRoleChange(collaborator.id, e.target.value)}
                    className="text-xs border rounded px-2 py-1"
                  >
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Attività Recente
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="p-2 bg-gray-50 rounded text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{comment.user}</span>
                  <span className="text-gray-500">
                    {formatLastSeen(comment.timestamp)}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
            
            <Button variant="outline" size="sm" className="w-full text-xs">
              <MessageSquare className="w-3 h-3 mr-1" />
              Aggiungi commento
            </Button>
          </CardContent>
        </Card>

        {/* Permissions */}
        {isOwner && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Permessi</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span>Modifica codice</span>
                <Badge variant="outline">Editor</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Gestione versioni</span>
                <Badge variant="outline">Owner</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Invita membri</span>
                <Badge variant="outline">Owner</Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CollaborationPanel;
