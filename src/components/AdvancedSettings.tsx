
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Code, Palette, Globe, Zap, GitBranch } from "lucide-react";
import { toast } from "sonner";

interface AdvancedSettingsProps {
  open: boolean;
  onClose: () => void;
}

const AdvancedSettings = ({ open, onClose }: AdvancedSettingsProps) => {
  const [settings, setSettings] = useState({
    // Editor Settings
    fontSize: '14',
    theme: 'vs-dark',
    tabSize: '2',
    wordWrap: true,
    minimap: true,
    autoSave: true,
    formatOnSave: true,
    
    // AI Settings
    aiProvider: 'openai',
    model: 'gpt-4o-mini',
    temperature: '0.7',
    maxTokens: '2000',
    systemPrompt: 'You are a helpful React/TypeScript developer...',
    
    // Project Settings
    autoBackup: true,
    versionLimit: '10',
    collaborationMode: true,
    publicSharing: false,
    
    // Performance
    previewMode: 'instant',
    bundleSize: 'optimized',
    hotReload: true,
    
    // Custom CSS
    customCSS: '',
    tailwindConfig: '',
  });

  const handleSaveSettings = () => {
    localStorage.setItem('lovable-advanced-settings', JSON.stringify(settings));
    toast.success('Impostazioni avanzate salvate');
    onClose();
  };

  const handleResetSettings = () => {
    localStorage.removeItem('lovable-advanced-settings');
    toast.success('Impostazioni ripristinate ai valori predefiniti');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Impostazioni Avanzate</h2>
            </div>
            <Button variant="outline" onClick={onClose}>
              ×
            </Button>
          </div>
        </div>

        <div className="p-6">
          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="editor" className="gap-2">
                <Code className="w-4 h-4" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="ai" className="gap-2">
                <Zap className="w-4 h-4" />
                AI
              </TabsTrigger>
              <TabsTrigger value="project" className="gap-2">
                <GitBranch className="w-4 h-4" />
                Progetto
              </TabsTrigger>
              <TabsTrigger value="ui" className="gap-2">
                <Palette className="w-4 h-4" />
                UI/UX
              </TabsTrigger>
              <TabsTrigger value="advanced" className="gap-2">
                <Globe className="w-4 h-4" />
                Avanzate
              </TabsTrigger>
            </TabsList>

            {/* Editor Settings */}
            <TabsContent value="editor" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurazione Editor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fontSize">Font Size</Label>
                      <Select value={settings.fontSize} onValueChange={(value) => setSettings({...settings, fontSize: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12">12px</SelectItem>
                          <SelectItem value="14">14px</SelectItem>
                          <SelectItem value="16">16px</SelectItem>
                          <SelectItem value="18">18px</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="theme">Tema Editor</Label>
                      <Select value={settings.theme} onValueChange={(value) => setSettings({...settings, theme: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vs-light">Light</SelectItem>
                          <SelectItem value="vs-dark">Dark</SelectItem>
                          <SelectItem value="hc-black">High Contrast</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="wordWrap">Word Wrap</Label>
                      <Switch
                        checked={settings.wordWrap}
                        onCheckedChange={(checked) => setSettings({...settings, wordWrap: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="minimap">Minimap</Label>
                      <Switch
                        checked={settings.minimap}
                        onCheckedChange={(checked) => setSettings({...settings, minimap: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="formatOnSave">Format on Save</Label>
                      <Switch
                        checked={settings.formatOnSave}
                        onCheckedChange={(checked) => setSettings({...settings, formatOnSave: checked})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Settings */}
            <TabsContent value="ai" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurazione AI</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="aiProvider">Provider AI</Label>
                      <Select value={settings.aiProvider} onValueChange={(value) => setSettings({...settings, aiProvider: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openai">OpenAI</SelectItem>
                          <SelectItem value="claude">Anthropic Claude</SelectItem>
                          <SelectItem value="gemini">Google Gemini</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="model">Modello</Label>
                      <Select value={settings.model} onValueChange={(value) => setSettings({...settings, model: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                          <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                          <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="temperature">Temperature</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="2"
                        value={settings.temperature}
                        onChange={(e) => setSettings({...settings, temperature: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxTokens">Max Tokens</Label>
                      <Input
                        type="number"
                        value={settings.maxTokens}
                        onChange={(e) => setSettings({...settings, maxTokens: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="systemPrompt">System Prompt Personalizzato</Label>
                    <Textarea
                      value={settings.systemPrompt}
                      onChange={(e) => setSettings({...settings, systemPrompt: e.target.value})}
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Project Settings */}
            <TabsContent value="project" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestione Progetto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="autoBackup">Backup Automatico</Label>
                        <p className="text-sm text-gray-600">Salva automaticamente ogni 5 minuti</p>
                      </div>
                      <Switch
                        checked={settings.autoBackup}
                        onCheckedChange={(checked) => setSettings({...settings, autoBackup: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="collaborationMode">Modalità Collaborazione</Label>
                        <p className="text-sm text-gray-600">Abilita editing collaborativo</p>
                      </div>
                      <Switch
                        checked={settings.collaborationMode}
                        onCheckedChange={(checked) => setSettings({...settings, collaborationMode: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="publicSharing">Condivisione Pubblica</Label>
                        <p className="text-sm text-gray-600">Permetti condivisione senza autenticazione</p>
                      </div>
                      <Switch
                        checked={settings.publicSharing}
                        onCheckedChange={(checked) => setSettings({...settings, publicSharing: checked})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="versionLimit">Limite Versioni Salvate</Label>
                    <Input
                      type="number"
                      value={settings.versionLimit}
                      onChange={(e) => setSettings({...settings, versionLimit: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* UI/UX Settings */}
            <TabsContent value="ui" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personalizzazione UI</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="customCSS">CSS Personalizzato</Label>
                    <Textarea
                      placeholder="/* Il tuo CSS personalizzato */"
                      value={settings.customCSS}
                      onChange={(e) => setSettings({...settings, customCSS: e.target.value})}
                      rows={6}
                      className="mt-1 font-mono"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tailwindConfig">Configurazione Tailwind</Label>
                    <Textarea
                      placeholder="// Configurazione Tailwind personalizzata"
                      value={settings.tailwindConfig}
                      onChange={(e) => setSettings({...settings, tailwindConfig: e.target.value})}
                      rows={4}
                      className="mt-1 font-mono"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Advanced Settings */}
            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Impostazioni Avanzate</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="previewMode">Modalità Preview</Label>
                    <Select value={settings.previewMode} onValueChange={(value) => setSettings({...settings, previewMode: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instant">Istantaneo</SelectItem>
                        <SelectItem value="debounced">Con Ritardo (500ms)</SelectItem>
                        <SelectItem value="manual">Manuale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="hotReload">Hot Reload</Label>
                        <p className="text-sm text-gray-600">Ricarica automatica al cambio codice</p>
                      </div>
                      <Switch
                        checked={settings.hotReload}
                        onCheckedChange={(checked) => setSettings({...settings, hotReload: checked})}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Zona Pericolosa</h4>
                    <div className="space-y-2">
                      <Button variant="outline" onClick={handleResetSettings} className="text-red-600 border-red-200">
                        Reset Tutte le Impostazioni
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-between">
          <div className="flex gap-2">
            <Badge variant="outline">v1.0.0</Badge>
            <Badge variant="secondary">Beta</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Annulla
            </Button>
            <Button onClick={handleSaveSettings} className="bg-gradient-to-r from-purple-600 to-pink-600">
              Salva Impostazioni
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;
