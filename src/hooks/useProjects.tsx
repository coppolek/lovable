
import { useState, useEffect } from 'react';
import { db } from '@/integrations/firebase/client';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { useAuth } from './useAuth';

export interface Project {
  id: string;
  name: string;
  description?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  code: string;
  is_public: boolean;
  user_id: string;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProjects = async () => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const q = query(
        collection(db, 'projects'),
        where('user_id', '==', user.uid),
        orderBy('created_at', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const userProjects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Project));
      setProjects(userProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (name: string, description?: string) => {
    if (!user) throw new Error('User not authenticated');

    const newProjectData = {
      name,
      description,
      user_id: user.uid,
      code: `import React from 'react';\n\nconst NewComponent = () => {\n  return (\n    <div className="p-4 bg-gray-100 rounded-lg shadow">\n      <h1 className="text-3xl font-bold text-gray-800">Hello, World!</h1>\n      <p className="mt-2 text-gray-600">This is your new component, ready to be customized.</p>\n      <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">\n        Click Me!\n      </button>\n    </div>\n  );\n};\n\nexport default NewComponent;\n`,
      is_public: false,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'projects'), newProjectData);

    const newProject: Project = {
      id: docRef.id,
      name,
      description,
      user_id: user.uid,
      code: newProjectData.code,
      is_public: false,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    };
    
    setProjects(prev => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = async (id: string, updates: Partial<Omit<Project, 'id' | 'created_at' | 'user_id'>>) => {
    if (!user) throw new Error('User not authenticated');

    const projectRef = doc(db, 'projects', id);
    
    await updateDoc(projectRef, {
      ...updates,
      updated_at: serverTimestamp(),
    });

    const updatedData = { ...updates, updated_at: Timestamp.now() };

    setProjects(prev => prev.map(p => 
      p.id === id 
        ? { ...p, ...updatedData } as Project
        : p
    ));
  };

  const deleteProject = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    await deleteDoc(doc(db, 'projects', id));

    setProjects(prev => prev.filter(p => p.id !== id));
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects,
  };
};
