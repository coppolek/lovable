import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Server, Cloud } from "lucide-react";

interface DatabaseSelectorProps {
  onSelect: (database: 'supabase' | 'mysql') => void;
  selected?: 'supabase' | 'mysql';
}

const DatabaseSelector = ({ onSelect, selected }: DatabaseSelectorProps) => {
  const databases = [
    {
      id: 'supabase' as const,
      name: 'Supabase',
      description: 'PostgreSQL cloud database con autenticazione integrata',
      icon: <Cloud className="w-8 h-8" />,
      features: ['Autenticazione integrata', 'Real-time subscriptions', 'Edge Functions', 'Storage'],
      color: 'from-green-600 to-emerald-600',
      badge: 'Cloud',
      pros: ['Setup veloce', 'Scalabile', 'Sicuro'],
      recommended: true
    },
    {
      id: 'mysql' as const,
      name: 'MySQL',
      description: 'Database relazionale tradizionale per massimo controllo',
      icon: <Server className="w-8 h-8" />,
      features: ['Controllo completo', 'Performance elevate', 'Ampia compatibilità', 'Hosting locale'],
      color: 'from-blue-600 to-indigo-600',
      badge: 'Self-hosted',
      pros: ['Controllo totale', 'Performance', 'Flessibilità'],
      recommended: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Scegli il tuo Database</h2>
        <p className="text-gray-600">Seleziona il tipo di database che preferisci utilizzare per i tuoi progetti</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {databases.map((db) => (
          <Card 
            key={db.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selected === db.id ? 'ring-2 ring-purple-600 shadow-lg' : ''
            }`}
            onClick={() => onSelect(db.id)}
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${db.color} text-white`}>
                  {db.icon}
                </div>
                <div className="flex gap-2">
                  <Badge variant={db.recommended ? "default" : "secondary"}>
                    {db.badge}
                  </Badge>
                  {db.recommended && (
                    <Badge className="bg-green-100 text-green-800">
                      Consigliato
                    </Badge>
                  )}
                </div>
              </div>
              
              <CardTitle className="text-xl">{db.name}</CardTitle>
              <p className="text-gray-600 text-sm">{db.description}</p>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Caratteristiche principali:</h4>
                  <ul className="space-y-1">
                    {db.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-sm">Vantaggi:</h4>
                  <div className="flex flex-wrap gap-1">
                    {db.pros.map((pro, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {pro}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button 
                  className={`w-full ${selected === db.id ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                  variant={selected === db.id ? "default" : "outline"}
                >
                  <Database className="w-4 h-4 mr-2" />
                  {selected === db.id ? 'Selezionato' : 'Seleziona'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selected && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Hai selezionato <strong>{databases.find(db => db.id === selected)?.name}</strong>. 
            Puoi sempre cambiare questa impostazione in seguito.
          </p>
        </div>
      )}
    </div>
  );
};

export default DatabaseSelector;