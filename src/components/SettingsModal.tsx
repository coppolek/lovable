import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, Key, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const SettingsModal = ({ open, onClose }: SettingsModalProps) => {
  const [settings, setSettings] = useState({
    openaiKey: '',
    claudeKey: '',
    geminiKey: '',
    defaultAI: 'gemini',
    autoSave: true,
    darkMode: false,
    notifications: true,
    codeFormatting: true
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('lovable-clone-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem('lovable-clone-settings', JSON.stringify(settings));
    onClose();
  };

  const openGeminiApiPage = () => {
    window.open('https://makersuite.google.com/app/apikey', '_blank');
  };

  const openOpenAIApiPage = () => {
    window.open('https://platform.openai.com/api-keys', '_blank');
  };

  const openClaudeApiPage = () => {
    window.open('https://console.anthropic.com/', '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Impostazioni</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="ai" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ai">AI APIs</TabsTrigger>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="general">Generale</TabsTrigger>
            <TabsTrigger value="about">Info</TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Raccomandato:</strong> Inizia con Gemini Flash - è completamente gratuito e offre prestazioni eccellenti per la generazione di codice!
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Configurazione AI
                </CardTitle>
                <CardDescription>
                  Configura le tue API keys per i diversi provider AI. Gemini Flash è gratuito e consigliato!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Gemini API Key */}
                <div className="space-y-3 p-4 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="gemini" className="font-semibold text-green-800">
                      Google Gemini API Key
                    </Label>
                    <Badge className="bg-green-600">Gratuito</Badge>
                  </div>
                  <Input
                    id="gemini"
                    type="password"
                    placeholder="Inserisci la tua API key Gemini..."
                    value={settings.geminiKey}
                    onChange={(e) => setSettings({...settings, geminiKey: e.target.value})}
                  />
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={openGeminiApiPage}
                      className="text-green-700 border-green-300 hover:bg-green-100"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ottieni API Key Gratuita
                    </Button>
                  </div>
                  <p className="text-sm text-green-700">
                    ✅ <strong>Completamente gratuito</strong> - Fino a 15 richieste al minuto<br/>
                    ✅ <strong>Veloce e affidabile</strong> - Ottimo per generazione codice<br/>
                    ✅ <strong>Facile da configurare</strong> - Bastano 2 minuti
                  </p>
                </div>

                {/* OpenAI API Key */}
                <div className="space-y-3 p-4 border border-amber-200 rounded-lg bg-amber-50">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="openai" className="font-semibold text-amber-800">
                      OpenAI API Key
                    </Label>
                    <Badge variant="outline" className="text-amber-700 border-amber-300">A Pagamento</Badge>
                  </div>
                  <Input
                    id="openai"
                    type="password"
                    placeholder="sk-..."
                    value={settings.openaiKey}
                    onChange={(e) => setSettings({...settings, openaiKey: e.target.value})}
                  />
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={openOpenAIApiPage}
                      className="text-amber-700 border-amber-300 hover:bg-amber-100"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ottieni API Key
                    </Button>
                  </div>
                  <p className="text-sm text-amber-700">
                    ⚠️ OpenAI richiede crediti a pagamento (~$0.002 per 1000 token)
                  </p>
                </div>

                {/* Claude API Key */}
                <div className="space-y-3 p-4 border border-purple-200 rounded-lg bg-purple-50">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="claude" className="font-semibold text-purple-800">
                      Anthropic Claude API Key
                    </Label>
                    <Badge variant="outline" className="text-purple-700 border-purple-300">A Pagamento</Badge>
                  </div>
                  <Input
                    id="claude"
                    type="password"
                    placeholder="sk-ant-..."
                    value={settings.claudeKey}
                    onChange={(e) => setSettings({...settings, claudeKey: e.target.value})}
                  />
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={openClaudeApiPage}
                      className="text-purple-700 border-purple-300 hover:bg-purple-100"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ottieni API Key
                    </Button>
                  </div>
                  <p className="text-sm text-purple-700">
                    ⚠️ Claude richiede crediti a pagamento
                  </p>
                </div>

                {/* Default AI Selection */}
                <div className="space-y-2">
                  <Label htmlFor="defaultAI">AI Predefinita</Label>
                  <Select value={settings.defaultAI} onValueChange={(value) => setSettings({...settings, defaultAI: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gemini">
                        <div className="flex items-center gap-2">
                          <span>Google Gemini</span>
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">Gratuito</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="openai">
                        <div className="flex items-center gap-2">
                          <span>OpenAI GPT-4</span>
                          <Badge variant="outline" className="text-xs">A Pagamento</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="claude">
                        <div className="flex items-center gap-2">
                          <span>Anthropic Claude</span>
                          <Badge variant="outline" className="text-xs">A Pagamento</Badge>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="editor" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preferenze Editor</CardTitle>
                <CardDescription>
                  Personalizza l'esperienza dell'editor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoSave">Auto-salvataggio</Label>
                    <p className="text-sm text-gray-500">Salva automaticamente le modifiche</p>
                  </div>
                  <Switch
                    id="autoSave"
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => setSettings({...settings, autoSave: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="codeFormatting">Formattazione automatica</Label>
                    <p className="text-sm text-gray-500">Formatta il codice automaticamente</p>
                  </div>
                  <Switch
                    id="codeFormatting"
                    checked={settings.codeFormatting}
                    onCheckedChange={(checked) => setSettings({...settings, codeFormatting: checked})}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Impostazioni Generali</CardTitle>
                <CardDescription>
                  Configura le preferenze generali dell'applicazione
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="darkMode">Tema scuro</Label>
                    <p className="text-sm text-gray-500">Attiva il tema scuro</p>
                  </div>
                  <Switch
                    id="darkMode"
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => setSettings({...settings, darkMode: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications">Notifiche</Label>
                    <p className="text-sm text-gray-500">Mostra notifiche per eventi importanti</p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={settings.notifications}
                    onCheckedChange={(checked) => setSettings({...settings, notifications: checked})}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lovable Clone</CardTitle>
                <CardDescription>
                  Informazioni sull'applicazione
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">v1.0.0</Badge>
                  <Badge variant="outline">React</Badge>
                  <Badge variant="outline">TypeScript</Badge>
                  <Badge variant="outline">Tailwind</Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Funzionalità</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Chat interface con AI multipli</li>
                    <li>• Editor di codice integrato</li>
                    <li>• Preview live dei componenti</li>
                    <li>• Supporto per Gemini Flash (gratuito), OpenAI, Claude</li>
                    <li>• Design responsive</li>
                    <li>• Animazioni fluide</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Tecnologie</h4>
                  <p className="text-sm text-gray-600">
                    Costruito con React, TypeScript, Tailwind CSS, e shadcn/ui
                  </p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-1">🎉 Novità: Gemini Flash Gratuito!</h4>
                  <p className="text-sm text-green-700">
                    Ora puoi utilizzare Google Gemini Flash completamente gratis per generare codice di alta qualità.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Annulla
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Salva Impostazioni
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;