
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Project {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  code: string;
  is_public: boolean;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProjects = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Since we don't have a projects table, we'll simulate with virtual_worlds for now
      const { data, error } = await supabase
        .from('virtual_worlds')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedProjects: Project[] = data?.map(world => ({
        id: world.id,
        name: world.name,
        description: world.description,
        created_at: world.created_at,
        updated_at: world.updated_at,
        code: JSON.stringify(world.features || []),
        is_public: world.is_public || false,
      })) || [];

      setProjects(mappedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (name: string, description?: string) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('virtual_worlds')
      .insert({
        name,
        description,
        creator_id: user.id,
        category: 'code-project',
        gradient: 'from-purple-600 to-pink-600',
        features: [],
        is_public: false,
      })
      .select()
      .single();

    if (error) throw error;

    const newProject: Project = {
      id: data.id,
      name: data.name,
      description: data.description,
      created_at: data.created_at,
      updated_at: data.updated_at,
      code: JSON.stringify(data.features || []),
      is_public: data.is_public || false,
    };

    setProjects(prev => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('virtual_worlds')
      .update({
        name: updates.name,
        description: updates.description,
        features: updates.code ? JSON.parse(updates.code) : undefined,
        is_public: updates.is_public,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('creator_id', user.id)
      .select()
      .single();

    if (error) throw error;

    setProjects(prev => prev.map(p => 
      p.id === id 
        ? { ...p, ...updates, updated_at: data.updated_at }
        : p
    ));
  };

  const deleteProject = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('virtual_worlds')
      .delete()
      .eq('id', id)
      .eq('creator_id', user.id);

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
