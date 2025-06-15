
import { useState, useEffect } from 'react';
import { db } from '@/integrations/firebase/client';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  addDoc,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { useAuth } from './useAuth';

export interface ProjectVersion {
  id: string;
  project_id: string;
  version_number: number;
  title: string;
  code: string;
  created_at: Timestamp;
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
      const q = query(
        collection(db, 'project_versions'),
        where('project_id', '==', projectId),
        orderBy('version_number', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const projectVersions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as ProjectVersion));
      setVersions(projectVersions);
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

    const newVersionData = {
      project_id: projectId,
      version_number: newVersionNumber,
      title,
      code,
      created_by: user.uid,
      created_at: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'project_versions'), newVersionData);
    
    const newVersion: ProjectVersion = {
      id: docRef.id,
      ...newVersionData,
      created_at: Timestamp.now(),
    };

    setVersions(prev => [newVersion, ...prev]);
    return newVersion;
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
