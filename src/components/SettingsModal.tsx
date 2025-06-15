
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const SettingsModal = ({ open, onClose }: SettingsModalProps) => {
  const [settings, setSettings] = useState({
    openaiKey: '',
    claudeKey: '',
    geminiKey: '',
    defaultAI: 'openai',
    autoSave: true,
    darkMode: false,
    notifications: true,
    codeFormatting: true
  });

  const handleSave = () => {
    // Save settings to localStorage or backend
    localStorage.setItem('lovable-clone-settings', JSON.stringify(settings));
    onClose();
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configurazione AI</CardTitle>
                <CardDescription>
                  Configura le tue API keys per i diversi provider AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openai">OpenAI API Key</Label>
                  <Input
                    id="openai"
                    type="password"
                    placeholder="sk-..."
                    value={settings.openaiKey}
                    onChange={(e) => setSettings({...settings, openaiKey: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="claude">Anthropic Claude API Key</Label>
                  <Input
                    id="claude"
                    type="password"
                    placeholder="sk-ant-..."
                    value={settings.claudeKey}
                    onChange={(e) => setSettings({...settings, claudeKey: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gemini">Google Gemini API Key</Label>
                  <Input
                    id="gemini"
                    type="password"
                    placeholder="AI..."
                    value={settings.geminiKey}
                    onChange={(e) => setSettings({...settings, geminiKey: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultAI">AI Predefinita</Label>
                  <Select value={settings.defaultAI} onValueChange={(value) => setSettings({...settings, defaultAI: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI GPT-4</SelectItem>
                      <SelectItem value="claude">Anthropic Claude</SelectItem>
                      <SelectItem value="gemini">Google Gemini</SelectItem>
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
                    <li>• Supporto per OpenAI, Claude, Gemini</li>
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Annulla
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            Salva Impostazioni
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
