import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Database, Server, Cloud, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface DatabaseConfig {
  supabase: {
    enabled: boolean;
    url: string;
    anonKey: string;
  };
  mysql: {
    enabled: boolean;
    host: string;
    port: string;
    database: string;
    username: string;
    password: string;
  };
}

const DatabaseSettings = () => {
  const [config, setConfig] = useState<DatabaseConfig>({
    supabase: {
      enabled: true,
      url: '',
      anonKey: ''
    },
    mysql: {
      enabled: false,
      host: 'localhost',
      port: '3306',
      database: 'lovable_clone',
      username: 'root',
      password: ''
    }
  });

  const [showPasswords, setShowPasswords] = useState({
    mysql: false
  });

  const [testResults, setTestResults] = useState<{
    supabase?: 'success' | 'error' | 'testing';
    mysql?: 'success' | 'error' | 'testing';
  }>({});

  useEffect(() => {
    // Load saved configuration
    const savedConfig = localStorage.getItem('database-config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading database config:', error);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('database-config', JSON.stringify(config));
    toast.success('Configurazione database salvata');
  };

  const testSupabaseConnection = async () => {
    if (!config.supabase.url || !config.supabase.anonKey) {
      toast.error('Inserisci URL e Anon Key di Supabase');
      return;
    }

    setTestResults(prev => ({ ...prev, supabase: 'testing' }));

    try {
      const response = await fetch(`${config.supabase.url}/rest/v1/`, {
        headers: {
          'apikey': config.supabase.anonKey,
          'Authorization': `Bearer ${config.supabase.anonKey}`
        }
      });

      if (response.ok) {
        setTestResults(prev => ({ ...prev, supabase: 'success' }));
        toast.success('✅ Connessione Supabase riuscita!');
      } else {
        throw new Error('Connection failed');
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, supabase: 'error' }));
      toast.error('❌ Connessione Supabase fallita');
    }
  };

  const testMySQLConnection = async () => {
    if (!config.mysql.host || !config.mysql.username || !config.mysql.database) {
      toast.error('Inserisci tutti i campi obbligatori per MySQL');
      return;
    }

    setTestResults(prev => ({ ...prev, mysql: 'testing' }));

    try {
      // Simulate MySQL connection test
      const response = await fetch('/api/mysql/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config.mysql)
      });

      if (response.ok) {
        setTestResults(prev => ({ ...prev, mysql: 'success' }));
        toast.success('✅ Connessione MySQL riuscita!');
      } else {
        throw new Error('Connection failed');
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, mysql: 'error' }));
      toast.error('❌ Connessione MySQL fallita. Verifica i parametri di connessione.');
    }
  };

  const getStatusIcon = (status?: 'success' | 'error' | 'testing') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'testing':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Configurazione Database</h2>
        <p className="text-gray-600">Configura le connessioni ai database per i tuoi progetti</p>
      </div>

      {/* Supabase Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-green-600" />
            Supabase
            <Badge className="bg-green-100 text-green-700">Cloud</Badge>
            {getStatusIcon(testResults.supabase)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="supabase-enabled">Abilita Supabase</Label>
              <p className="text-sm text-gray-500">Database PostgreSQL cloud con autenticazione integrata</p>
            </div>
            <Switch
              id="supabase-enabled"
              checked={config.supabase.enabled}
              onCheckedChange={(checked) => 
                setConfig(prev => ({ ...prev, supabase: { ...prev.supabase, enabled: checked } }))
              }
            />
          </div>

          {config.supabase.enabled && (
            <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div>
                <Label htmlFor="supabase-url">Project URL</Label>
                <Input
                  id="supabase-url"
                  placeholder="https://your-project.supabase.co"
                  value={config.supabase.url}
                  onChange={(e) => 
                    setConfig(prev => ({ ...prev, supabase: { ...prev.supabase, url: e.target.value } }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="supabase-anon-key">Anon Key</Label>
                <Input
                  id="supabase-anon-key"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={config.supabase.anonKey}
                  onChange={(e) => 
                    setConfig(prev => ({ ...prev, supabase: { ...prev.supabase, anonKey: e.target.value } }))
                  }
                />
              </div>

              <Button 
                onClick={testSupabaseConnection}
                disabled={testResults.supabase === 'testing'}
                className="w-full"
              >
                {testResults.supabase === 'testing' ? 'Test in corso...' : 'Testa Connessione'}
              </Button>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Trova questi valori nel tuo <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Dashboard Supabase</a> → Settings → API
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      {/* MySQL Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-600" />
            MySQL
            <Badge variant="outline" className="text-blue-700 border-blue-300">Self-hosted</Badge>
            {getStatusIcon(testResults.mysql)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="mysql-enabled">Abilita MySQL</Label>
              <p className="text-sm text-gray-500">Database relazionale tradizionale per massimo controllo</p>
            </div>
            <Switch
              id="mysql-enabled"
              checked={config.mysql.enabled}
              onCheckedChange={(checked) => 
                setConfig(prev => ({ ...prev, mysql: { ...prev.mysql, enabled: checked } }))
              }
            />
          </div>

          {config.mysql.enabled && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mysql-host">Host</Label>
                  <Input
                    id="mysql-host"
                    placeholder="localhost"
                    value={config.mysql.host}
                    onChange={(e) => 
                      setConfig(prev => ({ ...prev, mysql: { ...prev.mysql, host: e.target.value } }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="mysql-port">Porta</Label>
                  <Input
                    id="mysql-port"
                    placeholder="3306"
                    value={config.mysql.port}
                    onChange={(e) => 
                      setConfig(prev => ({ ...prev, mysql: { ...prev.mysql, port: e.target.value } }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="mysql-database">Nome Database</Label>
                <Input
                  id="mysql-database"
                  placeholder="lovable_clone"
                  value={config.mysql.database}
                  onChange={(e) => 
                    setConfig(prev => ({ ...prev, mysql: { ...prev.mysql, database: e.target.value } }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="mysql-username">Username</Label>
                <Input
                  id="mysql-username"
                  placeholder="root"
                  value={config.mysql.username}
                  onChange={(e) => 
                    setConfig(prev => ({ ...prev, mysql: { ...prev.mysql, username: e.target.value } }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="mysql-password">Password</Label>
                <div className="relative">
                  <Input
                    id="mysql-password"
                    type={showPasswords.mysql ? "text" : "password"}
                    placeholder="••••••••"
                    value={config.mysql.password}
                    onChange={(e) => 
                      setConfig(prev => ({ ...prev, mysql: { ...prev.mysql, password: e.target.value } }))
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setShowPasswords(prev => ({ ...prev, mysql: !prev.mysql }))}
                  >
                    {showPasswords.mysql ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                onClick={testMySQLConnection}
                disabled={testResults.mysql === 'testing'}
                className="w-full"
              >
                {testResults.mysql === 'testing' ? 'Test in corso...' : 'Testa Connessione'}
              </Button>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Assicurati che il server MySQL sia in esecuzione e che le credenziali siano corrette. 
                  Il database verrà creato automaticamente se non esiste.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          Salva Configurazione
        </Button>
      </div>
    </div>
  );
};

export default DatabaseSettings;