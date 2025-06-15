
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Wifi, WifiOff, Zap, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface StatusBarProps {
  isOnline?: boolean;
  lastSaved?: Date;
  buildStatus?: 'success' | 'error' | 'building';
  currentProject?: string;
}

const StatusBar = ({ isOnline = true, lastSaved, buildStatus = 'success', currentProject }: StatusBarProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatLastSaved = (date?: Date) => {
    if (!date) return 'Mai salvato';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Salvato ora';
    if (diff < 3600000) return `Salvato ${Math.floor(diff / 60000)}m fa`;
    return `Salvato ${Math.floor(diff / 3600000)}h fa`;
  };

  const getBuildStatusIcon = () => {
    switch (buildStatus) {
      case 'success':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      case 'building':
        return <Zap className="w-3 h-3 text-yellow-500 animate-pulse" />;
    }
  };

  const getBuildStatusText = () => {
    switch (buildStatus) {
      case 'success':
        return 'Build riuscita';
      case 'error':
        return 'Errore build';
      case 'building':
        return 'Building...';
    }
  };

  return (
    <div className="h-6 bg-gray-100 border-t flex items-center justify-between px-4 text-xs">
      <div className="flex items-center gap-4">
        {/* Connection Status */}
        <div className="flex items-center gap-1">
          {isOnline ? (
            <Wifi className="w-3 h-3 text-green-500" />
          ) : (
            <WifiOff className="w-3 h-3 text-red-500" />
          )}
          <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* Build Status */}
        <div className="flex items-center gap-1">
          {getBuildStatusIcon()}
          <span className={
            buildStatus === 'success' ? 'text-green-600' :
            buildStatus === 'error' ? 'text-red-600' :
            'text-yellow-600'
          }>
            {getBuildStatusText()}
          </span>
        </div>

        {/* Last Saved */}
        {lastSaved && (
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-gray-500" />
            <span className="text-gray-600">{formatLastSaved(lastSaved)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Current Project */}
        {currentProject && (
          <Badge variant="outline" className="text-xs">
            {currentProject}
          </Badge>
        )}

        {/* Current Time */}
        <span className="text-gray-500">
          {time.toLocaleTimeString('it-IT', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
};

export default StatusBar;
