import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export interface MySQLProject {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  code: string;
  is_public: boolean;
  user_id: string;
}

export const useMySQLProjects = () => {
  const [projects, setProjects] = useState<MySQLProject[]>([]);
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
      const response = await fetch('/api/mysql/projects', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.uid}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching MySQL projects:', error);
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

    const response = await fetch('/api/mysql/projects', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user.uid}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProjectData),
    });

    if (!response.ok) {
      throw new Error('Failed to create project');
    }

    const newProject = await response.json();
    setProjects(prev => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = async (id: string, updates: Partial<Omit<MySQLProject, 'id' | 'created_at' | 'user_id'>>) => {
    if (!user) throw new Error('User not authenticated');

    const response = await fetch(`/api/mysql/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${user.uid}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update project');
    }

    const updatedProject = await response.json();
    setProjects(prev => prev.map(p => 
      p.id === id ? { ...p, ...updatedProject } : p
    ));
  };

  const deleteProject = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    const response = await fetch(`/api/mysql/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.uid}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete project');
    }

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