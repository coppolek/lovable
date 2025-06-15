import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Clock, GitBranch, Download, RotateCcw } from "lucide-react";
import { useProjectVersions, ProjectVersion } from "@/hooks/useProjectVersions";
import { toast } from "sonner";
import { Timestamp } from 'firebase/firestore';

interface VersionHistoryProps {
  open: boolean;
  onClose: () => void;
  projectId?: string;
  onRevertToVersion: (code: string) => void;
  currentCode: string;
}

const VersionHistory = ({ open, onClose, projectId, onRevertToVersion, currentCode }: VersionHistoryProps) => {
  const { versions, loading, createVersion, revertToVersion } = useProjectVersions(projectId);
  const [newVersionTitle, setNewVersionTitle] = useState('');
  const [showCreateVersion, setShowCreateVersion] = useState(false);

  const handleCreateVersion = async () => {
    if (!newVersionTitle.trim()) {
      toast.error('Inserisci un titolo per la versione');
      return;
    }

    try {
      await createVersion(newVersionTitle, currentCode);
      setNewVersionTitle('');
      setShowCreateVersion(false);
      toast.success('Versione creata con successo');
    } catch (error) {
      toast.error('Errore durante la creazione della versione');
    }
  };

  const handleRevert = async (version: ProjectVersion) => {
    try {
      const code = await revertToVersion(version.id);
      onRevertToVersion(code);
      toast.success(`Ripristinato alla versione ${version.version_number}`);
      onClose();
    } catch (error) {
      toast.error('Errore durante il ripristino');
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return '';
    return timestamp.toDate().toLocaleString('it-IT');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Cronologia Versioni
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Create New Version */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Crea Nuova Versione</CardTitle>
            </CardHeader>
            <CardContent>
              {showCreateVersion ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="Titolo versione (es: 'Aggiunta funzionalità login')"
                    value={newVersionTitle}
                    onChange={(e) => setNewVersionTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateVersion()}
                  />
                  <Button onClick={handleCreateVersion}>
                    Salva
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateVersion(false)}>
                    Annulla
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setShowCreateVersion(true)} disabled={!projectId}>
                  <GitBranch className="w-4 h-4 mr-2" />
                  Crea Snapshot
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Versions List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Versioni Salvate</h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-gray-600">Caricamento versioni...</p>
              </div>
            ) : versions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <GitBranch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nessuna versione salvata</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Crea il tuo primo snapshot per iniziare a tracciare le versioni
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {versions.map((version, index) => (
                  <Card key={version.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant={index === 0 ? "default" : "secondary"}>
                            v{version.version_number}
                          </Badge>
                          <div>
                            <h4 className="font-semibold">{version.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              {formatDate(version.created_at)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {index !== 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRevert(version)}
                              className="gap-1"
                            >
                              <RotateCcw className="w-4 h-4" />
                              Ripristina
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(version.code);
                              toast.success('Codice copiato negli appunti');
                            }}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {index === 0 && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          Versione Corrente
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Chiudi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VersionHistory;
