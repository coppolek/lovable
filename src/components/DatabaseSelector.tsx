
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, Cloud, ArrowRight } from 'lucide-react';
import { DatabaseProvider, useDatabaseConfig } from '@/hooks/useDatabaseConfig';

interface DatabaseSelectorProps {
  onSelect: (provider: DatabaseProvider) => void;
  onCancel: () => void;
}

const DatabaseSelector = ({ onSelect, onCancel }: DatabaseSelectorProps) => {
  const { provider: currentProvider, setProvider } = useDatabaseConfig();

  const handleSelect = (provider: DatabaseProvider) => {
    setProvider(provider);
    onSelect(provider);
  };

  const databases = [
    {
      id: 'firebase' as DatabaseProvider,
      name: 'Firebase',
      description: 'Database NoSQL di Google con real-time sync',
      features: ['Real-time updates', 'Offline support', 'Scalabilità automatica'],
      icon: Cloud,
      color: 'bg-orange-500',
      recommended: true
    },
    {
      id: 'supabase' as DatabaseProvider,
      name: 'Supabase',
      description: 'Database PostgreSQL open-source con API REST',
      features: ['SQL completo', 'Row Level Security', 'Edge Functions'],
      icon: Database,
      color: 'bg-green-500',
      recommended: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Scegli il Database per il tuo Progetto
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Seleziona il provider di database che preferisci utilizzare. 
            Potrai sempre cambiare questa impostazione in seguito.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {databases.map((db) => {
            const Icon = db.icon;
            const isSelected = currentProvider === db.id;
            
            return (
              <Card 
                key={db.id} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  isSelected ? 'ring-2 ring-purple-600 shadow-lg' : ''
                }`}
                onClick={() => handleSelect(db.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${db.color} text-white`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {db.name}
                          {db.recommended && (
                            <Badge variant="secondary" className="text-xs">
                              Consigliato
                            </Badge>
                          )}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {db.description}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="text-purple-600">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Caratteristiche:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {db.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={onCancel}>
            Annulla
          </Button>
          <Button 
            onClick={() => handleSelect(currentProvider)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Continua con {currentProvider === 'firebase' ? 'Firebase' : 'Supabase'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSelector;
