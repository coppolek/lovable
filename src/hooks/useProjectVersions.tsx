
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface ProjectVersion {
  id: string;
  project_id: string;
  version_number: number;
  title: string;
  code: string;
  created_at: string;
  created_by: string;
}

export const useProjectVersions = (projectId?: string) => {
  const [versions, setVersions] = useState<ProjectVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchVersions = async () => {
    if (!projectId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('project_versions')
        .select('*')
        .eq('project_id', projectId)
        .order('version_number', { ascending: false });

      if (error) throw error;
      setVersions(data || []);
    } catch (error) {
      console.error('Error fetching versions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createVersion = async (title: string, code: string) => {
    if (!user || !projectId) throw new Error('User not authenticated or no project');

    const lastVersion = versions.length > 0 ? versions[0] : null;
    const newVersionNumber = lastVersion ? lastVersion.version_number + 1 : 1;

    const { data, error } = await supabase
      .from('project_versions')
      .insert({
        project_id: projectId,
        version_number: newVersionNumber,
        title,
        code,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    setVersions(prev => [data, ...prev]);
    return data;
  };

  const revertToVersion = async (versionId: string) => {
    const version = versions.find(v => v.id === versionId);
    if (!version) throw new Error('Version not found');

    return version.code;
  };

  useEffect(() => {
    if (projectId) {
      fetchVersions();
    } else {
      setVersions([]);
    }
  }, [projectId]);

  return {
    versions,
    loading,
    createVersion,
    revertToVersion,
    refetch: fetchVersions,
  };
};
