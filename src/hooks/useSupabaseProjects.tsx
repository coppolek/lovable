
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface SupabaseProject {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  code: string;
  is_public: boolean;
  user_id: string;
}

export const useSupabaseProjects = () => {
  const [projects, setProjects] = useState<SupabaseProject[]>([]);
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
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
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
    };

    const { data, error } = await supabase
      .from('projects')
      .insert([newProjectData])
      .select()
      .single();

    if (error) throw error;

    const newProject: SupabaseProject = {
      ...data,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
    
    setProjects(prev => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = async (id: string, updates: Partial<Omit<SupabaseProject, 'id' | 'created_at' | 'user_id'>>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('projects')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.uid)
      .select()
      .single();

    if (error) throw error;

    setProjects(prev => prev.map(p => 
      p.id === id ? { ...p, ...data } : p
    ));
  };

  const deleteProject = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', user.uid);

    if (error) throw error;

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
